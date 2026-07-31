# Деплой StudioGate на Beget VPS (рядом с другими проектами)

Да, можно на том же VPS. Главное: **не занимать чужие порты** и повесить StudioGate на **свой поддомен**.

Пример:
- уже крутится: `mysite.ru`, `bot.mysite.ru` …
- StudioGate: `gate.ваш-домен.ru` → внутри сервера порт `3001`

---

## Что понадобится

1. SSH-доступ к VPS Beget (root или sudo)
2. Домен (или поддомен), DNS A-запись на IP VPS
3. На сервере уже обычно есть **Nginx** (или Caddy) — его и используем как «входную дверь» с HTTPS

Память: StudioGate на пилот хватает **~512 MB–1 GB**. Если на VPS 1–2 GB и ещё проекты — следите, чтобы не убить память (swap желателен).

---

## Схема

```
Интернет → Nginx (443, HTTPS) → localhost:3001 (StudioGate / Docker)
                              → localhost:XXXX (ваши другие проекты)
```

Каждый проект = свой порт + свой `server_name` в Nginx.

---

## Шаг 1. DNS

В панели домена создайте запись:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `gate` | IP вашего VPS Beget |

Подождите 5–30 минут, пока доедет.

Проверка с ноутбука:
```bash
ping gate.ваш-домен.ru
```

---

## Шаг 2. Зайти на сервер

```bash
ssh root@IP_ВАШЕГО_VPS
# или пользователь от Beget
```

---

## Шаг 3. Поставить Docker (если ещё нет)

```bash
docker --version || curl -fsSL https://get.docker.com | sh
docker compose version || apt-get update && apt-get install -y docker-compose-plugin
```

Если Docker уже стоит для других проектов — **ничего не ломайте**, просто добавите ещё один контейнер.

---

## Шаг 4. Скачать код на сервер

```bash
mkdir -p /opt/studiogate
cd /opt/studiogate

# вариант A — git clone (если репозиторий доступен)
git clone https://github.com/x3-team/monolit.git repo
cd repo/studio-access

# вариант B — залить папку studio-access с ноутбука:
# scp -r ./studio-access root@IP:/opt/studiogate/app
```

Дальше считаем, что вы в папке с `docker-compose.yml` (т.е. `studio-access`).

---

## Шаг 5. Секреты и URL

Создайте файл `.env` (не коммитьте его):

```bash
nano .env
```

Содержимое (подставьте свой домен и длинные секреты):

```env
DATABASE_URL=file:/data/studiogate.db
JWT_SECRET=замените-на-длинную-случайную-строку-32plus
SESSION_SECRET=ещё-одна-длинная-случайная-строка-32plus
APP_URL=https://gate.ваш-домен.ru
NEXT_PUBLIC_APP_URL=https://gate.ваш-домен.ru
```

Секреты можно сгенерировать так:
```bash
openssl rand -hex 32
```

Обновите `docker-compose.yml`, чтобы он читал `.env` и **не публиковал порт наружу на весь интернет** (только localhost) — безопаснее рядом с другими проектами:

```yaml
services:
  studiogate:
    build: .
    ports:
      - "127.0.0.1:3001:3001"
    env_file:
      - .env
    environment:
      DATABASE_URL: file:/data/studiogate.db
      APP_URL: ${APP_URL}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
      JWT_SECRET: ${JWT_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
    volumes:
      - studiogate_data:/data
    restart: unless-stopped

volumes:
  studiogate_data:
```

Если порт `3001` уже занят другим проектом:
```bash
ss -tlnp | grep 3001
```
тогда в compose поставьте, например, `127.0.0.1:3011:3001` и в Nginx proxy на `3011`.

---

## Шаг 6. Собрать и запустить

```bash
docker compose up -d --build
docker compose logs -f --tail=100
```

Проверка с самого сервера:
```bash
curl -I http://127.0.0.1:3001
```

Должен ответить Next.js (не 502).

Демо-логины после первого старта (если seed не гоняли вручную — в Docker сейчас только `db push`, без seed):

Чтобы засеять демо-пользователя один раз:
```bash
docker compose exec studiogate npx tsx prisma/seed.ts
# если tsx/seed нет в образе — зайдите и создайте студию через /register в браузере
```

Проще для боя: откройте `https://gate…/register` и создайте свою студию (без демо).

> В текущем Dockerfile seed при старте не вызывается — только `prisma db push`. Для пилота регистрируйтесь через «Создать студию».

---

## Шаг 7. Nginx: поддомен → порт StudioGate

Найдите, где у вас конфиги Nginx на Beget (часто `/etc/nginx/sites-available/` или `/etc/nginx/conf.d/`).

Создайте сайт:

```bash
nano /etc/nginx/sites-available/studiogate.conf
```

```nginx
server {
    listen 80;
    server_name gate.ваш-домен.ru;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Включить и проверить:
```bash
ln -sf /etc/nginx/sites-available/studiogate.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## Шаг 8. HTTPS (Let's Encrypt)

Если certbot уже стоит:
```bash
certbot --nginx -d gate.ваш-домен.ru
```

Если нет:
```bash
apt-get update && apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d gate.ваш-домен.ru
```

Откройте в браузере: `https://gate.ваш-домен.ru`  
Должен открыться лендинг StudioGate на русском.

---

## Шаг 9. Вшить URL в десктоп-приложение

На своём компьютере (не обязательно на VPS):

1. В `studio-access/desktop/config.json`:
```json
{
  "serverUrl": "https://gate.ваш-домен.ru",
  "productName": "StudioGate",
  "allowServerOverride": false
}
```

2. Собрать установщик:
```bash
cd studio-access
npm install
npm run dist:win    # Windows
# на Mac: npm run dist:mac
```

3. Отдать дизайнерам файл из `release/`.

Дизайнер: скачал → открыл → вошёл → «Открыть Figma». Без ручного ввода ссылки.

---

## Обновление кода позже

```bash
cd /opt/studiogate/repo   # или ваш путь
git pull
cd studio-access
docker compose up -d --build
```

База в Docker volume `studiogate_data` **не сотрётся** при пересборке.

Бэкап базы:
```bash
docker compose exec studiogate ls -la /data
# скопировать файл БД с volume:
docker run --rm -v studiogate_studiogate_data:/data -v $(pwd):/backup alpine \
  cp /data/studiogate.db /backup/studiogate-$(date +%F).db
```
(имя volume может отличаться — смотрите `docker volume ls | grep studiogate`)

---

## Частые проблемы

| Симптом | Что проверить |
|--------|----------------|
| 502 Bad Gateway | контейнер запущен? `docker compose ps`, `curl 127.0.0.1:3001` |
| Сайт не открывается | DNS A-запись, `nginx -t`, firewall Beget (80/443) |
| Порт занят | другой проект на 3001 → смените на 3011 |
| После логина странный URL | в `.env` должен быть именно `https://gate…`, не `http://localhost` |
| Cookie/логин не держится | HTTPS обязателен в проде; `APP_URL` с `https://` |

---

## Чего не делать

- Не ставьте StudioGate на `:`80 напрямую, если Nginx уже обслуживает другие сайты.
- Не открывайте порт 3001 в интернет (`0.0.0.0:3001`) — только `127.0.0.1`.
- Не оставляйте `JWT_SECRET=change-me` в проде.
- Не раздавайте self-host клиентам без срока действия / оплаты (иначе «навсегда бесплатно»).

---

## Минимальный чеклист пилота

1. [ ] DNS `gate.…` → IP VPS  
2. [ ] `docker compose up -d --build`  
3. [ ] Nginx + HTTPS  
4. [ ] Открывается лендинг, регистрация студии работает  
5. [ ] В `config.json` ваш URL, пересобрано приложение  
6. [ ] Owner сделал Connect Figma/Higgsfield с десктопа  
7. [ ] Фрилансер Open → Revoke  

Если пришлёте: ОС на VPS (`Ubuntu 22?`), есть ли уже Nginx/Docker и свободный домен — можно сузить инструкцию до точных команд под ваш сервер.

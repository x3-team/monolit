# StudioGate — полная инструкция запуска

Роли:
- **Owner** — вы (владелец студии): Connect Figma, invite людей, revoke
- **Developer** — ваш разработчик: VPS, домен, деплой сервера, сборка приложения
- **Designer** — дизайнеры/фрилансеры: ставят приложение и жмут Open Figma

---

## Порядок работ (общий)

1. Developer поднимает сервер на VPS  
2. Developer вшивает URL сервера в приложение и собирает Mac/Windows  
3. Owner регистрирует студию на сервере и подключает Figma  
4. Owner создаёт доступы дизайнерам  
5. Designers ставят приложение и работают  
6. Owner при необходимости делает Revoke  

---

# Часть A. Что делает Developer

## A1. Подготовить VPS
Нужен простой сервер:
- Ubuntu 22.04+
- 1–2 GB RAM
- публичный IP
- желательно домен, например `gate.yourstudio.com`

Установить Docker:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
# перелогиниться
```

## A2. Забрать код

```bash
git clone https://github.com/x3-team/monolit.git
cd monolit
git checkout cursor/studio-access-mvp-2861
cd studio-access
```

## A3. Настроить env для сервера

Создать файл `.env` на сервере:

```bash
cp .env.example .env
```

Прописать минимум:

```env
DATABASE_URL="file:/data/studiogate.db"
JWT_SECRET="длинный-случайный-секрет-1"
SESSION_SECRET="длинный-случайный-секрет-2-32символа"
APP_URL="https://gate.yourstudio.com"
NEXT_PUBLIC_APP_URL="https://gate.yourstudio.com"
```

> Замените `gate.yourstudio.com` на ваш домен.

## A4. Поднять сервер через Docker

```bash
# в studio-access
docker compose up -d --build
```

Проверка:

```bash
curl -I http://127.0.0.1:3001
```

Должен отвечать сервер Next.js.

## A5. Повесить HTTPS (Caddy — самый простой вариант)

Установить Caddy и проксировать домен на `localhost:3001`.

Пример Caddyfile:

```caddy
gate.yourstudio.com {
  reverse_proxy 127.0.0.1:3001
}
```

DNS: A-запись домена → IP VPS.

Проверка в браузере:
`https://gate.yourstudio.com`

Должна открыться страница StudioGate.

## A6. Вшить URL сервера в приложение

Файл:

`studio-access/desktop/config.json`

```json
{
  "serverUrl": "https://gate.yourstudio.com",
  "productName": "StudioGate",
  "allowServerOverride": false
}
```

## A7. Собрать приложения для команды

### Windows (можно на Windows-машине или через CI)
```bash
cd studio-access
npm install
npm run dist:win
```

Или использовать уже выложенный zip (если URL ещё localhost/заглушка — лучше пересобрать с вашим доменом):
https://github.com/x3-team/monolit/releases/tag/studiogate-v0.1.0

### Mac (только на Mac)
```bash
cd studio-access
npm install
npm run dist:mac
```

Файлы появятся в `studio-access/release/`.

## A8. Отдать Owner’у
Передать:
1. URL сервера: `https://gate.yourstudio.com`
2. Windows-приложение
3. Mac-приложение (`.dmg`)
4. Подтверждение, что сервер 24/7 запущен

---

# Часть B. Что делаете вы (Owner)

## B1. Открыть кабинет
В обычном браузере:

`https://gate.yourstudio.com`

## B2. Зарегистрировать студию
`/register`
- название студии
- ваш email
- пароль

Вы становитесь Owner.

## B3. Подготовить Figma team-аккаунт
Важно:
- используйте **отдельный TEAM/member аккаунт Figma**
- **не** billing-owner аккаунт
- у него должны быть нужные файлы/проекты

## B4. Подключить Figma через приложение Owner
1. Открыть приложение StudioGate (собранное Developer’ом)
2. Войти вашим Owner email/паролем
3. У Figma нажать **Connect team account**
4. В спец-окне войти в TEAM Figma
5. Дождаться файлов
6. Нажать **Save session**

Статус Figma должен стать Connected.

## B5. Создать доступы дизайнерам
В кабинете:
1. Invite freelancer
2. Имя
3. Email дизайнера
4. Временный пароль
5. Галочка **FIGMA**
6. Create member access

## B6. Отправить дизайнеру 3 вещи
1. Файл приложения (Mac или Windows)
2. Его email StudioGate
3. Его пароль StudioGate

> Ссылку сервера дизайнеру слать не обязательно — она уже вшита в приложение.

## B7. Рабочий цикл
- дизайнер работает через Open Figma
- проект закончен → в кабинете **Revoke**
- доступ у этого человека пропадает
- остальные продолжают работать

## B8. Что проверять каждый день пилота
- сервер онлайн
- Connect Figma не отвалился (если отвалился — Connect заново)
- Revoke реально режет доступ

---

# Часть C. Что делает Designer

1. Скачать/получить приложение StudioGate  
2. Открыть  
3. Войти email + пароль  
4. Нажать **Open** у Figma  
5. Работать  

Пароль Figma ему не нужен.  
Ссылку сервера он не настраивает.

Инструкция для них: `FOR_DESIGNERS.md`

---

# Часть D. Если что-то не работает

## Дизайнер не может войти
- неверный email/пароль
- человек не создан в кабинете
- сервер недоступен

## Open Figma снова просит логин
- Owner не сделал Connect / сессия протухла
- Owner должен снова Connect + Save session
- лучше email/password team-аккаунт, не сложный Google SSO

## У всех пропал доступ
- упал VPS / Docker
- Developer проверяет `docker compose ps` и логи

## Чужой команде дали пилот
Не отдавать им self-host сервер.  
Они получают только приложение + аккаунт на **вашем** сервере.  
Trial/отключение делаете вы на сервере.

---

# Чеклист “можно пускать команду”

- [ ] `https://gate...` открывается
- [ ] Owner зарегистрирован
- [ ] Figma Connected
- [ ] Собраны Mac/Windows приложения с правильным `config.json`
- [ ] 1 тестонер успешно сделал Open Figma
- [ ] Revoke на нём проверен
- [ ] VPS не выключается

---

# Кому что принадлежит

| Задача | Кто |
|---|---|
| VPS, домен, HTTPS, Docker | Developer |
| Сборка `.dmg` / Windows app | Developer |
| Регистрация студии | Owner |
| Connect Figma | Owner |
| Invite / Revoke людей | Owner |
| Установка приложения и работа | Designer |

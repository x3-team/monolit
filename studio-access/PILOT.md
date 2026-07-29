# StudioGate — пилот на вашей команде (Figma)

## Честный статус

**Программа уже есть** (`studio-access/desktop`), но это пока **dev-запуск через Electron**, не магазинный установщик `.dmg/.exe`.

Для теста на своей студии этого достаточно:
1. Один компьютер-сервер (ваш Mac) поднимает веб-кабинет
2. Вы и дизайнеры запускают desktop-приложение StudioGate
3. Вы Connect team-аккаунт Figma
4. Дизайнеры Open → работают → вы Revoke

Higgsfield можно подключить тем же способом после Figma.

---

## Самый короткий релиз (сегодня / завтра)

### Что нужно
- Mac или Windows у вас (owner)
- Node.js 20+ на машинах, где будут открывать Figma через StudioGate
- **Отдельный Figma Team/Member аккаунт** (не billing owner)
- Email’ы дизайнеров/разработчиков

### A. Поднять кабинет на вашем компьютере

```bash
git clone https://github.com/x3-team/monolit.git
cd monolit
git checkout cursor/studio-access-mvp-2861
cd studio-access
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Кабинет: http://localhost:3001

Зарегистрируйте **свою студию** через `/register` (ваш email),  
либо используйте демо и потом создайте своих людей.

### B. Узнать IP в локальной сети (чтобы команда ходила к вам)

На Mac:
```bash
ipconfig getifaddr en0
```

Пример: `192.168.1.42`  
Тогда URL кабинета для команды: `http://192.168.1.42:3001`

> Все должны быть в одной Wi‑Fi/LAN.  
> Если люди удалённо — сделайте Cloudflare Tunnel (ниже).

### C. Запуск desktop у owner

В втором терминале:

```bash
cd studio-access
STUDIOGATE_URL=http://localhost:3001 npm run desktop
```

1. Login owner  
2. Figma → **Connect (desktop)**  
3. В окне войдите в **TEAM Figma аккаунт**  
4. Дождитесь файлов Figma  
5. Нажмите **Save session**  

### D. Выдать доступ дизайнерам

В кабинете:
1. Invite freelancer  
2. Имя + email + временный пароль  
3. Галочка **FIGMA**  
4. Create member access  
5. Передайте человеку: URL + email + пароль StudioGate

### E. Запуск у дизайнера

На компьютере дизайнера:

```bash
git clone https://github.com/x3-team/monolit.git
cd monolit/studio-access
npm install
STUDIOGATE_URL=http://ВАШ_IP:3001 npm run desktop
```

Далее:
1. Login своим StudioGate email  
2. Open → Figma  
3. Работает в спец-окне  
4. Пароль Figma не видит

### F. Забрать доступ
Owner → Team → **Revoke**

---

## Если команда не в одном офисе (удалённо)

Самый быстрый публичный URL без деплоя:

```bash
# отдельный терминал, пока крутится npm run dev
npx cloudflared tunnel --url http://localhost:3001
```

Получите `https://....trycloudflare.com`  
Всем ставить:

```bash
STUDIOGATE_URL=https://....trycloudflare.com npm run desktop
```

---

## Порядок теста на 1–2 дня

| Когда | Что сделать | Успех |
|---|---|---|
| Час 1 | Owner поднимает кабинет + Connect Figma | Open у owner открывает Figma без повторного логина |
| Час 2 | 1 дизайнер получает доступ | Дизайнер открывает Figma через StudioGate |
| День 1 | 2–3 человека работают | Нет паролей в чатах, доступы видны в логе |
| День 2 | Revoke одного | Человек больше не входит |
| День 2 | Решение | Пилот ок / нужны доработки |

---

## Важно про Figma

1. Подключайте **team seat/member**, не billing owner.  
2. Session sharing — серая зона ToS Figma; для внутреннего пилота ок, для внешнего SaaS потом лучше официальные seats + StudioGate как контроль/онбординг.  
3. Если после Open снова просит логин — сессия не захватилась: повторите Connect и жмите Save только когда уже видны файлы.  
4. Google login / SSO иногда ломает cookie-capture — для пилота лучше email+password team account.

---

## Что ещё не “продуктовый релиз”

- Нет одного клика `.dmg` установщика (пока `npm run desktop`)
- Нет облачного хостинга из коробки (пока ваш Mac + LAN/tunnel)
- Нет invite-письма на почту (пароль передаёте вручную)
- Higgsfield тем же flow, но сначала стабилизируйте Figma

Это нормально для **внутреннего пилота**. После 3–5 дней на своей команде упакуем installer и вынесем сервер в облако.

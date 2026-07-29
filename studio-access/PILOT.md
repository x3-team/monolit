# StudioGate — пилот на вашей команде (Figma)

## Для дизайнеров должно быть просто

Они **не** трогают Git/npm.

Их путь:
1. Скачать приложение StudioGate (`.dmg` / `.exe`)
2. Открыть
3. Вставить ссылку студии (один раз)
4. Войти email/паролем
5. Нажать **Open Figma**

Инструкция для них: `FOR_DESIGNERS.md`  
Сборка приложения: `BUILD_APP.md`

---

## Что делаете вы (owner) — короткий путь

### 1) Поднять сервер студии на своём Mac
```bash
cd studio-access
npm install
cp .env.example .env
npm run db:setup
npm run dev
```
Кабинет: http://localhost:3001  
Зарегистрируйте студию на свой email.

### 2) Сделать ссылку для команды
В офисе:
```bash
ipconfig getifaddr en0
# пример: http://192.168.1.42:3001
```

Удалённо:
```bash
npx cloudflared tunnel --url http://localhost:3001
```

### 3) Собрать простое приложение
На Mac:
```bash
npm run dist:mac
```
Файл будет в `release/` — его и отправляете дизайнерам.

### 4) Connect Figma team-аккаунт
```bash
npm run desktop:local
```
или откройте собранное приложение, укажите свою ссылку студии, войдите как owner:
- Figma → **Connect team account**
- логин в **TEAM** Figma
- **Save session**

### 5) Invite дизайнеров
В кабинете создайте им доступ + пароль, галочка FIGMA.

### 6) Отдайте дизайнеру 3 вещи
1. Файл приложения StudioGate  
2. Ссылку студии  
3. Email + пароль StudioGate  

Дальше они работают по `FOR_DESIGNERS.md`.

### 7) Revoke
В кабинете → Team → Revoke

---

## Критерий успеха пилота
- дизайнер открыл Figma без пароля Figma
- вы забрали доступ одной кнопкой
- пароли больше не диктуете на созвонах

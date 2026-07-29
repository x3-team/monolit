# Как собрать простое приложение StudioGate

Цель: дизайнеры получают обычный файл приложения, а не команды в терминале.

## На вашем Mac (самый частый случай)

```bash
cd studio-access
npm install
npm run dist:mac
```

Готовые файлы появятся в `studio-access/release/`:
- `StudioGate-x.y.z.dmg` — для установки
- или `.app` / `.zip`

Отправьте дизайнерам `.dmg` + ссылку студии + их логин/пароль StudioGate.

## Windows

На Windows-машине:

```bash
npm run dist:win
```

Получите `StudioGate Setup.exe` или portable `.exe` в `release/`.

## Linux (проверка сборки)

```bash
npm run dist:linux
```

## Что говорит дизайнер после этого

См. `FOR_DESIGNERS.md`:
1. Скачал приложение
2. Вставил ссылку студии
3. Вошёл
4. Open Figma

## Важно

Сервер студии (`npm run dev` / tunnel / облако) должен быть запущен.  
Приложение — только клиент. Без работающей ссылки студии Open не откроет Figma.

# Где скачать StudioGate

Страница релиза:  
https://github.com/x3-team/monolit/releases/tag/studiogate-v0.1.0

## Что скачивать команде

| Компьютер | Файл |
|---|---|
| **Windows** | [StudioGate-0.1.0-windows-x64.zip](https://github.com/x3-team/monolit/releases/download/studiogate-v0.1.0/StudioGate-0.1.0-windows-x64.zip) |
| **Mac** | собрать `.dmg` на Mac (`npm run dist:mac`) |
| Linux | обычно не нужен |

## Важно для сборки приложения

Перед `dist:mac` / `dist:win` пропишите ваш боевой сервер в:

`studio-access/desktop/config.json`

```json
{
  "serverUrl": "https://gate.ваш-домен.ru",
  "allowServerOverride": false
}
```

Тогда дизайнерам **не нужно** ничего вставлять: открыл → логин → Open Figma.

Сервер должен быть поднят на VPS. См. `SERVER.md`.

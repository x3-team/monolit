# Где скачать StudioGate

Страница релиза:  
https://github.com/x3-team/monolit/releases/tag/studiogate-v0.1.0

## Что нужно вашей команде

Большинству студий нужен **Mac или Windows**. Linux обычно не нужен.

| У дизайнера какой компьютер | Что скачать |
|---|---|
| **Windows** | [`StudioGate-0.1.0-windows-x64.zip`](https://github.com/x3-team/monolit/releases/download/studiogate-v0.1.0/StudioGate-0.1.0-windows-x64.zip) |
| **Mac** | Пока собрать на Mac (см. ниже) и дать `.dmg` |
| Linux | Можно игнорировать |

### Windows — как открыть
1. Скачать zip  
2. Распаковать  
3. Зайти в папку `win-unpacked`  
4. Запустить `StudioGate.exe`

### Mac — как сделать файл для команды
На любом Mac:

```bash
cd studio-access
npm install
npm run dist:mac
```

Файл появится в `studio-access/release/*.dmg` — его и отправляете дизайнерам на Mac.

---

Приложение — только клиент. Нужен ещё сервер StudioGate (лучше VPS). См. `SERVER.md`.

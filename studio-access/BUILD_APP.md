# Как собрать приложение с уже вшитым сервером

## Правильный UX для дизайнера
Скачал → открыл → вошёл → Open Figma.  
**Без ручного ввода ссылки.**

## Как это сделать

1. Поднимите StudioGate на VPS, получите URL, например `https://gate.yourstudio.com`
2. Пропишите его в `desktop/config.json`:

```json
{
  "serverUrl": "https://gate.yourstudio.com",
  "productName": "StudioGate",
  "allowServerOverride": false
}
```

3. Соберите установщик:

```bash
# Mac
npm run dist:mac

# Windows
npm run dist:win
```

4. Отдайте команде файл из `release/`

Готово: приложение уже “знает”, куда подключаться.

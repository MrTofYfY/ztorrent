# 🏗️ ZTorrent - Инструкция по сборке .exe

## Быстрый способ (5 минут)

### 1. Установи Node.js
https://nodejs.org/ (скачай LTS версию)

### 2. Скачай папку `electron` с этого проекта

### 3. Открой cmd (командную строку) в папке electron
```cmd
cd путь\к\electron
```

### 4. Установи зависимости и собери
```cmd
npm install
npm run build
```

### 5. Готово!
```
dist\ZTorrent-1.0.0-Setup.exe  ← Установщик Windows
dist\ZTorrent-1.0.0.exe         ← Portable версия (если portable target)
```

---

## Если не хочешь собирать сам

### Используй GitHub Actions (автоматически):
1. Создай репозиторий на GitHub
2. Загрузи файлы из папки `electron/`
3. Открой вкладку **Actions** → выбери **Build ZTorrent .exe**
4. Нажми **Run workflow**
5. Скачай готовый .exe из артефактов!

Или я могу сделать это за тебя — просто создай репозиторий на GitHub и я выложу файлы!

---

## Структура файлов

```
electron/
├── main.js           # Electron процесс (управляет окном)
├── index.html        # Интерфейс (чёрно-зелёный киберпанк)
├── package.json      # Зависимости и скрипты
├── build.bat         # Скрипт для Windows
├── build.sh          # Скрипт для Linux
├── .github/
│   └── workflows/
│       └── build.yml # Авто-сборка на GitHub
└── README.md         # Этот файл
```

---

## Что получается

| Файл | Описание | Размер |
|------|----------|--------|
| `ZTorrent-*-Setup.exe` | Установщик Windows | ~100MB |
| `ZTorrent-*.AppImage` | Portable Linux | ~100MB |
| `ZTorrent-*.dmg` | macOS | ~100MB |

---

## Требования

- **Node.js** 16+ (https://nodejs.org)
- **4GB RAM** для сборки
- **10 минут** времени
- **Интернет** для скачивания зависимостей

---

## Команды

```bash
# Запуск без сборки (разработка)
npm start

# Сборка для Windows
npm run build

# Сборка для всех платформ (нужен Node на всех)
npm run build -- --win --mac --linux

# Сборка portable (без установки)
npm run build -- --win portable
```

---

## Решение проблем

### `npm install` не работает
```cmd
# Очисти кэш
npm cache clean --force
npm install
```

### Ошибка сборки
```cmd
# Обнови electron-builder
npm install electron-builder@latest
npm run build
```

### Нет прав на запись
```cmd
# Запусти cmd от администратора
```

---

## Хочешь готовый .exe без танцев с бубном?

**Скачай последний релиз** из GitHub releases (когда я его создам)!

---

⬡ **ZTorrent v1.0.0** - BitTorrent Client
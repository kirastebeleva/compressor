# Product & UX Specification

---

## Rotate Image

| Параметр | Значение |
|----------|----------|
| **Название** | Rotate Image |
| **URL** | `/rotate-image/` |
| **ToolKind** | `image-rotate` |
| **Intent** | `rotate` |

### Краткое описание

Batch-инструмент для поворота до 10 изображений (JPG, PNG, WebP) на 90° или 180° прямо в браузере. Поддерживает глобальный поворот всех файлов одновременно и точечную корректировку каждого изображения отдельно. JPEG-файлы с EXIF-ориентацией нормализуются автоматически — пиксели физически корректируются, тег сбрасывается.

### Какую проблему решает

Фотографии с телефонов часто имеют неправильную ориентацию из-за EXIF-метаданных, которые не все приложения интерпретируют одинаково. Сканы документов приходят повёрнутыми. Контент-менеджерам нужно массово подготовить изображения с правильной ориентацией перед публикацией. Инструмент устраняет эти проблемы без установки софта и без загрузки файлов на сервер.

### Основное действие пользователя

Загрузить изображения → применить глобальный или индивидуальный поворот → скачать результат (по одному или ZIP-архивом).

---

# Crop Image — Product & UX Specification

## 1. Основная задача пользователя (Job-to-be-Done)

**«Я хочу быстро вырезать нужную часть изображения — без установки софта, без регистрации, прямо сейчас.»**

Типичные сценарии:
- Обрезать фото для аватарки или профиля (квадрат, круг)
- Подготовить изображение под формат соцсети (Instagram story, Facebook cover, YouTube thumbnail)
- Убрать лишние поля / нежелательные объекты по краям
- Точно подогнать изображение под пиксельные требования платформы (например, 1200×630 для OG-image)
- Быстро выделить фрагмент скриншота для отправки в чат / документ

---

## 2. Ценностное предложение (1 предложение)

> Crop any image to exact dimensions or social-media presets — instantly, privately, and free in your browser.

---

## 3. Минимальный набор UI-элементов (MVP Surface)

Структура следует существующему шаблону (`tool-page`): Hero → Tool Card → Results Card.

### 3.1. Tool Card — основная рабочая область

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Dropzone** | Drag-and-drop зона + кнопка «Choose image». Принимает JPG, PNG, WebP. Один файл (single mode). Идентична существующему паттерну из `resize-tool`. |
| 2 | **Canvas preview** | Интерактивный превью загруженного изображения с overlay-рамкой обрезки. Рамка перетаскивается и ресайзится за углы/стороны. Это **центральный элемент** инструмента — занимает основное пространство карточки. |
| 3 | **Aspect ratio selector** | Горизонтальная полоска кнопок-пресетов: `Free`, `1:1`, `4:3`, `16:9`, `3:2`, `Custom`. По умолчанию — `Free`. |
| 4 | **Dimension inputs** | Два числовых поля: Width × Height (px) — отражают текущий размер области обрезки. Пользователь может ввести точные значения вручную. Обновляются в реальном времени при перемещении рамки. |
| 5 | **Crop button** | Главная CTA: «Crop now». Состояния: idle → processing → done. Аналог `btn-compress` в существующей системе. |
| 6 | **Trust note** | «Your image is processed locally in your browser. Nothing is uploaded.» — как у resize-tool. |

### 3.2. Results Card

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Before/After preview** | Миниатюра оригинала и результата рядом. |
| 2 | **Stats row** | Original size → Cropped size (px), File size before → after. |
| 3 | **Download button** | «Download cropped image». Сохраняет в оригинальном формате. |
| 4 | **Reset button** | «Crop another image (free)» — сбрасывает в исходное состояние. |

---

## 4. Дополнительные опции (скрытые по умолчанию / Advanced)

Эти опции НЕ показываются при первом входе. Появляются через раскрывающуюся секцию «More options» или inline при выборе определённого пресета.

| Опция | Когда показывать | Default |
|-------|-----------------|---------|
| **Social media presets** | Появляются как подгруппа в aspect ratio selector при клике «Social Media» | Скрыты. Примеры: Instagram Post (1080×1080), Instagram Story (1080×1920), Facebook Cover (820×312), YouTube Thumbnail (1280×720), Twitter/X Header (1500×500), LinkedIn Banner (1584×396) |
| **Output format** | Панель «More options» | Same as input (сохраняем формат) |
| **Output quality** | Панель «More options», только для JPEG/WebP | 92% (визуально неотличимо от оригинала) |
| **Circular crop toggle** | Переключатель под aspect ratio, виден только при 1:1 | Off. Когда On — визуальная маска-круг и результат с прозрачным фоном (PNG) |
| **Grid overlay** | Переключатель «Show grid» (rule of thirds) | Off. Помогает с композицией |
| **Rotate 90°** | Кнопка-иконка рядом с canvas preview | Видна всегда, но компактная |
| **Flip horizontal / vertical** | Кнопки-иконки рядом с rotate | Скрыты в «More options» |

---

## 5. Оптимальные настройки по умолчанию

| Параметр | Значение по умолчанию | Обоснование |
|----------|----------------------|-------------|
| Aspect ratio | **Free** (произвольный) | Пользователь чаще всего хочет выделить область сам; принуждение к пропорциям на старте — friction |
| Crop area initial size | **90% от изображения**, центрировано | Показывает, что обрезка уже «активна»; пользователь видит рамку и понимает механику без инструкции |
| Output format | **Same as input** | Минимум сюрпризов. JPEG → JPEG, PNG → PNG |
| Output quality (JPEG/WebP) | **0.92** | Визуально lossless, при этом файл чуть легче оригинала |
| Max file size | **10 MB** | Консистентно с resize-tool и compress-tool |
| Max dimensions | **8000 × 8000 px** | Консистентно с существующими инструментами |
| Grid overlay | **Off** | Не перегружает интерфейс для casual users |
| Circular crop | **Off** | Нишевая функция; не путает при первом использовании |

---

## 6. User Flow (пошагово)

```
[Загрузка страницы]
     │
     ▼
[Dropzone: "Choose image or drag and drop"]
     │  пользователь выбирает / перетаскивает файл
     ▼
[Canvas preview с рамкой обрезки (90% area)]
[Aspect ratio bar: Free | 1:1 | 4:3 | 16:9 | ...]
[Width × Height inputs: динамические]
     │
     │  пользователь двигает рамку / меняет пресет / вводит размеры
     ▼
[Кнопка "Crop now" → активна]
     │  клик
     ▼
[Processing spinner (< 1 сек для большинства изображений)]
     │
     ▼
[Results Card: превью, размеры, кнопка Download]
[Reset: "Crop another image (free)"]
```

---

## 7. Типичные UX-ошибки, которых нужно избежать

### 7.1. Критические

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Нет визуального превью обрезки** | Пользователь не понимает, что именно будет обрезано; вынужден «пробовать вслепую» | Canvas с интерактивной рамкой — must have. Затемнять область за рамкой (dim overlay) |
| **Crop area не перетаскивается** | Если рамку можно только ресайзить, но не двигать целиком — фрустрация при позиционировании | Рамка должна поддерживать: перетаскивание целиком + resize за 8 точек (4 угла + 4 стороны) |
| **Потеря данных без предупреждения** | Пользователь загрузил, настроил crop, случайно обновил страницу | (a) browser `beforeunload` confirm, (b) кнопка «Reset» требует подтверждения, если есть несохранённый результат |
| **Автоматическая конвертация формата** | PNG с прозрачностью → JPEG без предупреждения = потеря альфа-канала | Всегда сохранять исходный формат по умолчанию. Если пользователь выбирает circular crop → автоматически переключать на PNG с уведомлением |

### 7.2. Важные

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Слишком много опций на первом экране** | Отпугивает casual users; время до первого действия растёт | Progressive disclosure: основной flow — 3 шага (upload → adjust → crop). Все advanced — в раскрывающейся секции |
| **Нет пресетов для соцсетей** | 40-60% пользователей crop-инструментов обрезают под конкретную платформу (данные Canva, Adobe Express) | Пресеты соцсетей — primary feature, но группируются отдельно, чтобы не засорять базовый UI |
| **Input fields не синхронизированы с рамкой** | Пользователь вводит 500×500, но рамка не обновляется (или наоборот) | Двусторонняя синхронизация: рамка ↔ inputs. Debounce на input (300ms), throttle на drag |
| **Нет обратной связи при ошибке формата** | Пользователь перетаскивает PDF или SVG, ничего не происходит | Чёткое сообщение: «Unsupported format: [filename]. Use JPG, PNG, or WebP.» — как в resize-tool |
| **Результат открывается в новой вкладке вместо скачивания** | Пользователь ожидает download, получает preview | Использовать `<a download="...">` или blob-ссылку, как в существующих инструментах |
| **Нельзя отменить последнее действие** | Пользователь случайно сместил рамку, которую долго позиционировал | Минимальный undo: кнопка «Reset crop area» возвращает рамку к начальному состоянию (90% area, по центру) |

### 7.3. Тонкие, но заметные

| Ошибка | Решение |
|--------|---------|
| Рамка обрезки «прыгает» при переключении aspect ratio | Плавная анимация перехода; новая рамка вписывается в текущую, сохраняя центр |
| На мобильных нельзя управлять рамкой пальцами | Touch-события: pinch для zoom canvas, drag для перемещения рамки, pull за углы для resize. Минимальный размер touch-target — 44×44px |
| Не показан размер результата до обрезки | Показывать живой preview размера: «Result: 800 × 600 px» прямо под dimension inputs, обновляется в реальном времени |
| Кнопка Crop неактивна без объяснения | Если кнопка disabled — показывать tooltip/hint: «Select a crop area first» |

---

## 8. Технические рекомендации (для разработки)

### Архитектурное соответствие

- **ToolKind**: добавить `"image-crop"` в `ToolKind` union type
- **ToolIntent**: использовать `"crop"` как основной intent
- **NavSection**: `"image-tools"`
- **Component**: создать `CropTool` (аналогично `ResizeTool`) в `src/components/crop-tool.tsx`
- **ToolRuntime**: добавить ветку `if (config.tool.kind === "image-crop")` в `tool-runtime.tsx`
- **Config**: создать `IMAGE_CROP_TOOL_DEFAULTS` в `defaults.ts`, page config в `pages/image-tools.ts`

### Canvas-взаимодействие

- Использовать `<canvas>` + overlay `<div>` с CSS-управляемой рамкой (не рисовать рамку на canvas — это упрощает hit-testing и стилизацию)
- Альтернатива: библиотека `react-image-crop` (MIT, ~8KB gzip, зрелая, accessibility-ready) — но оценить, стоит ли добавлять зависимость
- Обрезку выполнять через `OffscreenCanvas` или `createImageBitmap` + `canvas.drawImage()` с source rect

### Производительность

- Для превью использовать downscaled версию (max 1200px по длинной стороне)
- Обрезку финальную делать по оригиналу в полном разрешении
- Всё client-side, как существующие инструменты

---

## 9. SEO-страница (конфигурация)

```
slug:         crop-image
intent:       crop
h1:           Crop Image Online
meta.title:   Crop Image Online Free — Resize & Trim Photos Instantly
meta.desc:    Crop JPG, PNG and WebP images to exact dimensions or social media
              presets. Free, private, no upload — runs entirely in your browser.
hero.subtitle: Trim, reframe, or resize your images for any platform — instantly
               and privately in your browser.
trustBadges:  ["Free", "No signup", "Browser-based", "Social media presets"]
```

### Рекомендованные SEO-блоки

- «How to crop an image online» (step-by-step)
- «Why crop images?» (use cases: social media, web, email)
- «Crop vs Resize — what's the difference?» (internal link to /resize-image)

### FAQ (минимум)

1. Is this tool really free? → Yes, 100% free...
2. Are my images uploaded to a server? → No, all processing happens in your browser...
3. What formats are supported? → JPG, PNG, WebP...
4. Can I crop to a specific aspect ratio? → Yes, choose from presets or enter custom...
5. Can I crop a circular image? → Yes, enable the circular crop option for 1:1 ratio...
6. What is the maximum image size? → 10 MB, up to 8000×8000 px...

### Related links

- /resize-image — «Need to change dimensions without cropping? Try Resize Image.»
- /compress-image — «Reduce file size after cropping.»
- /compress-image-under-1mb — «Need the result under 1 MB?»

---

## 10. Метрики успеха

| Метрика | Цель | Как измерять |
|---------|------|-------------|
| Time-to-first-crop | < 15 сек от загрузки страницы до клика «Crop now» | Analytics event timestamps |
| Crop completion rate | > 75% из начавших upload завершают crop | Funnel: upload → crop → download |
| Download rate | > 85% из завершивших crop скачивают результат | Events: crop_completed → download |
| Bounce rate | < 40% (для SEO-трафика) | GA / analytics |
| Preset usage | Отслеживать, какие aspect ratio пресеты популярнее | trackEvent на выбор пресета |

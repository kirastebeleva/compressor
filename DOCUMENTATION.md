# Product & UX Specification

---

## Convert Image

| Параметр | Значение |
|----------|----------|
| **Название** | Convert Image |
| **URL** | `/convert-image/` |
| **ToolKind** | `image-convert` |
| **Intent** | `convert` |
| **NavSection** | `converter-tools` |

### Краткое описание

Универсальный batch-конвертер изображений. Позволяет загрузить до 20 файлов и конвертировать их между поддерживаемыми форматами: WebP, JPG, PNG, AVIF, HEIC. Вся обработка выполняется в браузере — без загрузки на сервер. HEIC-файлы обрабатываются через `heic2any` (lazy import). Для остальных форматов используется Canvas API.

### Архитектура

- **Конфиг пар**: `src/core/config/conversions.ts` — единый источник истины для `ALLOWED_CONVERSIONS`, MIME-маппинга и вспомогательных функций.
- **Конвертер**: `src/conversion/convert.ts` — диспатчит на `canvasConvert` или `heicConvert` по типу файла.
- **Компонент**: `src/components/convert-image-tool.tsx` — работает в двух режимах:
  - **Обычный режим** (`/convert-image`): показывает селекторы From/To, поддерживает авто-определение формата по файлу.
  - **Pair mode** (`/heic-to-jpg`, `/webp-to-jpg` и т.д.): форматы фиксированы через `config.tool.conversionPair`, селекторы скрыты.
- **ToolRuntime**: ветка `image-convert` → `ConvertImageRuntime` в `src/tool-page/tool-runtime.tsx`.

### Разрешённые пары конвертации

```
WebP  → JPG
JPG   → PNG, WebP
PNG   → JPG, WebP, AVIF
HEIC  → JPG
```

### SEO-страницы пар форматов

| Slug | Intent | Rank |
|------|--------|------|
| `/heic-to-jpg` | `convert-heic-jpg` | 1 |
| `/webp-to-jpg` | `convert-webp-jpg` | 2 |
| `/jpg-to-png` | `convert-jpg-png` | 3 |
| `/png-to-jpg` | `convert-png-jpg` | 4 |
| `/jpg-to-webp` | `convert-jpg-webp` | 5 |
| `/png-to-webp` | `convert-png-webp` | 6 |
| `/png-to-avif` | `convert-png-avif` | 7 |

Все страницы имеют уникальные H1, meta title/description, hero subtitle и FAQ. Селекторы форматов скрыты — input определяется по файлу, output фиксирован страницей.

### Аналитика

События отправляются через `src/lib/analytics.ts`:

| Событие | Когда | Ключевые параметры |
|---------|-------|--------------------|
| `tool_open` | Монтирование `ConvertImageRuntime` | `tool` |
| `file_uploaded` | Загрузка файлов в dropzone | `tool`, `file_count`, `from_format` |
| `convert_image_to_selected` | Изменение селектора «To» | `from_format`, `to_format` |
| `action_started` | Клик «Convert» | `tool`, `from_format`, `to_format`, `file_count` |
| `action_completed` | Завершение конвертации | `tool`, `success_count`, `fail_count`, `elapsed_ms`, `output_size_mb` |
| `error` | Ошибка конвертации файла | `tool`, `file_type`, `file_size_mb`, `error_message` |

### Sitemap

Все страницы конвертера включены в `src/app/sitemap.ts` с приоритетами:
- `/convert-image/` — priority `0.9`, changeFrequency `monthly`
- Pair-страницы (`/heic-to-jpg/` и др.) — priority `0.8`, changeFrequency `monthly`

Stub-страницы исключены из sitemap автоматически (фильтр `mode !== "stub"`).

### Ключевые файлы

| Файл | Описание |
|------|----------|
| `src/core/config/conversions.ts` | `ALLOWED_CONVERSIONS`, MIME-маппинг, утилиты |
| `src/conversion/convert.ts` | Логика конвертации (canvas + heic2any) |
| `src/conversion/types.ts` | `ConvertOptions`, `ConvertResult` |
| `src/components/convert-image-tool.tsx` | UI-компонент, pair mode, аналитика |
| `src/core/config/pages/convert-image-page.ts` | PageConfig для `/convert-image` |
| `src/core/config/pages/converter-tools.ts` | PageConfig для 7 pair-страниц |
| `src/app/sitemap.ts` | Динамическая генерация sitemap с приоритетами |

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

## Crop Image

| Параметр | Значение |
|----------|----------|
| **Название** | Crop Image |
| **URL** | `/crop-image/` |
| **ToolKind** | `image-crop` |
| **Intent** | `crop` |

### Краткое описание

Инструмент для точной обрезки изображений (JPG, PNG, WebP) прямо в браузере. Поддерживает произвольную область, фиксированные пропорции и пресеты для соцсетей. Обрезка выполняется по оригиналу в полном разрешении.

### Какую проблему решает

Пользователям нужно обрезать фото под конкретный формат — аватарка, обложка соцсети, OG-image — или убрать лишние поля. Без инструмента это требует Photoshop или установки десктопного редактора. Crop Image решает задачу мгновенно, без регистрации и без загрузки файлов на сервер.

### Основное действие пользователя

Загрузить изображение → настроить область обрезки (вручную или через пресет) → скачать результат.

---

### 1. Основная задача пользователя (Job-to-be-Done)

**«Я хочу быстро вырезать нужную часть изображения — без установки софта, без регистрации, прямо сейчас.»**

Типичные сценарии:
- Обрезать фото для аватарки или профиля (квадрат, круг)
- Подготовить изображение под формат соцсети (Instagram story, Facebook cover, YouTube thumbnail)
- Убрать лишние поля / нежелательные объекты по краям
- Точно подогнать изображение под пиксельные требования платформы (например, 1200×630 для OG-image)
- Быстро выделить фрагмент скриншота для отправки в чат / документ

---

### 2. Ценностное предложение (1 предложение)

> Crop any image to exact dimensions or social-media presets — instantly, privately, and free in your browser.

---

### 3. Минимальный набор UI-элементов (MVP Surface)

Структура следует существующему шаблону (`tool-page`): Hero → Tool Card → Results Card.

#### 3.1. Tool Card — основная рабочая область

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Dropzone** | Drag-and-drop зона + кнопка «Choose image». Принимает JPG, PNG, WebP. Один файл (single mode). Идентична существующему паттерну из `resize-tool`. |
| 2 | **Canvas preview** | Интерактивный превью загруженного изображения с overlay-рамкой обрезки. Рамка перетаскивается и ресайзится за углы/стороны. Это **центральный элемент** инструмента — занимает основное пространство карточки. |
| 3 | **Aspect ratio selector** | Горизонтальная полоска кнопок-пресетов: `Free`, `1:1`, `4:3`, `16:9`, `3:2`, `Custom`. По умолчанию — `Free`. |
| 4 | **Dimension inputs** | Два числовых поля: Width × Height (px) — отражают текущий размер области обрезки. Пользователь может ввести точные значения вручную. Обновляются в реальном времени при перемещении рамки. |
| 5 | **Crop button** | Главная CTA: «Crop now». Состояния: idle → processing → done. Аналог `btn-compress` в существующей системе. |
| 6 | **Trust note** | «Your image is processed locally in your browser. Nothing is uploaded.» — как у resize-tool. |

#### 3.2. Results Card

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Before/After preview** | Миниатюра оригинала и результата рядом. |
| 2 | **Stats row** | Original size → Cropped size (px), File size before → after. |
| 3 | **Download button** | «Download cropped image». Сохраняет в оригинальном формате. |
| 4 | **Reset button** | «Crop another image (free)» — сбрасывает в исходное состояние. |

---

### 4. Дополнительные опции (скрытые по умолчанию / Advanced)

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

### 5. Оптимальные настройки по умолчанию

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

### 6. User Flow (пошагово)

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

### 7. Типичные UX-ошибки, которых нужно избежать

#### 7.1. Критические

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Нет визуального превью обрезки** | Пользователь не понимает, что именно будет обрезано; вынужден «пробовать вслепую» | Canvas с интерактивной рамкой — must have. Затемнять область за рамкой (dim overlay) |
| **Crop area не перетаскивается** | Если рамку можно только ресайзить, но не двигать целиком — фрустрация при позиционировании | Рамка должна поддерживать: перетаскивание целиком + resize за 8 точек (4 угла + 4 стороны) |
| **Потеря данных без предупреждения** | Пользователь загрузил, настроил crop, случайно обновил страницу | (a) browser `beforeunload` confirm, (b) кнопка «Reset» требует подтверждения, если есть несохранённый результат |
| **Автоматическая конвертация формата** | PNG с прозрачностью → JPEG без предупреждения = потеря альфа-канала | Всегда сохранять исходный формат по умолчанию. Если пользователь выбирает circular crop → автоматически переключать на PNG с уведомлением |

#### 7.2. Важные

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Слишком много опций на первом экране** | Отпугивает casual users; время до первого действия растёт | Progressive disclosure: основной flow — 3 шага (upload → adjust → crop). Все advanced — в раскрывающейся секции |
| **Нет пресетов для соцсетей** | 40-60% пользователей crop-инструментов обрезают под конкретную платформу (данные Canva, Adobe Express) | Пресеты соцсетей — primary feature, но группируются отдельно, чтобы не засорять базовый UI |
| **Input fields не синхронизированы с рамкой** | Пользователь вводит 500×500, но рамка не обновляется (или наоборот) | Двусторонняя синхронизация: рамка ↔ inputs. Debounce на input (300ms), throttle на drag |
| **Нет обратной связи при ошибке формата** | Пользователь перетаскивает PDF или SVG, ничего не происходит | Чёткое сообщение: «Unsupported format: [filename]. Use JPG, PNG, or WebP.» — как в resize-tool |
| **Результат открывается в новой вкладке вместо скачивания** | Пользователь ожидает download, получает preview | Использовать `<a download="...">` или blob-ссылку, как в существующих инструментах |
| **Нельзя отменить последнее действие** | Пользователь случайно сместил рамку, которую долго позиционировал | Минимальный undo: кнопка «Reset crop area» возвращает рамку к начальному состоянию (90% area, по центру) |

#### 7.3. Тонкие, но заметные

| Ошибка | Решение |
|--------|---------|
| Рамка обрезки «прыгает» при переключении aspect ratio | Плавная анимация перехода; новая рамка вписывается в текущую, сохраняя центр |
| На мобильных нельзя управлять рамкой пальцами | Touch-события: pinch для zoom canvas, drag для перемещения рамки, pull за углы для resize. Минимальный размер touch-target — 44×44px |
| Не показан размер результата до обрезки | Показывать живой preview размера: «Result: 800 × 600 px» прямо под dimension inputs, обновляется в реальном времени |
| Кнопка Crop неактивна без объяснения | Если кнопка disabled — показывать tooltip/hint: «Select a crop area first» |

---

### 8. Технические рекомендации (для разработки)

#### Архитектурное соответствие

- **ToolKind**: добавить `"image-crop"` в `ToolKind` union type
- **ToolIntent**: использовать `"crop"` как основной intent
- **NavSection**: `"image-tools"`
- **Component**: создать `CropTool` (аналогично `ResizeTool`) в `src/components/crop-tool.tsx`
- **ToolRuntime**: добавить ветку `if (config.tool.kind === "image-crop")` в `tool-runtime.tsx`
- **Config**: создать `IMAGE_CROP_TOOL_DEFAULTS` в `defaults.ts`, page config в `pages/image-tools.ts`

#### Canvas-взаимодействие

- Использовать `<canvas>` + overlay `<div>` с CSS-управляемой рамкой (не рисовать рамку на canvas — это упрощает hit-testing и стилизацию)
- Альтернатива: библиотека `react-image-crop` (MIT, ~8KB gzip, зрелая, accessibility-ready) — но оценить, стоит ли добавлять зависимость
- Обрезку выполнять через `OffscreenCanvas` или `createImageBitmap` + `canvas.drawImage()` с source rect

#### Производительность

- Для превью использовать downscaled версию (max 1200px по длинной стороне)
- Обрезку финальную делать по оригиналу в полном разрешении
- Всё client-side, как существующие инструменты

---

### 9. SEO-страница (конфигурация)

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

#### Рекомендованные SEO-блоки

- «How to crop an image online» (step-by-step)
- «Why crop images?» (use cases: social media, web, email)
- «Crop vs Resize — what's the difference?» (internal link to /resize-image)

#### FAQ (минимум)

1. Is this tool really free? → Yes, 100% free...
2. Are my images uploaded to a server? → No, all processing happens in your browser...
3. What formats are supported? → JPG, PNG, WebP...
4. Can I crop to a specific aspect ratio? → Yes, choose from presets or enter custom...
5. Can I crop a circular image? → Yes, enable the circular crop option for 1:1 ratio...
6. What is the maximum image size? → 10 MB, up to 8000×8000 px...

#### Related links

- /resize-image — «Need to change dimensions without cropping? Try Resize Image.»
- /compress-image — «Reduce file size after cropping.»
- /compress-image-under-1mb — «Need the result under 1 MB?»

---

### 10. Метрики успеха

| Метрика | Цель | Как измерять |
|---------|------|-------------|
| Time-to-first-crop | < 15 сек от загрузки страницы до клика «Crop now» | Analytics event timestamps |
| Crop completion rate | > 75% из начавших upload завершают crop | Funnel: upload → crop → download |
| Download rate | > 85% из завершивших crop скачивают результат | Events: crop_completed → download |
| Bounce rate | < 40% (для SEO-трафика) | GA / analytics |
| Preset usage | Отслеживать, какие aspect ratio пресеты популярнее | trackEvent на выбор пресета |

---

## Flip Image

| Параметр | Значение |
|----------|----------|
| **Название** | Flip Image |
| **URL** | `/flip-image/` |
| **ToolKind** | `image-flip` |
| **Intent** | `flip` |

### Краткое описание

Batch-инструмент для зеркального отражения до 10 изображений (JPG, PNG, WebP) по горизонтали или вертикали прямо в браузере. Поддерживает глобальный flip всех файлов одновременно и точечную корректировку каждого изображения отдельно. Операция lossless на уровне пикселей — размеры изображения не меняются.

### Какую проблему решает

Селфи с фронтальной камеры зеркально отражены — текст на футболке или вывеске читается задом наперёд. Изображения для печати (термотрансфер, гравировка) требуют горизонтального отражения. Фотографии товаров нужно привести к единому направлению для каталога. Дизайнерам нужно быстро создать зеркальную версию элемента. Инструмент решает все эти задачи мгновенно, без установки софта и без загрузки файлов на сервер.

### Основное действие пользователя

Загрузить изображения → выбрать направление отражения (горизонтальное / вертикальное) → скачать результат (по одному или ZIP-архивом).

---

### 1. Основная задача пользователя (Job-to-be-Done)

**«Я хочу быстро отзеркалить изображение — исправить зеркальное селфи, подготовить картинку для печати или создать симметричную версию — без установки софта, без регистрации, прямо сейчас.»**

Типичные сценарии:
- Исправить зеркальное селфи (текст / логотипы отражены фронтальной камерой)
- Отзеркалить изображение для термотрансферной печати (iron-on transfer)
- Привести серию фото товаров к единому направлению (все смотрят влево / вправо)
- Перевернуть отсканированный документ, загруженный вверх ногами
- Создать зеркальную копию UI-элемента или графического ассета для дизайна
- Подготовить изображение для гравировки или трафаретной печати

---

### 2. Ценностное предложение (1 предложение)

> Flip or mirror up to 10 images horizontally or vertically — instantly, privately, and free in your browser.

---

### 3. Минимальный набор UI-элементов (MVP Surface)

Структура следует существующему шаблону (`tool-page`): Hero → Tool Card → Results Card.

**Ключевое архитектурное решение**: Flip Image — это batch-инструмент, идентичный по модели взаимодействия Rotate Image. Один и тот же паттерн: глобальное действие на все файлы + per-image override + grid-превью.

#### 3.1. Tool Card — основная рабочая область

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Dropzone** | Drag-and-drop зона + кнопка «Choose images». Принимает JPG, PNG, WebP. До 10 файлов (batch mode). Идентична паттерну из `rotate-tool`. |
| 2 | **Global flip bar** | Горизонтальная панель с кнопками быстрого действия: `Flip Horizontal`, `Flip Vertical`, `Reset all`. Кнопки с иконками + текстом. Применяются ко всем файлам одновременно. |
| 3 | **Status badges** | Inline-бейджи под панелью: «Global: Flipped H» / «3 of 5 flipped» — показывают текущее состояние batch-операции. Появляются только когда есть изменения. |
| 4 | **Image grid** | Сетка превью загруженных файлов. Каждый элемент: миниатюра с применённым CSS-transform (визуальный preview flip в реальном времени), кнопка удаления (×), бейдж «Flipped» если изображение изменено, per-image controls (flip H, flip V, reset). |
| 5 | **«+ Add more» tile** | Последний элемент в grid, если файлов < 10. Позволяет добавить ещё изображения. |
| 6 | **Download filter** | Чекбокс «Download only changed images» — как в rotate-tool. |
| 7 | **Flip button** | Главная CTA: «Flip» (1 файл) или «Flip N files» (batch). Состояния: idle → processing → done. |
| 8 | **Trust note** | «Your images are processed locally in your browser. Nothing is uploaded.» |

#### 3.2. Results Card

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Results list** | Список результатов: миниатюра → имя файла → размеры (без изменений) → размер файла before → after → кнопка Download. Аналог `resize-results-list` из rotate-tool. |
| 2 | **«Flipped» dot** | Визуальный маркер рядом с именем файла, если изображение было изменено (аналог `rotate-result-changed-dot`). |
| 3 | **Download All as ZIP** | Кнопка, появляется при > 1 результате. Использует JSZip (как rotate-tool). |
| 4 | **Reset button** | «Flip more images (free)» — полный сброс в исходное состояние. |

---

### 4. Дополнительные опции (скрытые по умолчанию / Advanced)

Flip Image — намеренно минималистичный инструмент. Основных опций (H / V) достаточно для 95% сценариев. Advanced-секция скромная, чтобы не перегружать инструмент функциями, которые дублируют другие tool-страницы.

| Опция | Когда показывать | Default |
|-------|-----------------|---------|
| **Both (H + V)** | Кнопка в global flip bar, равнозначна rotate 180° — но пользователь ментально думает «flip both axes» | Скрыта. Появляется как третья кнопка в flip bar. Иконка: двойная стрелка. |
| **Output format** | Панель «More options» | Same as input |
| **Output quality** | Панель «More options», только для JPEG/WebP | 0.92 (визуально неотличимо) |
| **Keyboard shortcuts** | Hint под grid, виден когда выбрано изображение | Показывать: «H to flip horizontal · V to flip vertical · Delete to remove» |

**Что НЕ добавляем в этот инструмент** (и почему):
- Rotation — уже есть отдельный /rotate-image, внутренняя ссылка в related
- Crop — уже есть /crop-image
- Diagonal / kaleidoscope / symmetry effects — нишевые фичи, усложняют UI, не соответствуют intent «flip». Могут стать отдельным инструментом «Mirror effects» в будущем

---

### 5. Оптимальные настройки по умолчанию

| Параметр | Значение по умолчанию | Обоснование |
|----------|----------------------|-------------|
| Flip direction | **Нет (ничего не выбрано)** | Пользователь должен явно выбрать H или V. Предвыбор одного направления создаёт friction — пользователь может не заметить и получить неожиданный результат. Кнопка Flip неактивна, пока не выбрано направление. |
| Global/per-image model | **Global** — первый клик применяется ко всем | Консистентно с rotate-tool. Per-image override доступен через controls в grid. |
| Output format | **Same as input** | Минимум сюрпризов. PNG → PNG (сохраняет прозрачность). |
| Output quality (JPEG/WebP) | **0.92** | Визуально lossless, консистентно с другими инструментами |
| Max files | **10** | Консистентно с rotate-tool |
| Max file size | **10 MB** | Консистентно с resize-tool и compress-tool |
| Download only changed | **Off** | По умолчанию экспортируются все файлы — пользователь получает полный набор |

---

### 6. User Flow (пошагово)

```
[Загрузка страницы]
     │
     ▼
[Dropzone: "Choose images or drag and drop"]
[Badges: JPG · PNG · WebP · Up to 10 files · Max 10 MB]
     │  пользователь выбирает / перетаскивает файлы
     ▼
[Image grid с превью + per-image controls]
[Global flip bar: Flip Horizontal | Flip Vertical | Reset all]
[Status badges: "Global: Flipped H" / "3 of 5 flipped"]
     │
     │  пользователь нажимает глобальную кнопку
     │  или корректирует отдельные изображения
     ▼
[Кнопка "Flip N files" → активна (если хотя бы одно изменение)]
     │  клик
     ▼
[Processing (< 1 сек для большинства batch'ей)]
     │
     ▼
[Results Card: список с превью, размерами, кнопками Download]
[Download All as ZIP (если > 1)]
[Reset: "Flip more images (free)"]
```

---

### 7. Типичные UX-ошибки, которых нужно избежать

#### 7.1. Критические

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Нет визуального превью flip** | Пользователь не видит результат до обработки; вынужден скачать, открыть, проверить | CSS `transform: scaleX(-1)` / `scaleY(-1)` на thumbnail в реальном времени. Flip — мгновенный визуальный эффект, нет причин не показывать его до экспорта. |
| **Перепутаны «horizontal» и «vertical»** | Самая частая жалоба в отзывах на конкурентов. «Horizontal flip» = отражение относительно вертикальной оси (зеркало слева-направо). Многие пользователи путают. | (a) Иконки обязательны — стрелки показывают направление отражения. (b) Tooltip: «Mirror left ↔ right» / «Mirror top ↕ bottom». (c) Мгновенный CSS-превью снимает неопределённость. |
| **Потеря прозрачности PNG** | PNG с альфа-каналом сохраняется как JPEG → белый фон вместо прозрачного | Всегда сохранять исходный формат. PNG → PNG (canvas.toBlob с mime image/png). |
| **Нет обратной связи при ошибке формата** | Пользователь перетаскивает SVG или GIF, ничего не происходит | Чёткое сообщение: «Unsupported format: [filename]. Use JPG, PNG, or WebP.» |

#### 7.2. Важные

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Кнопка «Flip» активна без выбранного направления** | Пользователь нажимает, получает оригинал без изменений — непонятно, сработало ли | Кнопка disabled до первого выбора направления. Если все файлы без изменений и нажат export — показать hint: «Select flip direction first.» |
| **Нет undo для per-image flip** | Пользователь случайно нажал flip на одном изображении, хочет вернуть | Кнопка reset per-image (возвращает к глобальному состоянию). Кнопка reset all (сбрасывает всё). Как в rotate-tool. |
| **Размеры файла в results сбивают с толку** | Flip не меняет dimensions, но re-encoding может изменить file size. Пользователь видит «было 2.1 MB → стало 2.3 MB» и думает, что качество испортилось | Показать пояснение: если размер файла изменился — «File size may vary slightly due to re-encoding. Image quality is preserved.» |
| **Нельзя добавить файлы после начальной загрузки** | Пользователь загрузил 3 файла, хочет добавить ещё 2 | Tile «+ Add more» в grid (как в rotate-tool) + возможность drag-and-drop прямо на grid |
| **Результат открывается в новой вкладке** | Пользователь ожидает download, получает preview | Использовать `<a download="...">` с blob-ссылкой, как в rotate-tool |

#### 7.3. Тонкие, но заметные

| Ошибка | Решение |
|--------|---------|
| CSS-transform на превью выглядит размыто на retina | Использовать `will-change: transform` и `image-rendering: auto` на thumbnail. Превью должен быть достаточного разрешения (не 50px thumbnail). |
| На мобильных кнопки flip слишком мелкие | Минимальный touch-target — 44×44px. Кнопки в grid увеличиваются на мобильных. |
| Клавиатурные шорткуты работают внутри input-полей | Отключать шорткуты, когда фокус в INPUT / TEXTAREA / SELECT (как в rotate-tool). |
| Grid layout ломается при 1 файле | При 1 файле — показывать одну крупную карточку с превью вместо grid-сетки. Или фиксированный min-width для grid-item. |
| Бейдж «Flipped» не виден на тёмных изображениях | Бейдж с непрозрачным фоном и контрастной рамкой (не полупрозрачный overlay). |

---

### 8. Технические рекомендации (для разработки)

#### Архитектурное соответствие

- **ToolKind**: добавить `"image-flip"` в `ToolKind` union type
- **ToolIntent**: использовать `"flip"` как основной intent
- **NavSection**: `"image-tools"`
- **Component**: создать `FlipTool` (максимально переиспользовать паттерны из `RotateTool`) в `src/components/flip-tool.tsx`
- **ToolRuntime**: добавить ветку `if (config.tool.kind === "image-flip")` в `tool-runtime.tsx`
- **Config**: создать `IMAGE_FLIP_TOOL_DEFAULTS` в `defaults.ts`, page config в `pages/image-tools.ts`

#### Canvas-логика

- Flip — это `canvas.drawImage()` с `ctx.scale(-1, 1)` (horizontal) или `ctx.scale(1, -1)` (vertical) + translate
- Размеры canvas = размеры оригинала (в отличие от rotate, где 90° меняет W и H)
- Операция значительно проще rotate — нет смены dimensions
- CSS-превью: `transform: scaleX(-1)` и/или `scaleY(-1)` — мгновенный, без canvas-обработки

#### Переиспользование из rotate-tool

- Dropzone, file validation, batch state management, grid layout, results list, ZIP download — полностью идентичны
- Разница: вместо `globalAngle` / `perImageAngles` → `globalFlip: { h: boolean, v: boolean }` / `perImageFlips: Map<string, { h: boolean, v: boolean }>`
- Flip — toggle (вкл/выкл), а не инкрементальный (90° + 90° + 90°). Два клика flip H = возврат к оригиналу.

#### Производительность

- Flip — самая быстрая трансформация: один drawImage с scale
- Для batch из 10 файлов — ожидаемое время < 2 сек на среднем устройстве
- Всё client-side, как существующие инструменты

---

### 9. SEO-страница (конфигурация)

```
slug:         flip-image
intent:       flip
h1:           Flip Image Online
meta.title:   Flip Image Online Free — Mirror Photos Horizontally or Vertically
meta.desc:    Flip or mirror up to 10 JPG, PNG and WebP images horizontally or
              vertically. Free, private, no upload — runs entirely in your browser.
hero.subtitle: Mirror your images horizontally or vertically — fix selfies,
               prepare for print, or unify product photo direction. Batch up to 10.
trustBadges:  ["Free", "No signup", "Browser-based", "Batch up to 10"]
```

#### Рекомендованные SEO-блоки

- «How to flip an image online» (step-by-step: upload → choose H/V → download)
- «Why flip images?» (use cases: selfies, print, product photos, design)
- «Flip vs Rotate — what's the difference?» (internal link to /rotate-image)
- «What does horizontal flip mean?» (поясняет H vs V — частый вопрос в поиске)

#### FAQ (минимум)

1. Is this tool really free? → Yes, 100% free with no limits...
2. Are my images uploaded to a server? → No, all processing happens in your browser...
3. What formats are supported? → JPG, PNG, WebP...
4. What is the difference between horizontal and vertical flip? → Horizontal flip mirrors the image left-to-right (like looking in a mirror). Vertical flip mirrors top-to-bottom (like a reflection in water)...
5. Will flipping reduce image quality? → Flip is a lossless pixel operation. JPEG/WebP are re-encoded at 92% quality, which is visually identical to the original...
6. Can I flip multiple images at once? → Yes, upload up to 10 images and flip them all with one click...
7. How do I fix a mirrored selfie? → Upload your selfie and click «Flip Horizontal» — this reverses the mirror effect from the front-facing camera...
8. Can I flip and rotate in one step? → This tool handles flipping. To rotate, use our [Rotate Image](/rotate-image) tool — you can chain both operations.

#### Related links

- /rotate-image — «Need to rotate instead of flip? Try Rotate Image.»
- /crop-image — «Crop your image after flipping.»
- /compress-image — «Reduce file size after processing.»
- /resize-image — «Change dimensions after flipping.»

---

### 10. Метрики успеха

| Метрика | Цель | Как измерять |
|---------|------|-------------|
| Time-to-first-flip | < 8 сек от загрузки страницы до клика «Flip» | Analytics event timestamps. Flip проще crop/resize — ожидание ниже. |
| Flip completion rate | > 80% из начавших upload завершают flip | Funnel: upload → flip → download |
| Download rate | > 85% из завершивших flip скачивают результат | Events: flip_completed → download |
| Bounce rate | < 40% (для SEO-трафика) | GA / analytics |
| H vs V usage | Отслеживать соотношение horizontal/vertical flip | trackEvent на выбор направления. Ожидание: ~75% horizontal (selfie fix — основной use case). |
| Batch size distribution | Отслеживать среднее кол-во файлов за сессию | trackEvent на upload. Ожидание: ~60% single file, ~30% 2-5 files, ~10% 6-10 files. |

---

## Watermark Image

| Параметр | Значение |
|----------|----------|
| **Название** | Watermark Image |
| **URL** | `/watermark-image/` |
| **ToolKind** | `image-watermark` |
| **Intent** | `watermark` |

### Краткое описание

Batch-инструмент для наложения текстового или графического водяного знака на до 10 изображений (JPG, PNG, WebP) прямо в браузере. Поддерживает два режима: текстовый водяной знак (шрифт, цвет, тень) и логотип/изображение (загрузка собственного файла). Позиционирование — через визуальную 9-точечную сетку или перетаскиванием. Поддерживает как одиночное размещение, так и тайловый (repeating) паттерн.

### Какую проблему решает

Фотографы, дизайнеры и владельцы интернет-магазинов регулярно публикуют изображения, которые могут быть украдены или использованы без разрешения. Наложение водяного знака — стандартный способ защиты авторских прав. Профессиональный софт (Photoshop, Lightroom) избыточен для этой задачи, а бесплатные онлайн-инструменты часто требуют регистрацию, ограничивают функциональность или — ирония — накладывают свой watermark поверх пользовательского. Инструмент решает задачу мгновенно, конфиденциально и без ограничений.

### Основное действие пользователя

Загрузить изображения → настроить водяной знак (текст или логотип, позиция, прозрачность) → скачать результат (по одному или ZIP-архивом).

---

### 1. Основная задача пользователя (Job-to-be-Done)

**«Я хочу быстро наложить свой водяной знак на изображения — защитить авторство или добавить бренд — без установки софта, без регистрации, прямо сейчас.»**

Типичные сценарии:
- Фотограф отправляет клиенту превью фотосессии с водяным знаком «© Studio Name» перед оплатой
- Владелец интернет-магазина маркирует фото товаров логотипом перед публикацией на маркетплейсе
- Дизайнер отправляет макет с watermark клиенту на согласование
- Блогер / контент-мейкер защищает авторские изображения перед публикацией в соцсетях
- HR / маркетолог накладывает корпоративный логотип на фото для презентации или пресс-релиза
- Риэлтор маркирует фотографии объектов логотипом агентства

---

### 2. Ценностное предложение (1 предложение)

> Add a text or logo watermark to up to 10 images — instantly, privately, and free in your browser.

---

### 3. Минимальный набор UI-элементов (MVP Surface)

Структура следует существующему шаблону (`tool-page`): Hero → Tool Card → Results Card.

**Ключевое архитектурное решение**: Watermark Image — batch-инструмент, по модели взаимодействия ближе к Rotate/Flip (глобальная настройка → apply to all), но с более развитой панелью настроек (аналог advanced-секции Crop). Водяной знак настраивается один раз и применяется ко всему batch единообразно — per-image override для позиции/текста не нужен (это выходит за рамки use case и усложняет UX).

#### 3.1. Tool Card — основная рабочая область

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Dropzone** | Drag-and-drop зона + кнопка «Choose images». Принимает JPG, PNG, WebP. До 10 файлов (batch mode). Идентична паттерну из `rotate-tool`. |
| 2 | **Preview canvas** | Превью первого (или выбранного) изображения из batch с наложенным водяным знаком в реальном времени. Это **центральный элемент** — пользователь видит результат до обработки. При batch > 1 под превью — горизонтальный скролл миниатюр для переключения между изображениями. |
| 3 | **Watermark type tabs** | Переключатель: `Text` / `Image`. По умолчанию — `Text` (минимальный friction — не нужно загружать файл). |
| 4 | **Text input** (при type = Text) | Текстовое поле: placeholder «© Your Name». Максимум 100 символов. Изменения применяются к превью в реальном времени. |
| 5 | **Logo upload** (при type = Image) | Компактная зона загрузки: «Upload logo (PNG, SVG)». Принимает PNG (с прозрачностью) и SVG. Максимум 2 MB. После загрузки — миниатюра логотипа с кнопкой «×» для удаления. |
| 6 | **Position selector** | Визуальная сетка 3×3 (9 точек): TL, TC, TR, ML, MC, MR, BL, BC, BR. По умолчанию — **BR (bottom-right)**. Клик по точке — мгновенное перемещение watermark на превью. |
| 7 | **Opacity slider** | Ползунок 0–100% с числовым значением рядом. По умолчанию — **50%**. Изменение — мгновенное обновление превью. |
| 8 | **Size slider** | Ползунок: «Small – Medium – Large». Маппинг: Small = 10% от ширины изображения, Medium = 20%, Large = 35%. По умолчанию — **Medium**. |
| 9 | **Apply button** | Главная CTA: «Apply watermark» (1 файл) или «Apply to N images» (batch). Состояния: idle → processing → done. |
| 10 | **Trust note** | «Your images are processed locally in your browser. Nothing is uploaded.» |

#### 3.2. Results Card

| # | Элемент | Описание |
|---|---------|----------|
| 1 | **Results list** | Список результатов: миниатюра с watermark → имя файла → размер файла before → after → кнопка Download. Аналог results-list из rotate/flip-tool. |
| 2 | **Download All as ZIP** | Кнопка, появляется при > 1 результате. Использует JSZip. |
| 3 | **Reset button** | «Watermark more images (free)» — полный сброс в исходное состояние. |

---

### 4. Дополнительные опции (скрытые по умолчанию / Advanced)

Эти опции НЕ показываются при первом входе. Появляются через раскрывающуюся секцию «More options».

| Опция | Когда показывать | Default |
|-------|-----------------|---------|
| **Font family** (при type = Text) | Панель «More options» | Sans-serif (Inter / system sans). Варианты: Sans-serif, Serif, Monospace, Script/Handwritten (4 группы, по 2–3 конкретных шрифта в каждой) |
| **Font weight** (при type = Text) | Панель «More options» | Bold. Варианты: Regular, Bold |
| **Color picker** (при type = Text) | Панель «More options». Компактная полоска пресетов + custom picker | White (#FFFFFF). Пресеты: White, Black, Red, Blue, Custom |
| **Text shadow / outline** (при type = Text) | Панель «More options» | Shadow ON (чёрная тень 50% opacity, 2px offset). Обеспечивает читаемость на светлых и тёмных фонах. Варианты: None, Shadow, Outline |
| **Rotation** | Панель «More options» | 0°. Ползунок -45° … +45°. Популярный пресет: -30° (диагональный watermark) |
| **Tile / Repeat pattern** | Панель «More options» | Off. Когда On — watermark повторяется по всему изображению сеткой с настраиваемым spacing (sparse / normal / dense). Позиция автоматически переключается на «Full image», position selector скрывается |
| **Tile spacing** (при Tile = On) | Появляется когда Tile включён | Normal. Варианты: Sparse (большие промежутки), Normal, Dense (плотно) |
| **Margin / padding** | Панель «More options» | 5% от ширины. Отступ watermark от краёв изображения при позиционировании в углах/по краям |
| **Output format** | Панель «More options» | Same as input |
| **Output quality** | Панель «More options», только для JPEG/WebP | 0.92 |

**Что НЕ добавляем в этот инструмент** (и почему):
- **Per-image watermark customization** — усложняет UI в разы, выходит за рамки типичного use case. Пользователь ожидает единообразный watermark на весь batch.
- **Remove watermark** — отдельный (и этически спорный) инструмент, другой intent
- **QR-code watermark** — нишевая функция, можно добавить позже как отдельный type
- **Animated watermark / GIF** — не поддерживается существующей архитектурой, формат GIF не в scope

---

### 5. Оптимальные настройки по умолчанию

| Параметр | Значение по умолчанию | Обоснование |
|----------|----------------------|-------------|
| Watermark type | **Text** | Минимальный friction: не нужно загружать файл. Пользователь вводит текст и сразу видит результат. Image/logo — второй таб для опытных пользователей. |
| Text placeholder | **© Your Name** | Подсказывает формат; символ © сразу задаёт контекст «copyright». Пользователь заменяет на своё. |
| Position | **Bottom-right (BR)** | Индустриальный стандарт: правый нижний угол — наименее мешает восприятию изображения, при этом видим. 60-70% стоковых фото, корпоративных и e-commerce изображений используют именно этот угол. |
| Opacity | **50%** | Баланс между видимостью и ненавязчивостью. Слишком низкая (< 30%) — watermark не виден на пёстрых фонах. Слишком высокая (> 70%) — портит изображение. 50% — safe default, который работает на большинстве изображений. |
| Size | **Medium (20% от ширины)** | Достаточно крупный, чтобы быть заметным; достаточно мелкий, чтобы не доминировать. Масштабируется пропорционально к размеру изображения, поэтому одинаково хорошо работает на 800px и 4000px фото. |
| Font | **Sans-serif, Bold** | Максимальная читаемость на любом фоне. Serif выглядит элегантнее, но хуже читается на мелких размерах. |
| Color | **White (#FFFFFF)** | Работает на большинстве фотографий (которые статистически имеют тёмный или средний фон). В сочетании с text shadow — читаем даже на белых участках. |
| Text shadow | **On (чёрная, 50% opacity)** | Критически важно для читаемости белого текста на светлых фонах. Без тени белый текст «пропадает» на небе, снегу, светлых поверхностях. |
| Rotation | **0°** | Прямой текст — наиболее профессиональный вид. Диагональный (–30°) — опция для продвинутых пользователей (чаще используется с тайлом). |
| Tile pattern | **Off** | Single watermark — простой и предсказуемый результат. Тайл — мощная функция, но визуально агрессивен; пользователь включит осознанно. |
| Margin | **5% от ширины** | Watermark не прилипает к краю, выглядит аккуратно. |
| Output format | **Same as input** | Минимум сюрпризов. PNG → PNG (сохраняет прозрачность). |
| Output quality (JPEG/WebP) | **0.92** | Визуально lossless, консистентно с другими инструментами. |
| Max files | **10** | Консистентно с rotate-tool и flip-tool. |
| Max file size | **10 MB** | Консистентно с существующими инструментами. |

---

### 6. User Flow (пошагово)

```
[Загрузка страницы]
     │
     ▼
[Dropzone: "Choose images or drag and drop"]
[Badges: JPG · PNG · WebP · Up to 10 files · Max 10 MB]
     │  пользователь выбирает / перетаскивает файлы
     ▼
[Preview canvas: первое изображение с watermark-превью]
[Thumbnail strip (если batch > 1): переключение между изображениями]
     │
     ▼
[Tabs: Text ● | Image ○]
[Text input: "© Your Name" (placeholder)]
[Position grid: 3×3, выбран BR]
[Opacity slider: 50%]
[Size slider: Medium]
     │
     │  пользователь вводит текст, двигает ползунки
     │  превью обновляется в реальном времени
     │
     ├── [опционально] More options → Font, Color, Shadow, Rotation, Tile
     │
     ▼
[Кнопка "Apply to N images" → активна]
     │  клик
     ▼
[Processing (< 2 сек для batch из 10)]
     │
     ▼
[Results Card: список с превью, размерами, кнопками Download]
[Download All as ZIP (если > 1)]
[Reset: "Watermark more images (free)"]
```

---

### 7. Типичные UX-ошибки, которых нужно избежать

#### 7.1. Критические

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Нет live-превью watermark на изображении** | Пользователь не может оценить размер, позицию, прозрачность до обработки. Единственный способ проверить — export → открыть → оценить → вернуться → подправить. Это убивает конверсию. | Canvas-превью с наложенным watermark обновляется при любом изменении настроек (текст, позиция, opacity, размер). Рендер через CSS overlay (для скорости) или lightweight canvas (для точности). |
| **Watermark нечитаем на определённых фонах** | Белый текст на белом фоне; чёрный на тёмном. Пользователь замечает только после скачивания. | Text shadow ON по умолчанию. Тень противоположного цвета обеспечивает контраст на любом фоне. Для image-watermark — рекомендация в UI: «Use a logo with transparent background for best results.» |
| **Инструмент накладывает свой watermark (или бренд) на результат** | Абсолютный deal-breaker. Пользователь пришёл наложить *свой* watermark — получил вдобавок чужой. Главная жалоба на конкурентов в freemium-модели. | Никогда не добавлять watermark платформы. Trust badge: «No platform watermarks — ever.» |
| **Потеря прозрачности PNG при экспорте** | Пользователь загружает PNG с прозрачным фоном, результат — JPEG с белым фоном + watermark. Альфа-канал потерян. | Всегда сохранять исходный формат. PNG → PNG. Формат меняется только если пользователь явно выбрал другой в «More options». |

#### 7.2. Важные

| Ошибка | Почему это проблема | Решение |
|--------|-------------------|---------|
| **Слишком много настроек на первом экране** | Шрифты, цвета, тени, rotation, tile — всё сразу. Casual user, который хочет «просто накинуть copyright», теряется и уходит. | Progressive disclosure: основной flow — 5 элементов (text input, position, opacity, size, apply button). Font, color, shadow, rotation, tile — в «More options». |
| **Position selector — dropdown вместо визуальной сетки** | «Bottom-right», «Top-center», «Middle-left» в текстовом списке — пользователь не может мгновенно соотнести позицию с изображением. | Визуальная сетка 3×3 (9 точек на мини-прямоугольнике). Клик по точке = мгновенный visual feedback на превью. |
| **Size в пикселях вместо относительных значений** | «Font size 48px» ничего не значит для пользователя, пока он не увидит результат. На изображении 800px — это огромный текст; на 4000px — мелкий. | Относительный размер: Small / Medium / Large (% от ширины изображения). Автомасштабирование — watermark пропорционален на любом изображении. |
| **При batch watermark отличается на разных изображениях** | Если размер watermark фиксирован в пикселях, на маленьком изображении он огромный, на большом — микроскопический. | Размер watermark — процент от ширины каждого конкретного изображения. Medium (20%) выглядит одинаково хорошо на 800px и 4000px. |
| **Нет подтверждения при сбросе** | Пользователь настроил сложный watermark (загрузил логотип, подобрал opacity), случайно нажал «Reset» | Если есть несохранённый результат или загруженный логотип — confirm dialog: «Discard current watermark and start over?» |
| **Logo upload не поддерживает PNG с прозрачностью нормально** | Логотип на белом фоне вместо прозрачного — белый квадрат поверх изображения | Подсказка при загрузке: «For best results, use a PNG with transparent background.» Визуально показать прозрачность шахматным паттерном в миниатюре логотипа. |

#### 7.3. Тонкие, но заметные

| Ошибка | Решение |
|--------|---------|
| Watermark «прыгает» при переключении position | Плавная CSS-анимация (transition 200ms) перемещения watermark при смене позиции. |
| На мобильных ползунки opacity/size слишком мелкие | Минимальная высота ползунка — 44px touch target. Числовое значение рядом достаточно крупное для чтения. |
| При tile-режиме превью тормозит | Для tile-превью использовать CSS `background-repeat` с растеризованным watermark как background-image, а не рисовать N элементов на canvas. Финальный рендер — через canvas. |
| Text input не подсказывает, что можно использовать спецсимволы | Placeholder «© Your Name» + hint под полем: «Tip: use © for copyright, ™ for trademark.» |
| Пользователь не понимает разницу между opacity и color alpha | Не предлагать оба. Только один ползунок opacity, который управляет прозрачностью всего watermark целиком. Color picker без alpha-канала. |
| Batch-превью показывает только первое изображение | Thumbnail strip для навигации между изображениями. Все показывают watermark. Индикация: «Preview — watermark will be applied identically to all N images.» |

---

### 8. Технические рекомендации (для разработки)

#### Архитектурное соответствие

- **ToolKind**: добавить `"image-watermark"` в `ToolKind` union type
- **ToolIntent**: использовать `"watermark"` как основной intent
- **NavSection**: `"image-tools"`
- **Component**: создать `WatermarkTool` в `src/components/watermark-tool.tsx`
- **ToolRuntime**: добавить ветку `if (config.tool.kind === "image-watermark")` в `tool-runtime.tsx`
- **Config**: создать `IMAGE_WATERMARK_TOOL_DEFAULTS` в `defaults.ts`, page config в `pages/image-tools.ts`

#### Canvas-логика

- **Text watermark**: `ctx.font`, `ctx.fillStyle`, `ctx.globalAlpha`, `ctx.fillText()`. Тень — `ctx.shadowColor`, `ctx.shadowBlur`, `ctx.shadowOffsetX/Y`.
- **Image watermark**: загрузка логотипа через `createImageBitmap()`, затем `ctx.drawImage()` с нужными размерами и позицией. `ctx.globalAlpha` для прозрачности.
- **Tile pattern**: цикл `drawImage` / `fillText` по сетке с заданным spacing. Для производительности — отрисовать один watermark на offscreen canvas, затем использовать `ctx.createPattern()` с `repeat`.
- **Rotation**: `ctx.translate()` + `ctx.rotate()` перед отрисовкой watermark.
- **Sizing**: вычислять font-size / logo dimensions как процент от `canvas.width` текущего изображения.

#### Производительность

- Live-превью: использовать downscaled версию (max 1200px). Watermark рисовать на preview canvas.
- Финальный рендер: по оригиналу в полном разрешении.
- Для batch из 10 файлов — ожидаемое время < 3 сек на среднем устройстве.
- Всё client-side, как существующие инструменты.

---

### 9. SEO-страница (конфигурация)

```
slug:         watermark-image
intent:       watermark
h1:           Add Watermark to Image Online
meta.title:   Add Watermark to Image Online Free — Text & Logo Watermarks
meta.desc:    Add text or logo watermarks to up to 10 JPG, PNG and WebP images.
              Free, private, no upload — runs entirely in your browser.
hero.subtitle: Protect your photos with a custom text or logo watermark — instantly
               and privately in your browser. Batch up to 10 images.
trustBadges:  ["Free", "No signup", "Browser-based", "No platform watermarks"]
```

#### Рекомендованные SEO-блоки

- «How to add a watermark to an image online» (step-by-step: upload → configure → apply → download)
- «Why watermark your images?» (use cases: copyright, branding, proof galleries, e-commerce)
- «Text watermark vs logo watermark — which to use?» (guidance for different scenarios)
- «How to create an effective watermark» (tips: opacity, position, size — best practices)

#### FAQ (минимум)

1. Is this tool really free? → Yes, 100% free with no limits on usage. There are no hidden fees, no sign-up required, and — unlike many competitors — no platform watermarks added to your images.
2. Are my images uploaded to a server? → No, all processing happens locally in your browser. Your images never leave your device.
3. What formats are supported? → JPG, PNG, and WebP for images. PNG and SVG for logo uploads.
4. Can I add a logo watermark? → Yes, switch to the «Image» tab and upload your logo (PNG with transparent background recommended).
5. Can I watermark multiple images at once? → Yes, upload up to 10 images and the watermark will be applied identically to all of them.
6. Will the watermark scale to different image sizes? → Yes, the watermark size is proportional to each image's width, so it looks consistent across images of different resolutions.
7. Can I tile the watermark across the entire image? → Yes, enable «Tile pattern» in More Options to repeat the watermark across the full image — commonly used for proof galleries.
8. What opacity should I use? → 50% is a good starting point. Lower (30%) for subtle branding, higher (70–80%) for strong copyright protection.

#### Related links

- /compress-image — «Reduce file size after watermarking.»
- /resize-image — «Resize images before or after adding a watermark.»
- /crop-image — «Crop your image before watermarking.»
- /batch-compress-images — «Compress a batch of watermarked images.»

---

### 10. Метрики успеха

| Метрика | Цель | Как измерять |
|---------|------|-------------|
| Time-to-first-apply | < 20 сек от загрузки страницы до клика «Apply watermark» | Analytics event timestamps. Watermark сложнее flip/rotate (нужно ввести текст), поэтому порог выше. |
| Apply completion rate | > 70% из начавших upload завершают apply | Funnel: upload → configure → apply → download |
| Download rate | > 85% из завершивших apply скачивают результат | Events: watermark_applied → download |
| Bounce rate | < 40% (для SEO-трафика) | GA / analytics |
| Text vs Image usage | Отслеживать соотношение tab-переключений | trackEvent на выбор типа. Ожидание: ~75% text, ~25% image/logo. |
| Tile usage | Процент сессий с включённым тайлом | trackEvent. Ожидание: ~10–15% (proof galleries, stock photographers). |
| Advanced options open rate | % сессий, где пользователь открывает «More options» | trackEvent. Если > 50% — часть опций стоит вынести в основной UI. |
| Batch size distribution | Среднее кол-во файлов за сессию | trackEvent на upload. Ожидание: ~50% single, ~35% 2–5, ~15% 6–10. |

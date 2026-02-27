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

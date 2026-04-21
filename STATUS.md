# Статус проекта (снимок)

Документ отражает состояние функциональности на момент последнего обновления. При значимых изменениях его стоит актуализировать.

**Актуально:** 4 апреля 2026 г. · ветка **`main`** (в прод смотрите последний деплой с этого коммита).

## PDF Converter

### В проде (маршруты и навигация)

- **Хаб** `/convert-pdf/` — выбор формата экспорта (PNG, JPG, TXT, HTML), диапазон страниц, обработка в браузере.
- **SEO-лендинги по формату** (тот же `ConvertPdfTool`, разный `defaultPdfExportFormat` и метаданные):
  - `/pdf-to-png/`, `/pdf-to-jpg/`, `/pdf-to-txt/`, `/pdf-to-html/`
- URL перечислены в **`public/sitemap.xml`** (генерация в **`prebuild`** / `npm run generate:sitemap` из `src/lib/sitemap-entries.ts`).
- В шапке (**PDF Tools**): `convert-pdf` и четыре лендинга выше.

### Готово (UX и инфраструктура)

- Загрузка PDF (drag-and-drop, лимиты), подсчёт страниц **pdf.js**, диапазон From–To.
- Выбор целевого формата в UI (кастомный список).
- Имя файла: суффикс `-converted`, для диапазона — `-pN-M`.
- После обработки: **Download** / **Choose another PDF** (без карточки Results сравнения размеров).
- Аналитика: `tool_open` (с `page_slug` для лендингов), `file_uploaded`, `action_started`, `action_completed`, `error`, `download_result`; `page_range` в payload. Коды ошибок — см. `docs/analytics-convert-pdf.md`.

### Готово (обработка в браузере)

- `mode: "browser-pdf-export"` (`PDF_CONVERT_TOOL_DEFAULTS`).
- **PNG / JPG** — рендер страниц, ZIP при нескольких страницах (`jszip`).
- **TXT / HTML** — текстовый слой (сканы могут дать пустой текст).
- Worker копируется в `public/` через `scripts/copy-pdf-worker.mjs` (`predev` / `prebuild`).

### Не готово

- **DOCX, XLSX, PPTX** — в UI «coming soon», отдельный движок не подключён.

### Конфиги без маршрутов

- В **`pdf-tools.ts`** по-прежнему лежат **`compressPdfPage`**, **`mergePdfPage`** — в **`pages.config.ts`** в `rawPages` **не** входят, пока не будет готов функционал.

## Сборка

- Регулярно: **`npm run build`** после крупных правок (статический экспорт, `out/`).
- Sitemap обновляется перед сборкой автоматически (`prebuild`).

## Бэклог (кратко)

1. Office-экспорт (DOCX/XLSX/PPTX) или убрать из UI до готовности.
2. По желанию: качество HTML/растра, настройки рендера.
3. **Compress PDF / Merge PDF:** добавить в `rawPages` и реализовать инструменты.
4. CI: стабильно проходят `build` и линт.

## Зависимости (PDF)

- `pdfjs-dist`, `jszip`.

---

*Обновляйте при смене прод-фич, подключении новых страниц или заметных изменениях сборки.*

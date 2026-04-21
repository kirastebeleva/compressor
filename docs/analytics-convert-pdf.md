# Analytics: Convert PDF (`pdf-convert`)

Инструмент: страница **`/convert-pdf/`**, `ToolKind`: **`pdf-convert`**.

События отправляются через `gtag("event", …)` обёртками из [`src/lib/analytics.ts`](../src/lib/analytics.ts). Общие поля: `buildBaseParams` → `tool`, `file_type`, `file_size_mb`, `device`; опционально `page_slug`, `file_count`, `from_format`, `to_format`, `page_range`.

---

## Обязательный набор (lifecycle)

| GA4 event name     | Когда срабатывает | Где в коде |
|--------------------|-------------------|------------|
| **`tool_open`**    | Один раз при монтировании страницы инструмента | [`PdfConvertToolRuntime`](../src/tool-page/tool-runtime.tsx) → `trackToolOpen(kind, slug)` |
| **`file_uploaded`**| После успешной валидации: добавлен хотя бы один PDF в очередь | [`ConvertPdfTool`](../src/components/convert-pdf-tool.tsx) → `addPdfFiles` → `trackFileUploaded` |
| **`action_started`**| Нажата «Convert PDF», начата обработка | `onConvert` → `trackActionStarted` |
| **`action_completed`**| Успешное завершение (реальный экспорт в браузере или stub) | `onConvert` → `trackActionCompleted` (`elapsed_ms`, `output_size_mb`, `success_count`, `fail_count`) |
| **`error`**        | Показана ошибка пользователю (валидация, лимиты, чтение PDF, сбой экспорта) | `trackError` с полем **`error_message`** (snake_case код) |

---

## Дополнительно (не входят в пятёрку, но полезны)

| Event | Когда |
|-------|--------|
| **`page_meta`** | Legacy: при открытии страницы (`trackPageMeta`) — `page_slug`, `tool_intent`, `tool_mode`. |
| **`download_result`** | Клик по ссылке скачивания результата (`trackDownloadResult`). |

---

## Коды `error_message` (Convert PDF)

| Код | Ситуация |
|-----|----------|
| `not_pdf` | Файл не PDF |
| `file_too_large` | Файл больше лимита на один файл |
| `max_files_exceeded` | Превышено максимальное число файлов в батче (лишние отброшены) |
| `total_limit_exceeded` | Превышен суммарный размер батча |
| `pdf_read_failed` | Не удалось прочитать PDF (повреждён / защита паролем и т.п.) |
| `no_file_selected` | Нет файлов или страницы ещё не посчитаны |
| `invalid_page_range` | Некорректный диапазон страниц при конвертации |
| `processing_not_available` | Режим не stub и не поддерживаемый экспорт |
| `processing_failed` | Исключение при экспорте |

---

## Полезная нагрузка для сегментации

- **`page_slug`**: `convert-pdf`
- **`from_format`**: `pdf`
- **`to_format`**: `png` \| `jpg` \| `txt` \| `html` \| … (выбранный формат)
- **`page_range`**: `all` или `2-7` (диапазон для аналитики)
- **`file_count`**: число PDF в батче

---

## Переиспользование для других инструментов

Используйте те же функции: `trackToolOpen`, `trackFileUploaded`, `trackActionStarted`, `trackActionCompleted`, `trackError` с типом `ToolEventParams` и стабильными кодами в `error_message`.

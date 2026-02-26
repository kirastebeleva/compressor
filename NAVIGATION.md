0. Назначение документа

Этот документ описывает глобальную навигацию сайта:

header

footer

принципы масштабирования навигации при добавлении новых инструментов

Документ обязателен к соблюдению при:

добавлении нового инструмента

изменении header / footer

переработке навигации

Project_rules.md имеет приоритет при конфликтах,
но все навигационные решения должны соответствовать этому документу.

1. Принципы навигации
1.1. Разделение ролей

Header — UX, быстрый доступ к ключевым инструментам

Footer — SEO + полный список инструментов

Related Tools — основная внутренняя перелинковка

Навигация ≠ SEO-кластер.

1.2. Масштабируемость

Навигация должна:

корректно работать при 2 инструментах

не ломаться при 20+ инструментах

не требовать полной переделки при росте проекта

2. Header Navigation
2.1. Общая структура

В header используется один основной dropdown:

Image Tools ▼

Другие dropdown’ы запрещены без согласования.

2.2. Структура dropdown

Dropdown всегда состоит из категорий, а не плоского списка.

Допустимые категории:

Optimize

Convert

(добавление новых категорий — только по согласованию)

2.3. Содержимое категорий
Optimize (core image tools)

Compress Image (/compress-image)

Resize Image (/resize-image)

Crop Image (/crop-image)

Rotate Image (/rotate-image)

Convert

Convert Image (/convert-image)

Image to PDF (/image-to-pdf)

PDF to Image (/pdf-to-image)

⚠️ В header:

не более 6–8 ссылок суммарно

только core-инструменты

запрещены format-specific страницы
(/compress-jpg, /resize-png и т.п.)

2.4. Что запрещено в header

❌ Плоский список всех страниц
❌ Format-specific инструменты
❌ SEO-страницы под long-tail
❌ Заглушки “Coming soon”
❌ Временные ссылки

Header должен выглядеть «законченным» на любом этапе.

3. Footer Navigation
3.1. Назначение footer

Footer:

содержит полный список инструментов

используется для SEO и навигации опытных пользователей

может масштабироваться до 15–20 ссылок

3.2. Структура footer

Footer всегда группируется по категориям.

Optimize Tools

Compress Image

Resize Image

Crop Image

Rotate Image

Flip Image

Compress JPG

Compress PNG

Resize JPG

Convert Tools

Convert Image

Image to PDF

PDF to Image

Допускается добавление новых ссылок без изменения структуры.

4. Related Tools (внутренняя навигация)
4.1. Обязательность

Каждая страница инструмента обязана иметь блок Related Tools.

4.2. Правила

2–4 ссылки

только логически связанные инструменты

текущая страница не включается

анкор = название инструмента

4.3. Примеры
Resize Image

Compress Image

Crop Image

Convert Image

Compress Image

Resize Image

Compress JPG

Compress PNG

5. Добавление нового инструмента — чеклист

При добавлении нового инструмента:

Проверить, является ли он core
→ если да — добавить в header
→ если нет — только footer + related tools

Добавить ссылку в footer

Настроить Related Tools на новой странице

Не менять структуру header/footer

6. Что запрещено без согласования

Изменять структуру dropdown

Добавлять новые категории

Превышать лимит ссылок в header

Дублировать footer-логику в header

Итог

Этот документ:

фиксирует навигацию

защищает UX

предотвращает SEO-хаос

позволяет масштабироваться без переделок
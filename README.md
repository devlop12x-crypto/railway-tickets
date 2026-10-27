# Система бронирования ж/д билетов

Дипломная работа к профессии «Frontend-разработчик».

[![CI / Deploy](https://github.com/devlop12x-crypto/railway-tickets/actions/workflows/deploy.yml/badge.svg)](https://github.com/devlop12x-crypto/railway-tickets/actions/workflows/deploy.yml)

**Демо:** https://devlop12x-crypto.github.io/railway-tickets/

## Задача

SPA на React для покупки ж/д билетов по макетам в Figma и готовому API: поиск направлений с фильтрами, выбор поезда, вагона и мест, данные пассажиров, оплата, подтверждение заказа.

## Разбор на подзадачи

- [x] Этап 1. Каркас: Vite + React + TypeScript, ESLint (recommended `eslint-plugin-react`), Prettier, тесты, CI/CD на GitHub Pages
- [ ] Этап 2. Вёрстка всех страниц по макету, роутинг, якорные ссылки меню
- [ ] Этап 3. Компоненты с валидацией форм
- [ ] Этап 4. Работа с API: поиск, пагинация, сортировка, заказ, обработка ошибок

## Структура

```
src/
├── app/       корневой компонент
├── test/      настройка тестов
├── main.tsx   точка входа
└── index.css  базовые стили
.github/
└── workflows/ CI: линтер, форматирование, типы, тесты → деплой на Pages
```

## Нетривиальные решения

- **Vite вместо Create React App.** CRA объявлен устаревшим в феврале 2025 года и больше не рекомендуется документацией React, поэтому проект инициализирован через Vite.
- **ESLint в flat config.** К требуемому `react.configs.flat.recommended` добавлены `jsx-runtime`, `react-hooks` и `jsx-a11y`, а `eslint-config-prettier` идёт последним и снимает конфликты с форматтером.
- **Версии зафиксированы.** ESLint остаётся на 9-й версии, потому что `eslint-plugin-react` и `eslint-plugin-jsx-a11y` не поддерживают 10-ю, а TypeScript на 6.0, потому что `typescript-eslint` требует `<6.1`.
- **Base сборки из имени репозитория.** Workflow передаёт `--base=/<репозиторий>/`, поэтому пути к ассетам не зашиты в конфиг и переживают переименование репозитория.
- **Деплой только после проверок.** Job публикации зависит от job с линтером, Prettier, `tsc` и тестами, так что на Pages не попадает сборка с ошибками.

## Стек

React 19.3, TypeScript 6.0, Vite 8.3, Vitest 5 + Testing Library, ESLint 9 (typescript-eslint, react, react-hooks, jsx-a11y) + Prettier, GitHub Actions → GitHub Pages.

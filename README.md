# Project Setup

## Requirements

- PHP 8.5+
- Composer 2.8+
- Node.js 20+
- npm
- Laravel 13
- SQLite (default) or MySQL/MariaDB
- Git

## Installation

```bash
git clone https://github.com/laylock21/reactlarav
cd <project-folder>

composer install
npm install

cp .env.example .env

php artisan key:generate

git clone https://github.com/laylock21/reactlarav && cd reactlarav && composer install && npm install && cp .env.example .env && php artisan key:generate && touch database/database.sqlite && php artisan migrate --seed && npm run dev
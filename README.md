# POS Application

A simple Point of Sale (POS) application built with Laravel, Inertia.js, React, and shadcn/ui.

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 18 + Inertia.js
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Database**: SQLite
- **Build Tool**: Vite

## Features

- **Dashboard** - Overview of sales stats, orders today, revenue, and recent orders
- **POS** - Point of Sale interface with shopping cart
- **Products** - CRUD operations for products with categories
- **Categories** - CRUD operations for product categories
- **Orders** - View transaction history
- **Toast Notifications** - Success/error messages for all operations

## Installation

1. Clone the repository:
```bash
cd pos-app
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations:
```bash
php artisan migrate
```

7. (Optional) Seed initial data:
```bash
php artisan tinker --execute="
\App\Models\Category::create(['name' => 'Food']);
\App\Models\Category::create(['name' => 'Beverage']);
\App\Models\Category::create(['name' => 'Snack']);
\App\Models\Product::create(['name' => 'Burger', 'category_id' => 1, 'price' => 5.99, 'stock' => 50]);
\App\Models\Product::create(['name' => 'Pizza', 'category_id' => 1, 'price' => 8.99, 'stock' => 30]);
\App\Models\Product::create(['name' => 'Coffee', 'category_id' => 2, 'price' => 2.99, 'stock' => 100]);
\App\Models\Product::create(['name' => 'Soda', 'category_id' => 2, 'price' => 1.99, 'stock' => 80]);
\App\Models\Product::create(['name' => 'Chips', 'category_id' => 3, 'price' => 1.49, 'stock' => 60]);
echo 'Seeded!';
"
```

## Running the Application

Start the Laravel server:
```bash
php artisan serve
```

Start the Vite development server:
```bash
npm run dev
```

Access the application at `http://localhost:8000`

## Building for Production

```bash
npm run build
```

## Project Structure

```
pos-app/
├── app/
│   ├── Http/Controllers/
│   │   ├── CategoryController.php
│   │   ├── DashboardController.php
│   │   ├── OrderController.php
│   │   └── ProductController.php
│   └── Models/
│       ├── Category.php
│       ├── Product.php
│       ├── Order.php
│       └── OrderItem.php
├── resources/
│   └── js/
│       ├── components/
│       │   ├── layout/
│       │   │   └── Layout.jsx
│       │   └── ui/           # shadcn components
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Categories/Index.jsx
│           ├── Products/Index.jsx
│           ├── Orders/Index.jsx
│           └── POS/Index.jsx
├── routes/
│   └── web.php
└── database/
    └── database.sqlite
```

## Database Schema

- **categories**: id, name, timestamps
- **products**: id, name, category_id, price, stock, description, timestamps
- **orders**: id, total_amount, status, timestamps
- **order_items**: id, order_id, product_id, quantity, unit_price, subtotal, timestamps

## Available Routes

| Method | URI | Description |
|--------|-----|-------------|
| GET | / | Dashboard |
| GET | /pos | POS Interface |
| POST | /pos/checkout | Process checkout |
| GET | /products | Product list |
| POST | /products | Create product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |
| GET | /categories | Category list |
| POST | /categories | Create category |
| PUT | /categories/{id} | Update category |
| DELETE | /categories/{id} | Delete category |
| GET | /orders | Order history |

## License

MIT

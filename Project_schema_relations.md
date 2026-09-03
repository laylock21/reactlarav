Table: analytics_events
PK | id             | BIGINT   |
FK | product_id     | BIGINT   |
   | event_type     | ENUM     |
   | quantity       | INT      |
   | amount         | DECIMAL  | null
   | reference_type | VARCHAR  |
   | reference_id   | BIGINT   |
   | created_at     | TIMESTAMP|

Table: analytics_snapshot
PK | id             | BIGINT   |
FK | product_id     | BIGINT   |
   | snapshot_date  | DATE     |
   | stock_quantity | INT      |
   | total_sold     | INT      |
   | total_added    | INT      |
   | total_removed  | INT      |
   | total_revenue  | DECIMAL  |
   | total_returns  | INT      |
   | created_at     | TIMESTAMP|

Table: stocks
PK | id               | BIGINT   |
FK | product_id       | BIGINT   |
   | type             | ENUM     |
   | quantity         | INT      |
   | status           | ENUM     |
   | reference_number | VARCHAR  | null
   | notes            | TEXT     | null
   | created_at       | TIMESTAMP|

Table: stock_movements
PK | id              | BIGINT   |
FK | product_id      | BIGINT   | UNIQUE
   | quantity_before | INT      |
   | quantity_after  | INT      |
   | quantity_change | INT      |
   | reason          | TEXT     |
   | created_at      | TIMESTAMP|

Table: categories
PK | id          | BIGINT   |
UQ | name        | VARCHAR  |
   | description | TEXT     | null
FK | parent_id   | BIGINT   | null
   | created_at  | TIMESTAMP|
   | updated_at  | TIMESTAMP|

Table: products
PK | id            | BIGINT   |
UQ | sku           | VARCHAR  |
   | barcode       | VARCHAR  | null
   | name          | VARCHAR  |
FK | category_id   | BIGINT   |
FK | supplier_id   | BIGINT   |
   | quantity      | INT      |
   | cost_price    | DECIMAL  | null
   | selling_price | DECIMAL  |
   | image_path    | TEXT     | null
   | status        | ENUM     |
   | is_active     | ENUM     |
   | description   | TEXT     | null
   | created_at    | TIMESTAMP|
   | updated_at    | TIMESTAMP|

Table: suppliers
PK | id             | BIGINT   |
UQ | name           | VARCHAR  |
   | contact_person | VARCHAR  | null
   | phone          | VARCHAR  | null
   | email          | VARCHAR  | null
   | address        | TEXT     | null
   | created_at     | TIMESTAMP|
   | updated_at     | TIMESTAMP|

Table: product_tags
FK | product_id | BIGINT  |
FK | tag_id     | BIGINT  |

Table: tags
PK | id         | BIGINT   |
UQ | name       | VARCHAR  |
UQ | slug       | VARCHAR  |
   | created_at | TIMESTAMP|

Table: customers
PK | id         | BIGINT   |
   | name       | VARCHAR  |
   | email      | VARCHAR  |
   | phone      | VARCHAR  |
   | address    | VARCHAR  |
   | created_at | TIMESTAMP|

Table: orders
PK | id                 | BIGINT   |
UQ | order_number       | VARCHAR  |
FK | user_id            | BIGINT   |
FK | customer_id        | BIGINT   |
   | customer_type      | ENUM     |
   | customer_reference | VARCHAR  | null
   | platform           | ENUM     |
   | status             | ENUM     |
   | total_amount       | DECIMAL  |
   | notes              | TEXT     | null
   | ordered_at         | TIMESTAMP|
   | created_at         | TIMESTAMP|
   | updated_at         | TIMESTAMP|

Table: order_items
PK | id           | BIGINT   |
FK | order_id     | BIGINT   |
FK | product_id   | BIGINT   |
   | quantity     | INT      |
   | unit_price   | DECIMAL  |
   | total_amount | DECIMAL  |
   | created_at   | TIMESTAMP|
   | updated_at   | TIMESTAMP|

Table: stock_thresholds
PK | id           | BIGINT   |
FK | product_id   | BIGINT   | UNIQUE
   | min_quantity | INT      |
   | max_quantity | INT      | null
   | created_at   | TIMESTAMP|

Table: user_settings
PK | id             | BIGINT  |
FK | user_id        | BIGINT  | UNIQUE
   | items_per_page | INT     |
   | theme          | ENUM    |

Table: users
PK | id         | BIGINT   |
UQ | email      | VARCHAR  |
   | name       | VARCHAR  |
   | password   | VARCHAR  |
   | role       | ENUM     |
   | is_active  | BOOLEAN  |
   | created_at | TIMESTAMP|
   | updated_at | TIMESTAMP|

Table: action_logs
PK | id          | BIGINT   |
FK | user_id     | BIGINT   |
   | action      | VARCHAR  |
   | model_type  | ENUM     |
   | model_id    | BIGINT   |
   | description | TEXT     |
   | changes     | JSON     |
   | created_at  | TIMESTAMP|

Table: notifications
PK | id         | BIGINT   |
   | type       | ENUM     |
   | title      | VARCHAR  |
   | message    | TEXT     |
   | action_url | VARCHAR  |
   | is_read    | BOOLEAN  |
   | read_at    | TIMESTAMP|
   | created_at | TIMESTAMP|

// Relationships
| **Table 1**        | **Relationship (as labeled)** | **Table 2**           |
| ------------------ | ----------------------------- | --------------------- |
| `products`         | One to Many                   | `analytics_event`     |
| `products`         | One to Many                   | `analytics_snapshots` |
| `products`         | One to Many                   | `stocks`              |
| `products`         | One to Many                   | `product_tags`        |
| `products`         | One to One                    | `stock_movements`     |
| `products`         | One to One                    | `stock_thresholds`    |
| `categories`       | One to Many                   | `products`            |
| `categories`       | One to Many                   | `categories`          |
| `suppliers`        | One to Many                   | `products`            |
| `tags`             | One to Many                   | `product_tags`        |
| `customers`        | One to Many                   | `orders`              |
| `products`         | One to Many                   | `order_items`         |
| `orders`           | One to Many                   | `order_items`         |
| `users`            | One to Many                   | `orders`              |
| `users`            | One to Many                   | `action_logs`         |
| `users`            | One to One                    | `user_settings`       |


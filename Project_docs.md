# Analytics
Originally, analytics were designed to store daily records for trend comparison and visualization. To optimize database performance and reduce server load, a hybrid approach was adopted that combines automated snapshots with event-driven logging.

Analytics operates by cross-referencing the live database against two dedicated tracking tables:

**Analytics events:** Capture real-time system changes, updates, and additions alongside corresponding system notifications.
**Analytics snapshots:** Capture automated weekly data points to serve as a baseline for accurate historical comparisons alongside real-time events.

**Table analytics_events** {
  id BIGINT [pk]
  product_id BIGINT
  event_type ENUM
  quantity INT
  amount DECIMAL [null]
  reference_type VARCHAR
  reference_id BIGINT
  created_at TIMESTAMP
}
_Record 1_

- **id:** 1
- **product_id:** 1001     /*relating to the certain product in product table*/
- **event_type:** Sale     /*type of event eg. Sale, Restock, Return*/
- **quantity:** 20 
- **amount:** 400     /*total computed price depending on quantity and product price*/
- **reference_type:** Order     /*direct relation to table where the action is done*/
- **reference_id:** 101     /*same as above but its id as reference*/
- **created_at:** 2026-02-01 12:00:00

_Record 2_

- **id:** 2
- **product_id:** 1001
- **event_type:** Stock alert      /*Could record alongside notification if it reaches a certain threshold*/
- **quantity:** 0
- **amount:** null     /*Changes depending on relation to the table, ex. product, orders, etc.*/
- **reference_type:** Stock_threshold
- **reference_id:** 5001
- **created_at:** 2026-02-01 14:30:00


**Table analytics_snapshot** {
  id BIGINT [pk]
  product_id BIGINT
  snapshot_date DATE
  stock_quantity INT
  total_sold INT
  total_added INT
  total_removed INT
  total_revenue DECIMAL
  total_returns INT
  created_at TIMESTAMP
}
_Record 1_

- **id:** 1
- **product_id:** 1001
- **snapshot_date:** 2026-02-01
- **stock_quantity:** 45
- **total_sold:** 2
- **total_added:** 0
- **total_removed:** 2
- **total_revenue:** 1999.98
- **total_returns:** 0
- **created_at:** 2026-02-02 00:00:00

_Record 2_

- **id:** 2
- **product_id:** 1002
- **snapshot_date:** 2026-02-01
- **stock_quantity:** 120
- **total_sold:** 5
- **total_added:** 20
- **total_removed:** 0
- **total_revenue:** 149.95
- **total_returns:** 0
- **created_at:** 2026-02-02 00:00:00


# Stocks
The purpose of stocks is to manage product quantities. Stock entries are linked to products, and the product supplies the supplier relationship. Adding a stock entry with a "delivered" status will automatically add stock for that product.

The stock threshold alerts the user and updates the product's status. If the upper or lower threshold is triggered, it notifies the user and records the event in `analytics_event`.

Stock movements track quantity changes for a specific product. For example, 30 orders would deduct 30 units from that product to show the decrease, and it also accounts for additions or a combination of both, serving as logs for each product change.

**Table stocks** {
  id BIGINT [pk]
  product_id BIGINT
  type ENUM
  quantity INT
  status ENUM
  reference_number VARCHAR [null]
  notes TEXT [null]
  created_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **product_id:** 1001
- **type:** Stock-in
- **quantity:** 50
- **status:** Delivered
- **reference_number:** REC-2026-01
- **notes:** Initial shipment received
- **created_at:** 2026-01-10 10:00:00

_Record 2_

- **id:** 2
- **product_id:** 1002
- **type:** Stock-in
- **quantity:** 150
- **status:** Delivered
- **reference_number:** REC-2026-02
- **notes:** Bulk restocking shipment
- **created_at:** 2026-01-11 11:00:00

**Table stock_thresholds** {
  id BIGINT [pk]
  product_id BIGINT
  min_quantity INT [not null]
  max_quantity INT [null]
  created_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **product_id:** 1001
- **min_quantity:** 10
- **max_quantity:** 100
- **created_at:** 2026-01-01 00:00:00

_Record 2_

- **id:** 2
- **product_id:** 1002
- **min_quantity:** 25
- **max_quantity:** 200
- **created_at:** 2026-01-01 00:00:00

**Table stock_movements** {
  id BIGINT [pk]
  product_id BIGINT
  quantity_before INT [not null]
  quantity_after INT
  quantity_change INT
  reason TEXT [null]
  created_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **product_id:** 1001
- **quantity_before:** 47
- **quantity_after:** 45
- **quantity_change:** -2
- **reason:** ORDER_FULFILLMENT
- **created_at:** 2026-02-01 14:30:00

_Record 2_

- **id:** 2
- **product_id:** 1002
- **quantity_before:** 100
- **quantity_after:** 120
- **quantity_change:** 20
- **reason:** MANUAL_CORRECT
- **created_at:** 2026-02-02 09:15:00

# Categories
Categories work simply as a filter for products to make searching easier for the user. The category table is linked to products, allowing each product to fall under a specific category.

Additionally, categories can have subcategories. The distinction is that a main category does not have a `parent_id`, whereas a subcategory does. Optimally, subcategories should be used when assigning categories to products to provide a clearer distinction.

Table categories {
  id BIGINT [pk]
  name VARCHAR [unique]
  description TEXT [null]
  parent_id BIGINT [null]
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **name:** Electronics
- **description:** Electronic devices & accessories
- **parent_id:** NULL
- **created_at:** 2026-01-01 00:00:00
- **updated_at:** 2026-01-01 00:00:00

_Record 2_

- **id:** 2
- **name:** Laptops
- **description:** Portable computers and notebooks
- **parent_id:** 1     /*Clear example of subcategory, relating to the one on top*/
- **created_at:** 2026-01-01 00:00:00
- **updated_at:** 2026-01-01 00:00:00


# Tags
Tags are simple and work similarly to categories. However, unlike categories, multiple tags can be attached to a single product as much as the user wants.

To resolve initial complications regarding how tags would work alongside the existing category table, a pivot table named `product_tags` was created. A single product can have multiple `product_tags` entries, allowing the user to add as many tags as desired.

**Table tags** {
  id BIGINT [pk]
  name VARCHAR [unique]
  slug VARCHAR [unique]
  created_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **name:** Best Seller
- **slug:** best-seller     /*Simply the same as name but easier to be hyperlinked, it can be used by the runtime to redirect to tags*/
- **created_at:** 2026-01-01 00:00:00

_Record 2_

- **id:** 2
- **name:** Clearance
- **slug:** clearance
- **created_at:** 2026-01-01 00:00:00

**Table product_tags** {
  product_id BIGINT
  tag_id BIGINT
}

_Record 1_

- **product_id:** 1001
- **tag_id:** 1

_Record 2_

- **product_id:** 1001
- **tag_id:** 2     /*An example of adding multiple tags to a single product*/


# Suppliers
The suppliers table is the most straightforward table, designed simply for entering supplier information. It is linked exclusively to the products table—and since products are connected to stocks, each product is associated with only a single supplier.

**Table suppliers** {
  id BIGINT [pk]
  name VARCHAR [unique]
  contact_person VARCHAR [null]
  phone VARCHAR [null]
  email VARCHAR [null]
  address TEXT [null]
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

_Record 1_

- **id:** 101
- **name:** TechSupply Co
- **contact_person:** Jane Doe
- **phone:** +1234567890
- **email:** contact@techsupply.com
- **address:** 123 Tech St, City
- **created_at:** 2026-01-01 00:00:00
- **updated_at:** 2026-01-01 00:00:00

_Record 2_

- **id:** 102
- **name:** Global Components
- **contact_person:** John Smith
- **phone:** +1987654321
- **email:** sales@globalcomp.com
- **address:** 456 Industrial Rd, City
- **created_at:** 2026-01-01 00:00:00
- **updated_at:** 2026-01-01 00:00:00


# Products
Products are the main focus of this system. Each product is connected to a category and a supplier, while tags can be applied and searched through the `product_tags` junction table. Product status tracks the current stock availability of the item within the system. Whenever a change occurs, a controller updates the product status.

Table products {
  id BIGINT [pk]
  sku VARCHAR [unique]
  barcode VARCHAR [null]
  name VARCHAR
  category_id BIGINT
  supplier_id BIGINT
  quantity INT
  cost_price DECIMAL [null]
  selling_price DECIMAL
  image_path TEXT[null]
  status ENUM
  is_active ENUM
  description TEXT [null]
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

_Record 1_

- **id:** 1001
- **sku:** SKU-LAP-01
- **barcode:** 123456789012
- **name:** Pro Laptop 15"
- **category_id:** 2
- **supplier_id:** 101
- **quantity:** 45
- **cost_price:** 700.00
- **selling_price:** 999.99
- **status:** IN_STOCK
- **is_active:** ACTIVE
- **description:** High-performance laptop
- **created_at:** 2026-01-10 08:00:00
- **updated_at:** 2026-01-10 08:00:00

# Customers
Customers are an essential part of the ordering system and are necessary for the future development of this inventory/e-commerce system. Additionally, most customer records are autofilled using APIs from multiple e-commerce sites whenever an order is placed.

Table customers {
  id BIGINT [pk]
  name VARCHAR
  email VARCHAR
  phone VARCHAR
  address VARCHAR
  created_at TIMESTAMP
}


# Orders
Orders are connected to customers and users, while their products are stored in `order_items`. Customers can be auto-generated via API or created manually by the user. Users process the order, though the user can be the system itself if the order is auto-generated.

The `orders` table stores the order header and overall total. The related `order_items` table stores each product, quantity, unit price, and line total, allowing one order to contain multiple products. Orders allow you to complete or decline a transaction, as well as track the order status, such as whether it is delivered or returned.

Table orders {
  id BIGINT [pk]
  order_number VARCHAR [unique]
  user_id BIGINT
  total_amount DECIMAL
  customer_id BIGINT
  customer_type ENUM
  customer_reference VARCHAR [null]
  platform ENUM
  status ENUM
  notes TEXT [null]
  ordered_at TIMESTAMP
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

_Record 1_

- **id:** 5001
- **order_number:** ORD-2026-001     /*auto generated database identifier for the order and is better to be displayed instead of id but not for the customer*/
- **user_id:** 1     /*Since its 1, then it's a system generated order*/
- **total_amount:** 1999.98     /*sum of the related order_items total_amount values*/
- **customer_id:** 2001
- **customer_type:** Online     /*Method of purchase of customer*/
- **customer_reference:** REF-991     /*Reference to be given to the customer to track the order*/
- **platform:** Lazada     /*could be the ecommerce platform or in store*/
- **status:** COMPLETED
- **notes:** Fast delivery requested
- **ordered_at:** 2026-02-01 14:30:00     /*The date where the order was processed on ecommerce*/
- **created_at:** 2026-02-01 14:30:00
- **updated_at:** 2026-02-01 15:00:00

_Record 2_

- **id:** 5002
- **order_number:** ORD-2026-002
- **user_id:** 501
- **total_amount:** 29.99
- **customer_id:** 2002
- **customer_type:** In-store
- **customer_reference:** REF-992
- **platform:** In-store
- **status:** PENDING
- **notes:** NULL
- **ordered_at:** 2026-02-02 10:00:00
- **created_at:** 2026-02-02 10:00:00
- **updated_at:** 2026-02-02 10:00:00

**Table order_items** {
  id BIGINT [pk]
  order_id BIGINT
  product_id BIGINT
  quantity INT
  unit_price DECIMAL
  total_amount DECIMAL
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

`order_items` resolves the limitation of storing one product directly on `orders`. Each row represents one product line in an order, so an order can contain multiple products while preserving the price and quantity used at the time of purchase.

_Record 1_

- **id:** 1
- **order_id:** 5001
- **product_id:** 1001
- **quantity:** 2
- **unit_price:** 999.99
- **total_amount:** 1999.98
- **created_at:** 2026-02-01 14:30:00
- **updated_at:** 2026-02-01 14:30:00

_Record 2_

- **id:** 2
- **order_id:** 5002
- **product_id:** 1002
- **quantity:** 1
- **unit_price:** 29.99
- **total_amount:** 29.99
- **created_at:** 2026-02-02 10:00:00
- **updated_at:** 2026-02-02 10:00:00


# Notifications + Action logs
Notifications are used to provide alerts to the user. They are designed for quick checking and are clickable, redirecting the user to the specific page for that alert. Specifically for orders, notifications provide short, summarized results (for example: 20 new orders, 2 cancelled orders, 10 delivered orders). Overall, notifications display alerts, warnings, and completed actions.

Action logs are more complex. The plan was either to use a controller to receive and log processed actions—handling incoming actions like a firewall—or to have every action use a controller that logs the database operation, such as creating a log entry whenever a product is created.

| Action                  | Action Log | Notification? | Who gets notified?    |
| ----------------------- | ---------: | ------------: | --------------------- |
| Product created         |          ✅ |             ❌ | —                     |
| Product updated         |          ✅ |             ❌ | —                     |
| Product deleted         |          ✅ |             ❌ | —                     |
| Product deactivated     |          ✅ |            ⚠️ | Admin/Manager         |
| Product reactivated     |          ✅ |            ⚠️ | Admin/Manager         |
| Stock manually adjusted |          ✅ |             ✅ | Admin/Manager         |
| Stock reaches low level |          ✅ |             ✅ | Inventory staff/Admin |
| Stock reaches zero      |          ✅ |             ✅ | Inventory staff/Admin |
| Stock replenished       |          ✅ |            ⚠️ | Admin/Manager         |
| Order created           |          ✅ |             ✅ | Inventory staff       |
| Order approved          |          ✅ |            ⚠️ | Relevant staff        |
| Order cancelled         |          ✅ |             ✅ | Inventory staff/Admin |
| Order completed         |          ✅ |          ❌/⚠️ | Depends on workflow   |
| Supplier created        |          ✅ |             ❌ | —                     |
| Supplier updated        |          ✅ |             ❌ | —                     |
| Purchase order created  |          ✅ |             ✅ | Purchasing/Admin      |
| Purchase order received |          ✅ |             ✅ | Inventory staff       |
| User created            |          ✅ |            ⚠️ | Admin                 |
| User role changed       |          ✅ |             ✅ | Admin                 |
| User deactivated        |          ✅ |             ✅ | Admin                 |
| Login/logout            |         ✅* |             ❌ | —                     |

**Table notifications** {
  id BIGINT [pk]
  type enum
  title VARCHAR
  message TEXT
  action_url VARCHAR
  is_read BOOLEAN
  read_at TIMESTAMP
  created_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **type:** Stocks     /*relates to the table its referring to*/
- **title:** Low Stock Alert
- **message:** Product SKU-LAP-01 is near reorder threshold.
- **action_url:** /stock-in/1001     /*Most likely the user will click the message*/
- **is_read:** false
- **read_at:** NULL
- **created_at:** 2026-02-01 18:00:00

_Record 2_

- **id:** 2
- **type:** Orders
- **title:** New Order Placed
- **message:** Order #ORD-2026-002 requires fulfillment.
- **action_url:** /orders/5002
- **is_read:** true
- **read_at:** 2026-02-02 10:05:00
- **created_at:** 2026-02-02 10:00:00

**Table action_logs** {
  id BIGINT [pk]
  user_id BIGINT
  action VARCHAR
  model_type ENUM
  model_id BIGINT
  description TEXT
  changes JSON
  created_at TIMESTAMP
}

_Record 1_

- **id:** 1
- **user_id:** 501     /*User who did the action, also if system generated it will be user id 01*/
- **action:** UPDATE     /*Usually CRUD*/
- **model_type:** PRODUCT     /*model refers to the table the action was connected*/
- **model_id:** 1001     /*Specifically the id of that table the action was done*/
- **description:** Updated stock levels
- **changes:** `{"quantity": {"old": 47, "new": 45}}`
- **created_at:** 2026-02-01 14:30:00

_Record 2_

- **id:** 2
- **user_id:** 502
- **action:** UPDATE
- **model_type:** STOCK
- **model_id:** 2
- **description:** Corrected inventory variance
- **changes:** `{"quantity": {"old": 100, "new": 120}}`
- **created_at:** 2026-02-02 09:15:00

# User settings
User settings can be improved and expanded into multiple tables; however, as of now, these are the settings applicable to the user.

**Table user_settings** {
  id BIGINT [pk]
  user_id BIGINT
  items_per_page INT
  theme ENUM
}

_Record 1_

- **id:** 1
- **user_id:** 501
- **items_per_page:** 25
- **theme:** DARK


# Users
In future, the two factor and passkey would be added and applied for users

Table users {
  id BIGINT [pk]
  email VARCHAR [unique]
  name VARCHAR
  password VARCHAR
  role ENUM
  is_active BOOLEAN
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

# Page - Database table connection

| Page                 | Main table(s) used                                           | Purpose                                          |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| **Dashboard**        | `products`, `stock_movements`, `orders`                      | Summary cards and recent activity                |
| **Products**         | `products` + `stock_thresholds`                              | Manage products and view current quantity/status |
| **Stock Management** | `stock_movements` JOIN `products`                            | View all stock increases and deductions          |
| **Stock In**         | `stocks` JOIN `products` JOIN `suppliers`                   | Add stock to a product from a supplier           |
| **Archived**         | `products`                                                   | `is_active = false`                              |
| **Orders**           | `orders` JOIN `order_items` JOIN `products` JOIN `customers` JOIN `users` | Process customer orders and their product lines. |
| **Users**            | `users`                                                      | User management                                  |
| **Suppliers**        | `suppliers`                                                  | Supplier management                              |
| **Analytics**        | `analytics_snapshot`, `analytics_events`, plus source tables | Reports and charts                               |
| **Customers**        | `customers`                                                  | Store and manage customer profiles               |
| **Settings**         | `users`, `user_settings`                                     | System configuration                             |
| **Notifications**    | `notifications`                                              | View alerts and completed actions.               |

# Relationships
| **Table 1**        | **Relationship (as labeled)** | **Table 2**           |
| ------------------ | ----------------------------- | --------------------- |
| `products`         | One to Many                   | `analytics_events`    |
| `products`         | One to Many                   | `analytics_snapshot`  |
| `products`         | One to Many                   | `stocks`              |
| `products`         | One to Many                   | `product_tags`        |
| `products`         | One to Many                   | `stock_movements`     |
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


# Other notes

Venti
Toggle sidebar

Platform
Dashboard -  not needed for clarification
Products - products JOIN with stock threshold,
Stock Movement - `stock_movements` JOIN `products`, showing the before quantity, after quantity, quantity change, reason, and timestamp for each product adjustment.
Archived - product.is_active = false,
Categories -  not needed for clarification
Stock In - table that shows increase in stocks
Stock Out - table that shows decrease in stocks
Users -  not needed for clarification
Suppliers -  not needed for clarification
Analytics -  not needed for clarification
Settings -  not needed for clarification

**Table (Page):** Customer Order History **Main table(s) used:** `customers JOIN orders JOIN order_items JOIN products` **Purpose:** View a customer's contact details alongside their past orders and the products purchased.




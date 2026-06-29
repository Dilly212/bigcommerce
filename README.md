# @mipod/bigcommerce

Multi-tenant BigCommerce API client for Node.js. Designed for connecting multiple BigCommerce stores to a single Business Central environment.

## Installation

```bash
npm install @mipod/bigcommerce
```

## Setup

Each store needs a **store hash** and **access token** from your BigCommerce API credentials. You can provide these via environment variables or register them at runtime.

### Option 1 — Environment variables

Create a `.env` file (use [`.env.example`](.env.example) as a template). Any `<CODE>_BIGCOMMERCE_STORE_HASH` / `<CODE>_BIGCOMMERCE_CLIENT_ACCESS_TOKEN` pair is auto-loaded at startup.

```env
B2B_BIGCOMMERCE_STORE_HASH=your_store_hash
B2B_BIGCOMMERCE_CLIENT_ACCESS_TOKEN=your_access_token

B2C_BIGCOMMERCE_STORE_HASH=your_store_hash
B2C_BIGCOMMERCE_CLIENT_ACCESS_TOKEN=your_access_token
```

### Option 2 — Programmatic registration

Register stores directly in code — useful when credentials come from a database or secret manager.

```js
const bc = require('@mipod/bigcommerce');

bc.registerStore('B2B', { storeHash: 'abc123', accessToken: 'xyz' });
bc.registerStore('B2C', { storeHash: 'def456', accessToken: 'uvw' });
```

You can mix both options. Programmatic registration takes effect immediately and overrides any env-var entry with the same code.

---

## Required API Permissions

When creating an API account in BigCommerce (**Settings → API Accounts → Create API Account**), configure the following OAuth scopes. Use **read-only** if your integration only reads data; use **modify** if it also writes (create/update/delete).

| Scope | Level needed | Covers |
|---|---|---|
| **Products** | read-only / modify | `products`, `variants`, `brands`, `categories`, `productOptions`, `images`, `priceLists` |
| **Customers** | read-only / modify | `customers`, `customerGroups` |
| **Orders** | read-only / modify | `orders`, `shipments` |
| **Store Locations** | read-only | `inventory.getLocations()` |
| **Store Inventory** | read-only / modify | `inventory.getItems()`, `inventory.setAbsolute()`, `inventory.adjustRelative()` |
| **Information & settings** | read-only / modify | `shipping` (zones and methods) |
| **Metafields Access** | Standard or full | `metafields` — **Standard** covers app-owned namespaces; **full** covers all namespaces including those created by other apps |

> **Webhooks** do not have a dedicated scope. Webhook management works with any valid API account. Webhooks will only deliver events for resources covered by your account's other scopes.

### Recommended setup for a full Business Central integration

| Scope | Level |
|---|---|
| Products | modify |
| Customers | modify |
| Orders | modify |
| Store Locations | read-only |
| Store Inventory | modify |
| Information & settings | modify |
| Metafields Access | full |

You need **one API account per store**. Each account generates its own store hash + access token pair, which maps to a single `registerStore()` call.

---

## Usage

Every method takes a **store code** as its first argument. This is the key used when registering the store (`'B2B'`, `'B2C'`, etc.).

```js
const bc = require('@mipod/bigcommerce');

const { data } = await bc.products.getList('B2B', { limit: 50 });
const { data } = await bc.orders.getList('B2C', { status_id: 11 });
```

---

## API Reference

### `bc.registerStore(code, { storeHash, accessToken })`

Register a store at runtime. `code` is case-insensitive.

```js
bc.registerStore('WHOLESALE', { storeHash: 'abc123', accessToken: 'your_access_token' });
```

---

### Products — `bc.products`

```js
const { data } = await bc.products.getList('B2B', { limit: 50, page: 1 });
const { data } = await bc.products.getOne('B2B', 42);
const { data } = await bc.products.create('B2B', {
  name: 'My Product',
  type: 'physical',
  price: 19.99,
  weight: 1,
});
const { data } = await bc.products.update('B2B', 42, { price: 24.99 });
await bc.products.remove('B2B', 42);
```

---

### Variants — `bc.variants`

```js
// Variants for a specific product
const { data } = await bc.variants.getList('B2B', productId);
const { data } = await bc.variants.getOne('B2B', productId, variantId);
const { data } = await bc.variants.create('B2B', productId, {
  sku: 'SKU-RED-LG',
  option_values: [{ option_display_name: 'Color', label: 'Red' }],
});
const { data } = await bc.variants.update('B2B', productId, variantId, { price: 29.99 });
await bc.variants.remove('B2B', productId, variantId);

// All variants across all products — useful for bulk inventory sync
const { data } = await bc.variants.listAll('B2B', { sku: 'SKU-001' });
```

---

### Product Options — `bc.productOptions`

Options produce variants (e.g. Size, Color). Modifiers don't (e.g. text engraving, gift wrap).

```js
// Options
const { data } = await bc.productOptions.getOptions('B2B', productId);
const { data } = await bc.productOptions.createOption('B2B', productId, {
  display_name: 'Size',
  type: 'rectangles',
  option_values: [{ label: 'S' }, { label: 'M' }, { label: 'L' }],
});
await bc.productOptions.updateOption('B2B', productId, optionId, { display_name: 'Size (US)' });
await bc.productOptions.removeOption('B2B', productId, optionId);

// Option values
const { data } = await bc.productOptions.getOptionValues('B2B', productId, optionId);
await bc.productOptions.createOptionValue('B2B', productId, optionId, { label: 'XL' });
await bc.productOptions.updateOptionValue('B2B', productId, optionId, valueId, { label: 'XL / Extra Large' });
await bc.productOptions.removeOptionValue('B2B', productId, optionId, valueId);

// Modifiers
const { data } = await bc.productOptions.getModifiers('B2B', productId);
await bc.productOptions.createModifier('B2B', productId, { display_name: 'Gift Message', type: 'text' });
await bc.productOptions.updateModifier('B2B', productId, modifierId, { required: true });
await bc.productOptions.removeModifier('B2B', productId, modifierId);
```

---

### Orders — `bc.orders`

```js
// List orders — supports BC filter params (status_id, min_date_created, customer_id, etc.)
const orders = await bc.orders.getList('B2B', { status_id: 11, limit: 50 });

const order = await bc.orders.getOne('B2B', orderId);

// Update order status (e.g. 2 = Pending, 10 = Awaiting Fulfillment, 11 = Awaiting Shipment)
await bc.orders.update('B2B', orderId, { status_id: 2 });

const products = await bc.orders.getProducts('B2B', orderId);
const addresses = await bc.orders.getShippingAddresses('B2B', orderId);
const statuses = await bc.orders.getStatuses('B2B');
```

---

### Shipments — `bc.shipments`

```js
const shipments = await bc.shipments.getList('B2B', orderId);
const shipment  = await bc.shipments.getOne('B2B', orderId, shipmentId);

// Create a shipment — marks the order as shipped and sends tracking to the customer
await bc.shipments.create('B2B', orderId, {
  tracking_number: '1Z999AA10123456784',
  shipping_provider: 'ups',
  order_address_id: addressId,
  items: [{ order_product_id: productId, quantity: 1 }],
});

await bc.shipments.update('B2B', orderId, shipmentId, { tracking_number: '9400111899223397910163' });
await bc.shipments.remove('B2B', orderId, shipmentId);
```

---

### Price Lists — `bc.priceLists`

```js
// Price list CRUD
const { data } = await bc.priceLists.getList('B2B');
const { data } = await bc.priceLists.create('B2B', { name: 'Wholesale Pricing', active: true });
await bc.priceLists.update('B2B', priceListId, { name: 'Wholesale Pricing 2025' });
await bc.priceLists.remove('B2B', priceListId);

// Records — the actual price overrides per SKU/currency
const { data } = await bc.priceLists.getRecords('B2B', priceListId, { sku: 'SKU-001' });
await bc.priceLists.upsertRecords('B2B', priceListId, [
  { sku: 'SKU-001', currency: 'USD', price: 14.99, sale_price: 12.99 },
  { sku: 'SKU-002', currency: 'USD', price: 29.99 },
]);
await bc.priceLists.deleteRecords('B2B', priceListId, { sku: 'SKU-001' });

// Assignments — link a price list to a customer group or channel
await bc.priceLists.upsertAssignments('B2B', [
  { price_list_id: priceListId, customer_group_id: groupId },
]);
const { data } = await bc.priceLists.getAssignments('B2B', { price_list_id: priceListId });
await bc.priceLists.deleteAssignments('B2B', { price_list_id: priceListId });
```

---

### Metafields — `bc.metafields`

Store cross-system IDs (e.g. Business Central record IDs) on any BigCommerce entity without polluting core fields.

Supported resource types: `products`, `variants`, `categories`, `brands`, `customers`, `orders`, `channels`

```js
// Store a Business Central ID on a product
await bc.metafields.create('B2B', 'products', productId, {
  key: 'bc_item_no',
  value: 'ITEM-001',
  namespace: 'business_central',
  permission_set: 'read',
});

// Read it back
const { data } = await bc.metafields.getList('B2B', 'products', productId, {
  namespace: 'business_central',
});

// Update or remove
await bc.metafields.update('B2B', 'products', productId, metafieldId, { value: 'ITEM-002' });
await bc.metafields.remove('B2B', 'products', productId, metafieldId);

// Works the same for any resource type
await bc.metafields.create('B2B', 'customers', customerId, {
  key: 'bc_customer_no',
  value: 'C-00042',
  namespace: 'business_central',
  permission_set: 'read',
});

await bc.metafields.create('B2B', 'orders', orderId, {
  key: 'bc_sales_order_no',
  value: 'SO-10001',
  namespace: 'business_central',
  permission_set: 'read',
});
```

---

### Webhooks — `bc.webhooks`

```js
const { data } = await bc.webhooks.getList('B2B');
const { data } = await bc.webhooks.getOne('B2B', hookId);

// Register a webhook — BC will POST to your endpoint when the event fires
await bc.webhooks.create('B2B', {
  scope: 'store/order/statusUpdated',
  destination: 'https://your-app.com/webhooks/bigcommerce',
  is_active: true,
  headers: { 'X-Custom-Auth': 'secret' },
});

await bc.webhooks.update('B2B', hookId, { is_active: false });
await bc.webhooks.remove('B2B', hookId);
```

Common webhook scopes:
- `store/order/created` — new order placed
- `store/order/statusUpdated` — order status changed
- `store/product/updated` — product edited
- `store/inventory/updated` — stock level changed

---

### Shipping — `bc.shipping`

```js
// Zones
const zones = await bc.shipping.getZones('B2B');
const zone  = await bc.shipping.getZone('B2B', zoneId);
await bc.shipping.createZone('B2B', { name: 'Continental US' });
await bc.shipping.updateZone('B2B', zoneId, { name: 'Lower 48' });
await bc.shipping.removeZone('B2B', zoneId);

// Methods per zone
const methods = await bc.shipping.getMethods('B2B', zoneId);
await bc.shipping.createMethod('B2B', zoneId, {
  name: 'Ground Shipping',
  type: 'perorder',
  settings: { rate: '9.99' },
  enabled: true,
});
await bc.shipping.updateMethod('B2B', zoneId, methodId, { enabled: false });
await bc.shipping.removeMethod('B2B', zoneId, methodId);
```

---

### Brands — `bc.brands`

```js
const { data } = await bc.brands.getList('B2B');
const { data } = await bc.brands.getOne('B2B', brandId);
await bc.brands.create('B2B', { name: 'Acme Co.' });
await bc.brands.update('B2B', brandId, { name: 'Acme Corp.' });
await bc.brands.remove('B2B', brandId);
```

---

### Categories — `bc.categories`

```js
const { data } = await bc.categories.getList('B2B');
const { data } = await bc.categories.getOne('B2B', categoryId);
await bc.categories.create('B2B', { name: 'Electronics', parent_id: 0 });
await bc.categories.update('B2B', categoryId, { name: 'Electronics & Gadgets' });
await bc.categories.remove('B2B', categoryId);
```

---

### Customers — `bc.customers`

```js
const { data } = await bc.customers.getList('B2C', { limit: 100 });
const { data } = await bc.customers.getOne('B2C', customerId);
await bc.customers.create('B2C', { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' });
await bc.customers.update('B2C', customerId, { phone: '555-1234' });
await bc.customers.remove('B2C', customerId);
```

---

### Customer Groups — `bc.customerGroups`

```js
const groups  = await bc.customerGroups.getList('B2B');
await bc.customerGroups.create('B2B', {
  name: 'Wholesale',
  discount_rules: [{ type: 'all', method: 'percent', amount: '10.0000' }],
});
await bc.customerGroups.update('B2B', groupId, { name: 'Wholesale VIP' });
await bc.customerGroups.remove('B2B', groupId);
```

---

### Images — `bc.images`

```js
// Upload from a public URL (BC fetches and stores it)
await bc.images.uploadFromUrl('B2B', productId, {
  image_url: 'https://example.com/photo.jpg',
  is_thumbnail: true,
});

// Upload from buffer (use when source URLs may expire)
await bc.images.uploadFromBuffer('B2B', productId, 'https://example.com/photo.jpg', {
  is_thumbnail: true,
});

await bc.images.remove('B2B', productId, imageId);
```

---

### Inventory — `bc.inventory`

```js
const { data } = await bc.inventory.getLocations('B2B');
const { data } = await bc.inventory.getItems('B2B', { sku: 'SKU-001' });

// Set to exact quantity
await bc.inventory.setAbsolute('B2B', [{ sku: 'SKU-001', location_id: 1, quantity: 50 }]);

// Adjust by delta
await bc.inventory.adjustRelative('B2B', [{ sku: 'SKU-001', location_id: 1, quantity: -5 }]);
```

---

## Multi-store example

```js
const bc = require('@mipod/bigcommerce');

bc.registerStore('B2B', { storeHash: process.env.B2B_HASH, accessToken: process.env.B2B_TOKEN });
bc.registerStore('B2C', { storeHash: process.env.B2C_HASH, accessToken: process.env.B2C_TOKEN });

// Sync an order to Business Central, then stamp the BC sales order number back as a metafield
async function syncOrderToBC(site, orderId, bcSalesOrderNo) {
  const order = await bc.orders.getOne(site, orderId);
  const products = await bc.orders.getProducts(site, orderId);

  // ... send to Business Central ...

  await bc.metafields.create(site, 'orders', orderId, {
    key: 'bc_sales_order_no',
    value: bcSalesOrderNo,
    namespace: 'business_central',
    permission_set: 'read',
  });
}

// When Business Central ships, create the shipment in BigCommerce
async function fulfillOrder(site, orderId, addressId, items, trackingNumber) {
  await bc.shipments.create(site, orderId, {
    tracking_number: trackingNumber,
    shipping_provider: 'ups',
    order_address_id: addressId,
    items,
  });
  await bc.orders.update(site, orderId, { status_id: 2 }); // Shipped
}

// Sync inventory across both stores
async function syncInventory(sku, quantity) {
  await Promise.all([
    bc.inventory.setAbsolute('B2B', [{ sku, location_id: 1, quantity }]),
    bc.inventory.setAbsolute('B2C', [{ sku, location_id: 1, quantity }]),
  ]);
}
```

---

## License

MIT

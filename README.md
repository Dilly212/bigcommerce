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

## Usage

Every method takes a **store code** as its first argument. This is the key used when registering the store (`'B2B'`, `'B2C'`, etc.).

```js
const bc = require('@mipod/bigcommerce');

// Products from the B2B store
const { data } = await bc.products.getList('B2B', { limit: 50 });

// Customers from the B2C store
const { data } = await bc.customers.getList('B2C');
```

---

## API Reference

### `bc.registerStore(code, { storeHash, accessToken })`

Register a store at runtime. `code` is case-insensitive.

```js
bc.registerStore('WHOLESALE', {
  storeHash: 'abc123',
  accessToken: 'your_access_token',
});
```

---

### Products — `bc.products`

```js
// List products (supports any BC query params)
const { data } = await bc.products.getList('B2B', { limit: 50, page: 1 });

// Get a single product by ID
const { data } = await bc.products.getOne('B2B', 42);

// Create a product
const { data } = await bc.products.create('B2B', {
  name: 'My Product',
  type: 'physical',
  price: 19.99,
  weight: 1,
});

// Update a product
const { data } = await bc.products.update('B2B', 42, { price: 24.99 });

// Delete a product
await bc.products.remove('B2B', 42);
```

---

### Brands — `bc.brands`

```js
const { data } = await bc.brands.getList('B2B');
const { data } = await bc.brands.getOne('B2B', 5);
const { data } = await bc.brands.create('B2B', { name: 'Acme Co.' });
const { data } = await bc.brands.update('B2B', 5, { name: 'Acme Corp.' });
await bc.brands.remove('B2B', 5);
```

---

### Categories — `bc.categories`

```js
const { data } = await bc.categories.getList('B2B');
const { data } = await bc.categories.getOne('B2B', 10);
const { data } = await bc.categories.create('B2B', {
  name: 'Electronics',
  parent_id: 0,
});
const { data } = await bc.categories.update('B2B', 10, { name: 'Electronics & Gadgets' });
await bc.categories.remove('B2B', 10);
```

---

### Customers — `bc.customers`

```js
// List customers (supports filters: email:in, company:in, etc.)
const { data } = await bc.customers.getList('B2C', { limit: 100 });

// Get a single customer by ID
const { data } = await bc.customers.getOne('B2C', 123);

// Create a customer
const { data } = await bc.customers.create('B2C', {
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
});

// Update a customer
const { data } = await bc.customers.update('B2C', 123, { phone: '555-1234' });

// Delete a customer
await bc.customers.remove('B2C', 123);
```

---

### Customer Groups — `bc.customerGroups`

```js
const groups = await bc.customerGroups.getList('B2B');
const group  = await bc.customerGroups.getOne('B2B', 2);

const newGroup = await bc.customerGroups.create('B2B', {
  name: 'Wholesale',
  discount_rules: [{ type: 'all', method: 'percent', amount: '10.0000' }],
});

await bc.customerGroups.update('B2B', 2, { name: 'Wholesale VIP' });
await bc.customerGroups.remove('B2B', 2);
```

---

### Images — `bc.images`

```js
// List images for a product
const { data } = await bc.images.getList('B2B', 42);

// Upload from a public URL (BigCommerce fetches and stores it)
const { data } = await bc.images.uploadFromUrl('B2B', 42, {
  image_url: 'https://example.com/photo.jpg',
  is_thumbnail: true,
  sort_order: 0,
});

// Upload from a buffer (use when the source URL may expire)
const { data } = await bc.images.uploadFromBuffer(
  'B2B',
  42,
  'https://example.com/photo.jpg',
  { is_thumbnail: true, sort_order: 0 }
);

// Delete an image
await bc.images.remove('B2B', 42, imageId);
```

---

### Inventory — `bc.inventory`

```js
// List inventory locations
const { data } = await bc.inventory.getLocations('B2B');

// Get current inventory levels (filter by sku, variant_id, location_id, etc.)
const { data } = await bc.inventory.getItems('B2B', { sku: 'SKU-001' });

// Set inventory to an exact quantity
await bc.inventory.setAbsolute('B2B', [
  { sku: 'SKU-001', location_id: 1, quantity: 50 },
  { sku: 'SKU-002', location_id: 1, quantity: 20 },
]);

// Adjust inventory by a delta (positive = add, negative = subtract)
await bc.inventory.adjustRelative('B2B', [
  { sku: 'SKU-001', location_id: 1, quantity: -5 },
]);
```

---

## Multi-store example

```js
const bc = require('@mipod/bigcommerce');

// Register stores from your secret manager at startup
bc.registerStore('B2B', { storeHash: process.env.B2B_HASH, accessToken: process.env.B2B_TOKEN });
bc.registerStore('B2C', { storeHash: process.env.B2C_HASH, accessToken: process.env.B2C_TOKEN });

// Sync inventory across two stores
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

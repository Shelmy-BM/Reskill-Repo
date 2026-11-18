-- Book Worm eCommerce Bookstore — PostgreSQL Data Model
-- Derived from wireframes (Catalogue, PDP, Cart/Checkout, Payment, Orders, Writers, Reviews)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gift_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE writers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  role VARCHAR(160) NOT NULL,
  location VARCHAR(160),
  bio TEXT NOT NULL,
  avatar_url TEXT
);

CREATE TABLE publishers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE books (
  id VARCHAR(64) PRIMARY KEY,
  isbn VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  writer_id VARCHAR(64) NOT NULL REFERENCES writers(id),
  publisher_id INTEGER NOT NULL REFERENCES publishers(id),
  description TEXT NOT NULL,
  back_cover_blurb TEXT NOT NULL,
  default_format VARCHAR(32) NOT NULL CHECK (default_format IN ('Paperback', 'Hardcover', 'eBook')),
  price_inr NUMERIC(10, 2) NOT NULL,
  language VARCHAR(40) NOT NULL DEFAULT 'English',
  delivery_estimate VARCHAR(100) NOT NULL,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5,
  copies_sold INTEGER NOT NULL DEFAULT 0,
  section VARCHAR(64) NOT NULL DEFAULT 'Catalogue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE book_categories (
  book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(160) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saved_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address_line TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pin VARCHAR(20) NOT NULL,
  phone_code VARCHAR(10) NOT NULL DEFAULT '+91',
  phone_number VARCHAR(30) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India'
);

CREATE TABLE wishlist_items (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, book_id)
);

CREATE TABLE orders (
  id VARCHAR(32) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(32) NOT NULL CHECK (status IN ('Confirmed', 'Shipped', 'Delivered')),
  payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('Credit Card', 'Debit card', 'UPI', 'Wallet')),
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  points_redeemed INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(32) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id VARCHAR(64) NOT NULL REFERENCES books(id),
  format VARCHAR(32) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL
);

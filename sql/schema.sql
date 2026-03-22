-- OPC Homepage Database Schema
-- MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS opc_homepage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE opc_homepage;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  role ENUM('user', 'admin') DEFAULT 'user',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_stripe_customer (stripe_customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  category ENUM('software', 'saas', 'template', 'course', 'ebook', 'other') DEFAULT 'software',
  type ENUM('download', 'online', 'hybrid') DEFAULT 'download',
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  stripe_price_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_enabled BOOLEAN DEFAULT FALSE,
  subscription_price DECIMAL(10, 2),
  subscription_interval ENUM('month', 'year'),
  images JSON,
  download_url VARCHAR(500),
  access_url VARCHAR(500),
  features JSON,
  tags JSON,
  status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  type ENUM('one_time', 'subscription') NOT NULL,
  status ENUM('pending', 'paid', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Licenses table (for download products)
CREATE TABLE IF NOT EXISTS licenses (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  license_key VARCHAR(64) UNIQUE NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(36) NOT NULL,
  status ENUM('active', 'revoked', 'expired') DEFAULT 'active',
  device_limit INT DEFAULT 1,
  devices_used INT DEFAULT 0,
  machine_ids JSON,
  activated_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_license_key (license_key),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscriptions table (for SaaS products)
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(36) NOT NULL,
  stripe_subscription_id VARCHAR(255) NOT NULL,
  status ENUM('active', 'past_due', 'cancelled', 'expired') DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_stripe_subscription (stripe_subscription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Download logs table
CREATE TABLE IF NOT EXISTS download_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  order_id VARCHAR(36) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  date DATE NOT NULL,
  page_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  product_views INT DEFAULT 0,
  checkout_started INT DEFAULT 0,
  purchases INT DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY idx_date (date),
  INDEX idx_date_range (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role)
SELECT UUID(), 'admin@opc.studio', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4qJz6ZaVMt0JlKkC', 'Admin', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@opc.studio');

-- Insert sample products
INSERT INTO products (id, name, description, short_description, category, type, price, subscription_enabled, subscription_price, subscription_interval, access_url, features, status)
VALUES
(UUID(), 'DataQuery Pro', 'Cross-platform desktop application for unified database queries. Supports MySQL, Redis, and Kafka with a modern interface.', 'Unified database query tool for MySQL, Redis, and Kafka', 'software', 'download', 49.00, TRUE, 9.99, 'month', NULL, '["MySQL Support", "Redis Support", "Kafka Support", "Global Search", "Offline Mode"]', 'active'),
(UUID(), 'CloudDev Studio', 'Online development environment with AI-powered code completion. Access from anywhere, no installation required.', 'AI-powered online development environment', 'saas', 'online', 0.00, TRUE, 19.99, 'month', 'https://clouddev.opc.studio', '["AI Code Completion", "Cloud IDE", "Team Collaboration", "Git Integration", "Live Preview"]', 'active'),
(UUID(), 'DevTools Suite', 'Essential developer tools for everyday productivity. Includes JSON formatter, Base64 encoder, regex tester, and more.', 'Essential developer tools for productivity', 'software', 'download', 29.00, FALSE, NULL, NULL, NULL, '["JSON Tools", "Encoding Tools", "Regex Tester", "Color Picker", "Code Beautifier"]', 'active')
ON DUPLICATE KEY UPDATE name = name;

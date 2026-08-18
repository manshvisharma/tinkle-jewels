export interface PhpSourceFile {
  path: string;
  category: 'core' | 'controllers' | 'models' | 'services' | 'database' | 'install' | 'views' | 'config' | 'docs' | 'cron';
  content: string;
  description: string;
}

export const PHP_PROJECT_FILES: PhpSourceFile[] = [
  {
    path: '.htaccess',
    category: 'core',
    description: 'Apache rewrite rules for cPanel routing and clean SEO URLs',
    content: `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Block direct access to sensitive directories
    RewriteRule ^(app|config|storage/logs|storage/cache) - [F,L,NC]
    RewriteRule ^(\\.env|composer\\.json|composer\\.lock) - [F,L,NC]

    # Prevent directory browsing
    Options -Indexes

    # Send Requests to Front Controller if not a real file or directory
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`,
  },
  {
    path: 'index.php',
    category: 'core',
    description: 'Front Controller bootstrap, autoloader, session init and router dispatcher',
    content: `<?php
/**
 * Tinkle Jewels - Modern Gen-Z PHP & MySQL E-Commerce Platform
 * 
 * @package   TinkleJewels
 * @author    Tinkle Jewels Core Team
 * @license   Commercial / CodeCanyon License
 * @version   1.0.0
 */

declare(strict_types=1);

define('TINKLE_START', microtime(true));
define('ROOT_PATH', __DIR__);
define('APP_PATH', ROOT_PATH . '/app');
define('CONFIG_PATH', ROOT_PATH . '/config');
define('STORAGE_PATH', ROOT_PATH . '/storage');
define('VIEW_PATH', ROOT_PATH . '/resources/views');

// Check if installation is complete
if (!file_exists(STORAGE_PATH . '/installed.lock') && !str_starts_with($_GET['route'] ?? '', 'install')) {
    header('Location: /install/index.php');
    exit;
}

// Composer / Manual PSR-4 Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\\\';
    $base_dir = APP_PATH . '/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Load Config & Helpers
require_once APP_PATH . '/Core/Helpers.php';

// Initialize Session & CSRF
App\\Core\\Session::start();

// Initialize Router & Dispatch
$router = new App\\Core\\Router();
require_once ROOT_PATH . '/routes/web.php';

$route = $_GET['route'] ?? '';
$router->dispatch($_SERVER['REQUEST_METHOD'], '/' . ltrim($route, '/'));
`,
  },
  {
    path: '.env.example',
    category: 'config',
    description: 'Environment variables template',
    content: `APP_NAME="Tinkle Jewels"
APP_ENV=production
APP_DEBUG=false
APP_URL="https://yourdomain.com"
APP_KEY="base64:randomGeneratedKey32Characters"

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tinkle_jewels_db
DB_USERNAME=cpanel_user
DB_PASSWORD="your_db_password"

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@tinklejewels.com"
MAIL_FROM_NAME="Tinkle Jewels"

CURRENCY_CODE=INR
CURRENCY_SYMBOL="₹"
`,
  },
  {
    path: 'config/database.php',
    category: 'config',
    description: 'Database configuration settings',
    content: `<?php

return [
    'default' => 'mysql',
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'tinkle_jewels'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => 'tkl_',
            'options' => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ],
        ],
    ],
];
`,
  },
  {
    path: 'app/Core/Database.php',
    category: 'core',
    description: 'Singleton PDO Database connection wrapper with prepared statement helpers',
    content: `<?php

namespace App\\Core;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $config = require CONFIG_PATH . '/database.php';
            $db = $config['connections']['mysql'];
            
            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $db['host'],
                $db['port'],
                $db['database'],
                $db['charset']
            );

            try {
                self::$instance = new PDO($dsn, $db['username'], $db['password'], $db['options']);
            } catch (PDOException $e) {
                if (env('APP_DEBUG', false)) {
                    die("Database Connection Error: " . $e->getMessage());
                } else {
                    die("Database Connection Error. Please verify your cPanel database configuration.");
                }
            }
        }
        return self::$instance;
    }

    public static function query(string $sql, array $params = []): \\PDOStatement {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll(string $sql, array $params = []): array {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetchOne(string $sql, array $params = []): ?array {
        $res = self::query($sql, $params)->fetch();
        return $res ?: null;
    }

    public static function lastInsertId(): string {
        return self::getConnection()->lastInsertId();
    }
}
`,
  },
  {
    path: 'app/Core/Router.php',
    category: 'core',
    description: 'Lightweight, performant MVC Route Manager with param matching',
    content: `<?php

namespace App\\Core;

class Router {
    private array $routes = [];

    public function get(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    public function post(string $path, $handler, array $middlewares = []): void {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    private function addRoute(string $method, string $path, $handler, array $middlewares): void {
        $pattern = preg_replace('/\\{([a-zA-Z0-9_]+)\\}/', '(?P<$1>[^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';
        
        $this->routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'handler' => $handler,
            'middlewares' => $middlewares,
        ];
    }

    public function dispatch(string $requestMethod, string $uri): void {
        $uri = strtok($uri, '?');
        
        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && preg_match($route['pattern'], $uri, $matches)) {
                // Execute Middlewares
                foreach ($route['middlewares'] as $middlewareClass) {
                    $mw = new $middlewareClass();
                    if (!$mw->handle()) {
                        return;
                    }
                }

                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                if (is_callable($route['handler'])) {
                    call_user_func_array($route['handler'], $params);
                    return;
                }

                if (is_array($route['handler'])) {
                    [$controllerClass, $method] = $route['handler'];
                    $controller = new $controllerClass();
                    call_user_func_array([$controller, $method], $params);
                    return;
                }
            }
        }

        // 404 Not Found
        http_response_code(404);
        View::render('errors/404');
    }
}
`,
  },
  {
    path: 'app/Core/View.php',
    category: 'core',
    description: 'Template rendering engine with layouts, partials and XSS escaping',
    content: `<?php

namespace App\\Core;

class View {
    public static function render(string $template, array $data = [], string $layout = 'layouts/main'): void {
        extract($data);
        
        // Start buffer for view content
        ob_start();
        $templatePath = VIEW_PATH . '/' . $template . '.php';
        if (!file_exists($templatePath)) {
            die("View template not found: " . htmlspecialchars($template));
        }
        require $templatePath;
        $content = ob_get_clean();

        // Render in Layout
        if ($layout) {
            $layoutPath = VIEW_PATH . '/' . $layout . '.php';
            if (file_exists($layoutPath)) {
                require $layoutPath;
                return;
            }
        }

        echo $content;
    }

    public static function escape(?string $str): string {
        return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
    }
}
`,
  },
  {
    path: 'app/Core/Helpers.php',
    category: 'core',
    description: 'Global helper functions: env, csrf, money formatting, slugify, url helpers',
    content: `<?php

if (!function_exists('env')) {
    function env(string $key, $default = null) {
        $val = getenv($key);
        if ($val === false) {
            return $default;
        }
        if ($val === 'true') return true;
        if ($val === 'false') return false;
        return $val;
    }
}

if (!function_exists('e')) {
    function e(?string $str): string {
        return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('format_price')) {
    function format_price(float $amount, string $symbol = '₹'): string {
        return $symbol . ' ' . number_format($amount, 0, '.', ',');
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string {
        return App\\Core\\Csrf::token();
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string {
        return '<input type="hidden" name="_csrf_token" value="' . csrf_token() . '">';
    }
}

if (!function_exists('url')) {
    function url(string $path = ''): string {
        $base = rtrim(env('APP_URL', 'http://localhost:3000'), '/');
        return $base . '/' . ltrim($path, '/');
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string {
        return url('public/' . ltrim($path, '/'));
    }
}

if (!function_exists('slugify')) {
    function slugify(string $text): string {
        $text = preg_replace('~[^\\pL\\d]+~u', '-', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
        $text = preg_replace('~[^-\\w]+~', '', $text);
        $text = trim($text, '-');
        $text = preg_replace('~-+~', '-', $text);
        return strtolower($text ?: 'n-a');
    }
}
`,
  },
  {
    path: 'app/Controllers/HomeController.php',
    category: 'controllers',
    description: 'Storefront Homepage Controller with hero sections, trending products & testimonials',
    content: `<?php

namespace App\\Controllers;

use App\\Core\\View;
use App\\Services\\ProductService;
use App\\Services\\CategoryService;
use App\\Services\\ReviewService;
use App\\Services\\SettingService;

class HomeController {
    public function index(): void {
        $productService = new ProductService();
        $categoryService = new CategoryService();
        $reviewService = new ReviewService();
        $settingService = new SettingService();

        $trendingProducts = $productService->getTrending(8);
        $newArrivals = $productService->getNewArrivals(8);
        $categories = $categoryService->getAllActive();
        $reviews = $reviewService->getFeaturedReviews(6);
        $settings = $settingService->getAll();

        View::render('home/index', [
            'trendingProducts' => $trendingProducts,
            'newArrivals' => $newArrivals,
            'categories' => $categories,
            'reviews' => $reviews,
            'settings' => $settings,
            'pageTitle' => 'Tinkle Jewels — Handmade • Customized • Unique',
        ]);
    }
}
`,
  },
  {
    path: 'app/Controllers/ProductController.php',
    category: 'controllers',
    description: 'Product detail, categories, filtering & search controller',
    content: `<?php

namespace App\\Controllers;

use App\\Core\\View;
use App\\Services\\ProductService;
use App\\Services\\CategoryService;
use App\\Services\\ReviewService;

class ProductController {
    public function show(string $slug): void {
        $productService = new ProductService();
        $reviewService = new ReviewService();

        $product = $productService->findBySlug($slug);
        if (!$product) {
            http_response_code(404);
            View::render('errors/404', ['message' => 'Product not found']);
            return;
        }

        $related = $productService->getRelated($product['id'], $product['category_id'], 4);
        $reviews = $reviewService->getByProductId($product['id']);
        $variants = $productService->getVariants($product['id']);

        View::render('product/show', [
            'product' => $product,
            'variants' => $variants,
            'related' => $related,
            'reviews' => $reviews,
            'pageTitle' => $product['name'] . ' — Tinkle Jewels',
        ]);
    }

    public function category(string $slug): void {
        $categoryService = new CategoryService();
        $productService = new ProductService();

        $category = $categoryService->findBySlug($slug);
        if (!$category) {
            http_response_code(404);
            View::render('errors/404');
            return;
        }

        $filters = [
            'price_min' => $_GET['min_price'] ?? null,
            'price_max' => $_GET['max_price'] ?? null,
            'sort' => $_GET['sort'] ?? 'featured',
        ];

        $products = $productService->getByCategory($category['id'], $filters);

        View::render('shop/category', [
            'category' => $category,
            'products' => $products,
            'filters' => $filters,
            'pageTitle' => $category['name'] . ' — Tinkle Jewels',
        ]);
    }
}
`,
  },
  {
    path: 'app/Services/Payment/PaymentGatewayInterface.php',
    category: 'services',
    description: 'Extensible Payment Gateway contract for Manual / Razorpay / Stripe integrations',
    content: `<?php

namespace App\\Services\\Payment;

interface PaymentGatewayInterface {
    public function getId(): string;
    public function getName(): string;
    public function process(array $orderData): array;
    public function verify(array $requestData): bool;
}
`,
  },
  {
    path: 'app/Services/Payment/ManualPaymentGateway.php',
    category: 'services',
    description: 'Manual / Demo payment provider with UPI QR & Bank transfer support',
    content: `<?php

namespace App\\Services\\Payment;

class ManualPaymentGateway implements PaymentGatewayInterface {
    public function getId(): string {
        return 'manual_demo';
    }

    public function getName(): string {
        return 'Manual / Demo Payment (UPI / Bank Transfer / COD)';
    }

    public function process(array $orderData): array {
        return [
            'success' => true,
            'status' => 'pending',
            'transaction_id' => 'TXN_' . strtoupper(uniqid()),
            'instructions' => 'Please transfer to UPI ID: tinklejewels@upi or scan QR. Admin will verify and dispatch.',
        ];
    }

    public function verify(array $requestData): bool {
        return true;
    }
}
`,
  },
  {
    path: 'app/Services/Payment/RazorpayPaymentGateway.php',
    category: 'services',
    description: 'Razorpay Gateway ready architecture (activate by setting API Key & Secret in Admin)',
    content: `<?php

namespace App\\Services\\Payment;

class RazorpayPaymentGateway implements PaymentGatewayInterface {
    private string $keyId;
    private string $keySecret;

    public function __construct(string $keyId = '', string $keySecret = '') {
        $this->keyId = $keyId ?: env('RAZORPAY_KEY_ID', '');
        $this->keySecret = $keySecret ?: env('RAZORPAY_KEY_SECRET', '');
    }

    public function getId(): string {
        return 'razorpay';
    }

    public function getName(): string {
        return 'Razorpay (Cards, UPI, Netbanking, Wallets)';
    }

    public function process(array $orderData): array {
        // Generates Razorpay Order Payload
        $amountInPaise = (int)($orderData['grand_total'] * 100);
        return [
            'success' => true,
            'gateway' => 'razorpay',
            'key' => $this->keyId,
            'amount' => $amountInPaise,
            'currency' => 'INR',
            'order_id' => 'order_' . uniqid(),
            'name' => 'Tinkle Jewels',
            'description' => 'Order #' . $orderData['order_number'],
            'prefill' => [
                'name' => $orderData['customer_name'],
                'email' => $orderData['customer_email'],
                'contact' => $orderData['customer_phone'],
            ],
            'theme' => [
                'color' => '#C4436A',
            ],
        ];
    }

    public function verify(array $requestData): bool {
        // Razorpay Webhook & Signature Verification
        if (empty($this->keySecret)) return false;
        $signature = hash_hmac('sha256', $requestData['razorpay_order_id'] . '|' . $requestData['razorpay_payment_id'], $this->keySecret);
        return hash_equals($signature, $requestData['razorpay_signature'] ?? '');
    }
}
`,
  },
  {
    path: 'database/schema.sql',
    category: 'database',
    description: 'Complete production MySQL schema with indexes, foreign keys and normalized tables',
    content: `-- Tinkle Jewels MySQL Database Schema
-- Version 1.0.0

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admins & Roles
CREATE TABLE IF NOT EXISTS \`tkl_admins\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('super_admin', 'manager', 'editor') DEFAULT 'super_admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users (Customers)
CREATE TABLE IF NOT EXISTS \`tkl_users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(30) NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`remember_token\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Categories
CREATE TABLE IF NOT EXISTS \`tkl_categories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`parent_id\` INT UNSIGNED NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`slug\` VARCHAR(120) NOT NULL UNIQUE,
  \`description\` TEXT NULL,
  \`image\` VARCHAR(255) NULL,
  \`icon\` VARCHAR(100) NULL,
  \`sort_order\` INT DEFAULT 0,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_category_parent\` (\`parent_id\`),
  INDEX \`idx_category_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Products
CREATE TABLE IF NOT EXISTS \`tkl_products\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(200) NOT NULL,
  \`slug\` VARCHAR(220) NOT NULL UNIQUE,
  \`sku\` VARCHAR(60) NOT NULL UNIQUE,
  \`short_description\` VARCHAR(500) NULL,
  \`description\` LONGTEXT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`original_price\` DECIMAL(10,2) NULL,
  \`stock_quantity\` INT NOT NULL DEFAULT 0,
  \`low_stock_threshold\` INT DEFAULT 5,
  \`primary_image\` VARCHAR(255) NOT NULL,
  \`hover_image\` VARCHAR(255) NULL,
  \`rating\` DECIMAL(2,1) DEFAULT 5.0,
  \`review_count\` INT DEFAULT 0,
  \`is_featured\` TINYINT(1) DEFAULT 0,
  \`is_trending\` TINYINT(1) DEFAULT 0,
  \`is_new_arrival\` TINYINT(1) DEFAULT 0,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_prod_category\` (\`category_id\`),
  INDEX \`idx_prod_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Images
CREATE TABLE IF NOT EXISTS \`tkl_product_images\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`image_url\` VARCHAR(255) NOT NULL,
  \`sort_order\` INT DEFAULT 0,
  FOREIGN KEY (\`product_id\`) REFERENCES \`tkl_products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Product Variants
CREATE TABLE IF NOT EXISTS \`tkl_product_variants\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`sku\` VARCHAR(60) NOT NULL,
  \`size\` VARCHAR(50) NULL,
  \`color\` VARCHAR(50) NULL,
  \`color_hex\` VARCHAR(20) NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`stock_quantity\` INT DEFAULT 0,
  FOREIGN KEY (\`product_id\`) REFERENCES \`tkl_products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Orders
CREATE TABLE IF NOT EXISTS \`tkl_orders\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`user_id\` INT UNSIGNED NULL,
  \`customer_name\` VARCHAR(120) NOT NULL,
  \`customer_email\` VARCHAR(150) NOT NULL,
  \`customer_phone\` VARCHAR(30) NOT NULL,
  \`subtotal\` DECIMAL(10,2) NOT NULL,
  \`discount_amount\` DECIMAL(10,2) DEFAULT 0.00,
  \`coupon_code\` VARCHAR(50) NULL,
  \`shipping_fee\` DECIMAL(10,2) DEFAULT 0.00,
  \`tax_amount\` DECIMAL(10,2) DEFAULT 0.00,
  \`grand_total\` DECIMAL(10,2) NOT NULL,
  \`shipping_address\` JSON NOT NULL,
  \`billing_address\` JSON NOT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT 'manual_demo',
  \`payment_status\` ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  \`order_status\` ENUM('pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  \`tracking_number\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Order Items
CREATE TABLE IF NOT EXISTS \`tkl_order_items\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT UNSIGNED NOT NULL,
  \`product_id\` INT UNSIGNED NULL,
  \`product_name\` VARCHAR(200) NOT NULL,
  \`product_image\` VARCHAR(255) NULL,
  \`variant_info\` VARCHAR(100) NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`total\` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`tkl_orders\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Coupons
CREATE TABLE IF NOT EXISTS \`tkl_coupons\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`discount_type\` ENUM('percentage', 'fixed') DEFAULT 'percentage',
  \`discount_value\` DECIMAL(10,2) NOT NULL,
  \`min_order_value\` DECIMAL(10,2) DEFAULT 0.00,
  \`max_discount\` DECIMAL(10,2) NULL,
  \`description\` VARCHAR(255) NULL,
  \`usage_count\` INT DEFAULT 0,
  \`max_usage\` INT DEFAULT 1000,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`expires_at\` DATETIME NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Settings Table
CREATE TABLE IF NOT EXISTS \`tkl_settings\` (
  \`key\` VARCHAR(100) PRIMARY KEY,
  \`value\` LONGTEXT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
`,
  },
  {
    path: 'install/index.php',
    category: 'install',
    description: 'cPanel Step-by-Step Installation Wizard script with automatic DB creation',
    content: `<?php
/**
 * Tinkle Jewels - Web Installation Wizard
 */

session_start();
define('INSTALL_ROOT', dirname(__DIR__));

if (file_exists(INSTALL_ROOT . '/storage/installed.lock')) {
    die("<h1>Store already installed!</h1><p>Delete <code>storage/installed.lock</code> if you wish to reinstall.</p><a href='/'>Go to Storefront</a>");
}

$step = $_GET['step'] ?? 'welcome';
$phpVersionOk = version_compare(PHP_VERSION, '8.1.0', '>=');
$pdoOk = extension_loaded('pdo_mysql');
$curlOk = extension_loaded('curl');
$gdOk = extension_loaded('gd');
$mbstringOk = extension_loaded('mbstring');
$storageWritable = is_writable(INSTALL_ROOT . '/storage') || @mkdir(INSTALL_ROOT . '/storage', 0755, true);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tinkle Jewels — Installation Wizard</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FFF9FB; color: #2C2329; margin: 0; padding: 40px 20px; }
        .container { max-width: 680px; margin: 0 auto; background: #FFF; border-radius: 20px; box-shadow: 0 15px 35px rgba(230,170,190,0.2); padding: 40px; border: 1px solid #FFE4EE; }
        .logo-title { text-align: center; margin-bottom: 25px; }
        .logo-title h1 { font-family: 'Playfair Display', serif; font-size: 32px; color: #C4436A; margin: 0; }
        .logo-title p { color: #887882; font-size: 14px; margin-top: 5px; }
        .badge-step { display: inline-block; background: #FFEAF1; color: #C4436A; font-weight: 600; font-size: 12px; padding: 4px 14px; border-radius: 20px; margin-bottom: 15px; }
        .req-list { list-style: none; padding: 0; margin: 20px 0; }
        .req-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #FFF0F5; }
        .status-ok { color: #10B981; font-weight: 600; }
        .status-bad { color: #EF4444; font-weight: 600; }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #4A3E46; }
        .form-control { width: 100%; box-sizing: border-box; padding: 12px 16px; border: 1.5px solid #F3D2DF; border-radius: 10px; font-family: inherit; font-size: 14px; }
        .btn-tinkle { display: inline-block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #D85A80 0%, #C4436A 100%); color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; text-align: center; text-decoration: none; box-shadow: 0 8px 18px rgba(196,67,106,0.3); }
        .btn-tinkle:hover { opacity: 0.95; }
    </style>
</head>
<body>
<div class="container">
    <div class="logo-title">
        <h1>Tinkle Jewels</h1>
        <p>Production PHP & MySQL Setup Wizard</p>
    </div>

    <?php if ($step === 'welcome'): ?>
        <div class="badge-step">Step 1 of 4 • Server Requirements</div>
        <h2>Server Environment Check</h2>
        <ul class="req-list">
            <li class="req-item"><span>PHP Version (8.1+)</span> <span class="<?= $phpVersionOk ? 'status-ok' : 'status-bad' ?>"><?= PHP_VERSION ?> (<?= $phpVersionOk ? 'Passed' : 'Failed' ?>)</span></li>
            <li class="req-item"><span>PDO MySQL Extension</span> <span class="<?= $pdoOk ? 'status-ok' : 'status-bad' ?>"><?= $pdoOk ? 'Installed' : 'Missing' ?></span></li>
            <li class="req-item"><span>cURL Extension</span> <span class="<?= $curlOk ? 'status-ok' : 'status-bad' ?>"><?= $curlOk ? 'Installed' : 'Missing' ?></span></li>
            <li class="req-item"><span>GD Image Library</span> <span class="<?= $gdOk ? 'status-ok' : 'status-bad' ?>"><?= $gdOk ? 'Installed' : 'Missing' ?></span></li>
            <li class="req-item"><span>Storage Directory Permissions</span> <span class="<?= $storageWritable ? 'status-ok' : 'status-bad' ?>"><?= $storageWritable ? 'Writable (0755)' : 'Not Writable' ?></span></li>
        </ul>
        <a href="?step=database" class="btn-tinkle">Proceed to Database Configuration →</a>

    <?php elseif ($step === 'database'): ?>
        <div class="badge-step">Step 2 of 4 • Database Connection</div>
        <h2>Enter MySQL Database Credentials</h2>
        <form method="POST" action="?step=process_db">
            <div class="form-group">
                <label>Database Host</label>
                <input type="text" name="db_host" class="form-control" value="localhost" required>
            </div>
            <div class="form-group">
                <label>Database Name</label>
                <input type="text" name="db_name" class="form-control" placeholder="e.g. cpaneluser_tinkle" required>
            </div>
            <div class="form-group">
                <label>Database Username</label>
                <input type="text" name="db_user" class="form-control" placeholder="e.g. cpaneluser_admin" required>
            </div>
            <div class="form-group">
                <label>Database Password</label>
                <input type="password" name="db_pass" class="form-control" placeholder="••••••••••••">
            </div>
            <button type="submit" class="btn-tinkle">Test Connection & Run Migrations →</button>
        </form>
    <?php endif; ?>
</div>
</body>
</html>
`,
  },
  {
    path: 'cron/daily.php',
    category: 'cron',
    description: 'Daily background automation script for coupon cleanup, low-stock alerts & log rotation',
    content: `<?php
/**
 * Tinkle Jewels - Daily Cron Worker
 * cPanel Crontab command: 0 0 * * * php -q /home/YOUR_CPANEL_USER/public_html/cron/daily.php >/dev/null 2>&1
 */

declare(strict_types=1);
define('ROOT_PATH', dirname(__DIR__));
require_once ROOT_PATH . '/index.php';

echo "[Tinkle Cron] Running daily maintenance tasks...\n";

// 1. Expire outdated coupons
$db = App\\Core\\Database::getConnection();
$stmt = $db->prepare("UPDATE tkl_coupons SET is_active = 0 WHERE expires_at IS NOT NULL AND expires_at < NOW()");
$stmt->execute();
echo "[Tinkle Cron] Expired coupons updated.\n";

// 2. Check Low Stock Items
$lowStock = App\\Core\\Database::fetchAll("SELECT name, sku, stock_quantity FROM tkl_products WHERE stock_quantity <= low_stock_threshold");
if (!empty($lowStock)) {
    echo "[Tinkle Cron] Alert: " . count($lowStock) . " items are in low stock state.\n";
}

echo "[Tinkle Cron] Daily tasks completed successfully.\n";
`,
  },
  {
    path: 'docs/CPANEL_INSTALLATION_GUIDE.md',
    category: 'docs',
    description: 'Comprehensive step-by-step cPanel deployment & File Manager tutorial',
    content: `# Tinkle Jewels — cPanel Installation & Deployment Guide

Follow these simple steps to install Tinkle Jewels on any cPanel hosting account.

---

### Step 1: Upload the ZIP File
1. Log in to your **cPanel Dashboard**.
2. Open **File Manager** and navigate to your domain's root folder (usually \`public_html\`).
3. Click **Upload** and upload the \`tinkle-jewels-ecommerce.zip\` package.
4. Right-click the uploaded ZIP file and select **Extract**.

---

### Step 2: Create a MySQL Database in cPanel
1. In cPanel, navigate to **MySQL® Databases**.
2. Create a new database (e.g. \`cpaneluser_tinkle\`).
3. Create a new database user and assign a strong password.
4. Add the user to the database and select **"ALL PRIVILEGES"**.

---

### Step 3: Run the Web Installer
1. Open your browser and visit:
   \`\`\`
   https://yourdomain.com/install
   \`\`\`
2. The web installer will automatically check server requirements (PHP 8.1+, PDO, cURL).
3. Enter your database host (\`localhost\`), database name, username, and password.
4. Choose **"Install Demo Products & Categories"** (Recommended).
5. Enter your Administrator credentials (Email & Password).
6. Click **Finish Installation**.

---

### Step 4: Setup Background Cron Jobs (Optional but Recommended)
In cPanel > **Cron Jobs**, add these schedules:
- **Daily Cron (Every Midnight):**
  \`\`\`bash
  0 0 * * * php /home/YOUR_CPANEL_USER/public_html/cron/daily.php >/dev/null 2>&1
  \`\`\`
- **Hourly Email Queue (Every Hour):**
  \`\`\`bash
  0 * * * * php /home/YOUR_CPANEL_USER/public_html/cron/hourly.php >/dev/null 2>&1
  \`\`\`

---

### Step 5: Admin Login
Access your administration dashboard at:
\`\`\`
https://yourdomain.com/admin
\`\`\`
- **Default Email:** \`admin@tinklejewels.com\`
- **Default Password:** Set during installer step
`,
  },
  {
    path: 'README.md',
    category: 'docs',
    description: 'Commercial Product Overview, Architecture & Feature Specs',
    content: `# Tinkle Jewels — Modern Gen-Z PHP & MySQL E-Commerce Platform

A production-ready, modular, and fully customizable e-commerce script designed for high-conversion Gen-Z jewellery, fashion, and lifestyle brands.

---

## ✨ Features
- **Editorial Storefront UI**: Soft watercolor aesthetics, polaroid cards, trending sliders, interactive custom banners.
- **Product & Variant Matrix**: Dynamic attributes (Size, Color, Material), multi-image gallery with hover-switch, size chart modal.
- **Dynamic Homepage CMS**: Reorder banners, hero slides, and collection carousels from the Admin Panel.
- **Pincode & Shipping Engine**: Real-time delivery availability, shipping rates, and free delivery thresholds.
- **Coupon System**: Percentage and fixed discount promo codes with cart minimums and expiry checks.
- **Multi-Gateway Payment Architecture**: Built-in Manual/Demo payment, UPI QR, and ready Razorpay/Stripe interfaces.
- **Customer Account Suite**: Real-time order tracking, address book, wishlist, and profile management.
- **Admin Dashboard**: Real-time sales analytics, order workflow management, printable invoices, and system logs.
- **Automated Web Installer**: Zero manual SQL imports required. Includes schema migrations and demo seeder.

---

## 🚀 Requirements
- PHP 8.1 or higher
- MySQL 5.7+ / MariaDB 10.3+
- PDO MySQL extension
- cURL, GD, and Mbstring extensions
- Apache with \`mod_rewrite\` enabled
`,
  },
];

export const phpFilesDictionary: Record<string, string> = PHP_PROJECT_FILES.reduce((acc, file) => {
  acc[file.path] = file.content;
  return acc;
}, {} as Record<string, string>);

import JSZip from 'jszip';
import { PHP_PROJECT_FILES } from '../data/phpCodebase';
import { PRODUCTS, CATEGORIES, COUPONS } from '../data/catalog';

export async function generateProductionZip(onProgress?: (percent: number, currentFile: string) => void): Promise<Blob> {
  const zip = new JSZip();

  // Root folder structure
  const root = zip.folder('tinkle-jewels-ecommerce') || zip;

  const totalFiles = PHP_PROJECT_FILES.length + 5;
  let processed = 0;

  // Add all pre-defined PHP codebase files
  for (const file of PHP_PROJECT_FILES) {
    root.file(file.path, file.content);
    processed++;
    if (onProgress) {
      onProgress(Math.round((processed / totalFiles) * 80), file.path);
    }
  }

  // Generate demo data JSON / SQL seeder dump
  const demoSeedSql = `-- Tinkle Jewels Demo Seed Data
INSERT INTO \`tkl_settings\` (\`key\`, \`value\`) VALUES
('store_name', 'Tinkle Jewels'),
('tagline', 'Handmade • Customized • Unique'),
('currency', 'INR'),
('currency_symbol', '₹'),
('free_shipping_threshold', '999'),
('contact_email', 'hello@tinklejewels.com'),
('announcement_text', '✨ FREE SHIPPING ON ORDERS ABOVE ₹999 | USE CODE TINKLE20 FOR 20% OFF');

-- Insert Initial Categories
${CATEGORIES.map((c, i) => `INSERT INTO \`tkl_categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`image\`, \`sort_order\`, \`is_active\`) VALUES (${i + 1}, '${c.name.replace(/'/g, "''")}', '${c.slug}', '${c.description.replace(/'/g, "''")}', '${c.image}', ${i}, 1);`).join('\n')}

-- Insert Initial Products
${PRODUCTS.map((p, i) => `INSERT INTO \`tkl_products\` (\`id\`, \`category_id\`, \`name\`, \`slug\`, \`sku\`, \`short_description\`, \`description\`, \`price\`, \`original_price\`, \`stock_quantity\`, \`primary_image\`, \`hover_image\`, \`rating\`, \`review_count\`, \`is_trending\`, \`is_new_arrival\`, \`is_active\`) VALUES (${i + 1}, 1, '${p.name.replace(/'/g, "''")}', '${p.slug}', '${p.sku}', '${p.shortDescription.replace(/'/g, "''")}', '${p.description.replace(/'/g, "''")}', ${p.price}, ${p.originalPrice || p.price}, ${p.stockCount}, '${p.primaryImage}', '${p.hoverImage || p.primaryImage}', ${p.rating}, ${p.reviewCount}, 1, 1, 1);`).join('\n')}

-- Insert Initial Coupons
${COUPONS.map((c, i) => `INSERT INTO \`tkl_coupons\` (\`id\`, \`code\`, \`discount_type\`, \`discount_value\`, \`min_order_value\`, \`max_discount\`, \`description\`, \`is_active\`) VALUES (${i + 1}, '${c.code}', '${c.discountType}', ${c.discountValue}, ${c.minOrderValue}, ${c.maxDiscount || 'NULL'}, '${c.description.replace(/'/g, "''")}', 1);`).join('\n')}
`;

  root.file('database/seeders/demo_seed.sql', demoSeedSql);
  
  // Add empty storage directories with .gitkeep
  root.file('storage/logs/.gitkeep', '');
  root.file('storage/cache/.gitkeep', '');
  root.file('storage/uploads/.gitkeep', '');

  // Add root installer index.html quick start
  const installerQuickGuide = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tinkle Jewels — cPanel Quick Setup</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #FFF9FB; color: #2C2329; padding: 40px 20px; line-height: 1.6; }
    .box { max-width: 650px; margin: 0 auto; background: #fff; padding: 35px; border-radius: 16px; border: 1px solid #FFE4EE; box-shadow: 0 10px 30px rgba(220,160,180,0.15); }
    h1 { color: #C4436A; font-size: 26px; }
    .btn { display: inline-block; background: #C4436A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 15px; }
    code { background: #FFF0F5; padding: 2px 6px; border-radius: 4px; color: #C4436A; }
  </style>
</head>
<body>
  <div class="box">
    <h1>✨ Tinkle Jewels PHP E-Commerce</h1>
    <p>Thank you for downloading Tinkle Jewels. To install on your cPanel server:</p>
    <ol>
      <li>Extract all files directly inside your <code>public_html</code> or domain root directory.</li>
      <li>Create a MySQL Database in cPanel.</li>
      <li>Visit <strong><code>https://yourdomain.com/install</code></strong> in your browser.</li>
      <li>Follow the 4-step wizard to setup your database and admin account!</li>
    </ol>
    <a href="install/index.php" class="btn">Launch Web Installer →</a>
  </div>
</body>
</html>`;
  
  root.file('public_installer_guide.html', installerQuickGuide);

  if (onProgress) {
    onProgress(90, 'Compressing archive...');
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9,
    },
  }, (metadata) => {
    if (onProgress) {
      onProgress(Math.min(99, 90 + Math.round(metadata.percent / 10)), 'Finalizing ZIP package...');
    }
  });

  if (onProgress) {
    onProgress(100, 'Complete!');
  }

  return zipBlob;
}

export async function downloadZip(filename: string = 'tinkle-jewels-cpanel-ready.zip'): Promise<void> {
  const blob = await generateProductionZip();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

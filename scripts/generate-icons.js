#!/usr/bin/env node

/**
 * Generate PNG icons from SVG template
 * Creates PWA icons (192x192, 512x512) and Apple touch icon (180x180)
 * Following October 2025 best practices for maskable icons
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Read the SVG template
const svgTemplate = readFileSync(join(publicDir, 'icon-template.svg'), 'utf8');

// Icon sizes to generate
const iconSizes = [
  { size: 192, filename: 'icon-192.png' },
  { size: 512, filename: 'icon-512.png' },
  { size: 180, filename: 'apple-touch-icon.png' }, // iOS home screen icon
];

console.log('🎨 Generating PWA icons from SVG template...\n');

// Generate each icon size
async function generateIcons() {
  for (const { size, filename } of iconSizes) {
    try {
      await sharp(Buffer.from(svgTemplate))
        .resize(size, size, {
          fit: 'contain',
          background: { r: 10, g: 14, b: 10, alpha: 1 }, // #0a0e0a
        })
        .png({
          compressionLevel: 9,
          quality: 100,
        })
        .toFile(join(publicDir, filename));

      console.log(`✅ Generated ${filename} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${filename}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n🚀 All icons generated successfully!');
  console.log('\n📋 Generated files:');
  iconSizes.forEach(({ filename, size }) => {
    console.log(`   - public/${filename} (${size}x${size})`);
  });
  console.log('   - public/favicon.svg (scalable)');
}

generateIcons().catch((error) => {
  console.error('❌ Error generating icons:', error);
  process.exit(1);
});

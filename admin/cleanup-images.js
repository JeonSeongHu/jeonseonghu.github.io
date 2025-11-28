/**
 * Cleanup unused images in assets/images/posts/
 * Scans all markdown files in _posts/ and removes images not referenced
 * 
 * Run with: node admin/cleanup-images.js
 * Dry run:  node admin/cleanup-images.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', '_posts');
const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images', 'posts');

const isDryRun = process.argv.includes('--dry-run');

console.log('🧹 Image Cleanup Script');
console.log('========================');
if (isDryRun) {
  console.log('⚠️  DRY RUN MODE - no files will be deleted\n');
}

// Step 1: Collect all image references from markdown files
function getAllImageReferences() {
  const references = new Set();
  
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('❌ Posts directory not found:', POSTS_DIR);
    return references;
  }
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filepath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    
    // Match markdown image syntax: ![alt](path)
    const mdImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdImageRegex.exec(content)) !== null) {
      const imagePath = match[2];
      // Extract filename from path
      const filename = path.basename(imagePath);
      references.add(filename);
    }
    
    // Match HTML img tags: <img src="path">
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/g;
    while ((match = htmlImageRegex.exec(content)) !== null) {
      const imagePath = match[1];
      const filename = path.basename(imagePath);
      references.add(filename);
    }
    
    // Match frontmatter image field
    const frontmatterImageRegex = /^image:\s*(.+)$/m;
    match = frontmatterImageRegex.exec(content);
    if (match) {
      const imagePath = match[1].trim().replace(/["']/g, '');
      const filename = path.basename(imagePath);
      references.add(filename);
    }
  }
  
  return references;
}

// Step 2: Get all images in the uploads folder
function getAllUploadedImages() {
  const images = [];
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ Images directory not found:', IMAGES_DIR);
    return images;
  }
  
  const files = fs.readdirSync(IMAGES_DIR);
  
  for (const file of files) {
    const filepath = path.join(IMAGES_DIR, file);
    const stat = fs.statSync(filepath);
    
    if (stat.isFile() && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)) {
      images.push({
        filename: file,
        filepath: filepath,
        size: stat.size,
        mtime: stat.mtime
      });
    }
  }
  
  return images;
}

// Step 3: Find and delete unused images
function cleanupUnusedImages() {
  const references = getAllImageReferences();
  const uploadedImages = getAllUploadedImages();
  
  console.log(`📄 Found ${references.size} image references in posts`);
  console.log(`📁 Found ${uploadedImages.length} images in uploads folder\n`);
  
  const unused = [];
  const used = [];
  
  for (const image of uploadedImages) {
    if (references.has(image.filename)) {
      used.push(image);
    } else {
      unused.push(image);
    }
  }
  
  if (unused.length === 0) {
    console.log('✅ No unused images found. All clean!');
    return;
  }
  
  console.log(`🗑️  Found ${unused.length} unused images:\n`);
  
  let totalSize = 0;
  for (const image of unused) {
    const sizeKB = (image.size / 1024).toFixed(1);
    totalSize += image.size;
    console.log(`   - ${image.filename} (${sizeKB} KB)`);
    
    if (!isDryRun) {
      try {
        fs.unlinkSync(image.filepath);
      } catch (err) {
        console.log(`     ❌ Failed to delete: ${err.message}`);
      }
    }
  }
  
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log('');
  
  if (isDryRun) {
    console.log(`📊 Would free up ${totalSizeMB} MB`);
    console.log('\n💡 Run without --dry-run to actually delete files');
  } else {
    console.log(`✅ Deleted ${unused.length} files, freed ${totalSizeMB} MB`);
  }
}

// Run
cleanupUnusedImages();


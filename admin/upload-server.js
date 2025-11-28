/**
 * Simple image upload server for Decap CMS clipboard paste
 * Also handles cleanup of unused images
 * Run with: node admin/upload-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const UPLOAD_DIR = path.join(__dirname, '..', 'assets', 'images', 'posts');
const POSTS_DIR = path.join(__dirname, '..', '_posts');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Track recently uploaded images (within last 1 hour, don't delete)
const recentUploads = new Map();
const RECENT_THRESHOLD = 60 * 60 * 1000; // 1 hour

// Cleanup unused images
function cleanupUnusedImages() {
  try {
    // Collect all image references from posts
    const references = new Set();
    
    if (fs.existsSync(POSTS_DIR)) {
      const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        
        // Match markdown images
        const mdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
        let match;
        while ((match = mdRegex.exec(content)) !== null) {
          references.add(path.basename(match[1]));
        }
        
        // Match HTML images
        const htmlRegex = /<img[^>]+src=["']([^"']+)["']/g;
        while ((match = htmlRegex.exec(content)) !== null) {
          references.add(path.basename(match[1]));
        }
        
        // Match frontmatter image
        const fmMatch = content.match(/^image:\s*(.+)$/m);
        if (fmMatch) {
          references.add(path.basename(fmMatch[1].trim().replace(/["']/g, '')));
        }
      }
    }
    
    // Check uploaded images
    if (!fs.existsSync(UPLOAD_DIR)) return { deleted: 0, freed: 0 };
    
    const images = fs.readdirSync(UPLOAD_DIR).filter(f => 
      /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f)
    );
    
    let deleted = 0;
    let freed = 0;
    const now = Date.now();
    
    for (const img of images) {
      // Skip if referenced
      if (references.has(img)) continue;
      
      // Skip if recently uploaded (within 5 minutes)
      const uploadTime = recentUploads.get(img);
      if (uploadTime && (now - uploadTime) < RECENT_THRESHOLD) continue;
      
      // Delete unused image
      const filepath = path.join(UPLOAD_DIR, img);
      try {
        const stat = fs.statSync(filepath);
        freed += stat.size;
        fs.unlinkSync(filepath);
        deleted++;
        console.log(`🗑️  Deleted unused: ${img}`);
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Clean up old entries from recentUploads
    for (const [img, time] of recentUploads.entries()) {
      if (now - time > RECENT_THRESHOLD) {
        recentUploads.delete(img);
      }
    }
    
    return { deleted, freed };
  } catch (err) {
    console.error('Cleanup error:', err);
    return { deleted: 0, freed: 0 };
  }
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Cleanup endpoint - triggered after save
  if (req.method === 'POST' && req.url === '/cleanup') {
    const result = cleanupUnusedImages();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      deleted: result.deleted,
      freedBytes: result.freed
    }));
    return;
  }
  
  // Get cleanup status
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      uploadDir: UPLOAD_DIR,
      recentUploads: recentUploads.size
    }));
    return;
  }
  
  if (req.method === 'POST' && req.url === '/upload') {
    let body = [];
    
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(body);
        
        // Parse multipart form data (simple implementation)
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('application/octet-stream')) {
          // Direct binary upload
          const filename = req.headers['x-filename'] || `image-${Date.now()}.png`;
          const filepath = path.join(UPLOAD_DIR, filename);
          
          fs.writeFileSync(filepath, buffer);
          recentUploads.set(filename, Date.now());
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            path: `/assets/images/posts/${filename}`,
            filename: filename
          }));
        } else if (contentType.includes('multipart/form-data')) {
          // Parse multipart
          const boundary = contentType.split('boundary=')[1];
          if (!boundary) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'No boundary' }));
            return;
          }
          
          const parts = buffer.toString('binary').split('--' + boundary);
          
          for (const part of parts) {
            if (part.includes('Content-Disposition') && part.includes('filename=')) {
              const filenameMatch = part.match(/filename="([^"]+)"/);
              const filename = filenameMatch ? filenameMatch[1] : `image-${Date.now()}.png`;
              
              // Find the start of binary data (after double CRLF)
              const headerEnd = part.indexOf('\r\n\r\n');
              if (headerEnd === -1) continue;
              
              let fileData = part.substring(headerEnd + 4);
              // Remove trailing boundary markers
              if (fileData.endsWith('\r\n')) {
                fileData = fileData.slice(0, -2);
              }
              if (fileData.endsWith('--')) {
                fileData = fileData.slice(0, -2);
              }
              if (fileData.endsWith('\r\n')) {
                fileData = fileData.slice(0, -2);
              }
              
              const filepath = path.join(UPLOAD_DIR, filename);
              fs.writeFileSync(filepath, fileData, 'binary');
              recentUploads.set(filename, Date.now());
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: true,
                path: `/assets/images/posts/${filename}`,
                filename: filename
              }));
              return;
            }
          }
          
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'No file found in request' }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Unsupported content type' }));
        }
      } catch (err) {
        console.error('Upload error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`📁 Image upload server running at http://localhost:${PORT}`);
  console.log(`   Upload endpoint: POST http://localhost:${PORT}/upload`);
  console.log(`   Files saved to: ${UPLOAD_DIR}`);
});


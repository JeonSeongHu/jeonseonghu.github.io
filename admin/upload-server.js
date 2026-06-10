/**
 * Local image upload server for Decap CMS clipboard paste.
 *
 * Run with:
 *   node admin/upload-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.CMS_UPLOAD_PORT || 3001);
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const UPLOAD_DIR = path.join(__dirname, '..', 'assets', 'images', 'posts');
const POSTS_DIR = path.join(__dirname, '..', '_posts');
const RECENT_THRESHOLD = 60 * 60 * 1000;
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const recentUploads = new Map();

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename');
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function sanitizeFilename(filename) {
  const fallback = `image-${Date.now()}.png`;
  const parsed = path.parse(path.basename(filename || fallback));
  const ext = IMAGE_EXTENSIONS.has(parsed.ext.toLowerCase()) ? parsed.ext.toLowerCase() : '.png';
  const base = parsed.name
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `image-${Date.now()}`;

  return `${base}${ext}`;
}

function collectPostImageReferences() {
  const references = new Set();
  if (!fs.existsSync(POSTS_DIR)) return references;

  const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');

    const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    let match;
    while ((match = markdownImageRegex.exec(content)) !== null) {
      references.add(path.basename(match[1]));
    }

    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/g;
    while ((match = htmlImageRegex.exec(content)) !== null) {
      references.add(path.basename(match[1]));
    }

    const frontmatterImageMatch = content.match(/^image:\s*(.+)$/m);
    if (frontmatterImageMatch) {
      references.add(path.basename(frontmatterImageMatch[1].trim().replace(/["']/g, '')));
    }
  }

  return references;
}

function cleanupUnusedImages() {
  try {
    const references = collectPostImageReferences();
    if (!fs.existsSync(UPLOAD_DIR)) return { deleted: 0, freed: 0 };

    const images = fs.readdirSync(UPLOAD_DIR).filter((file) =>
      IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())
    );

    let deleted = 0;
    let freed = 0;
    const now = Date.now();

    for (const image of images) {
      if (references.has(image)) continue;

      const uploadTime = recentUploads.get(image);
      if (uploadTime && now - uploadTime < RECENT_THRESHOLD) continue;

      const filepath = path.join(UPLOAD_DIR, image);
      try {
        const stat = fs.statSync(filepath);
        fs.unlinkSync(filepath);
        freed += stat.size;
        deleted += 1;
        console.log(`Deleted unused image: ${image}`);
      } catch (error) {
        console.warn(`Could not delete unused image: ${image}`);
      }
    }

    for (const [image, time] of recentUploads.entries()) {
      if (now - time > RECENT_THRESHOLD) {
        recentUploads.delete(image);
      }
    }

    return { deleted, freed };
  } catch (error) {
    console.error('Cleanup error:', error);
    return { deleted: 0, freed: 0 };
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_UPLOAD_BYTES) {
        reject(new Error('Upload is too large'));
        req.destroy();
        return;
      }

      chunks.push(chunk);
    });

    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function extractMultipartFile(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  const boundary = boundaryMatch && (boundaryMatch[1] || boundaryMatch[2]);
  if (!boundary) throw new Error('No multipart boundary found');

  const parts = buffer.toString('binary').split(`--${boundary}`);

  for (const part of parts) {
    if (!part.includes('Content-Disposition') || !part.includes('filename=')) continue;

    const filenameMatch = part.match(/filename="([^"]+)"/);
    const filename = sanitizeFilename(filenameMatch ? filenameMatch[1] : null);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;

    let fileData = part.substring(headerEnd + 4);
    if (fileData.endsWith('\r\n')) fileData = fileData.slice(0, -2);
    if (fileData.endsWith('--')) fileData = fileData.slice(0, -2);
    if (fileData.endsWith('\r\n')) fileData = fileData.slice(0, -2);

    return { filename, data: fileData, encoding: 'binary' };
  }

  throw new Error('No file found in multipart request');
}

async function handleUpload(req, res) {
  const contentType = req.headers['content-type'] || '';
  const body = await readRequestBody(req);

  let filename;
  let data;
  let encoding;

  if (contentType.includes('application/octet-stream')) {
    filename = sanitizeFilename(req.headers['x-filename']);
    data = body;
  } else if (contentType.includes('multipart/form-data')) {
    const file = extractMultipartFile(body, contentType);
    filename = file.filename;
    data = file.data;
    encoding = file.encoding;
  } else {
    sendJson(res, 400, { success: false, error: 'Unsupported content type' });
    return;
  }

  const filepath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filepath, data, encoding);
  recentUploads.set(filename, Date.now());

  sendJson(res, 200, {
    success: true,
    path: `/assets/images/posts/${filename}`,
    filename
  });
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/status') {
    sendJson(res, 200, {
      ok: true,
      uploadDir: UPLOAD_DIR,
      recentUploads: recentUploads.size,
      maxUploadBytes: MAX_UPLOAD_BYTES
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/cleanup') {
    const result = cleanupUnusedImages();
    sendJson(res, 200, {
      success: true,
      deleted: result.deleted,
      freedBytes: result.freed
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/upload') {
    try {
      await handleUpload(req, res);
    } catch (error) {
      console.error('Upload error:', error);
      sendJson(res, 500, { success: false, error: error.message });
    }
    return;
  }

  sendJson(res, 404, { success: false, error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Image upload server running at http://localhost:${PORT}`);
  console.log(`Upload endpoint: POST http://localhost:${PORT}/upload`);
  console.log(`Status endpoint: GET http://localhost:${PORT}/status`);
  console.log(`Files saved to: ${UPLOAD_DIR}`);
});

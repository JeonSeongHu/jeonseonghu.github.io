#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

DECAP_PID=""
UPLOAD_PID=""

cleanup() {
  if [ -n "${DECAP_PID:-}" ]; then
    kill "$DECAP_PID" 2>/dev/null || true
  fi

  if [ -n "${UPLOAD_PID:-}" ]; then
    kill "$UPLOAD_PID" 2>/dev/null || true
  fi
}

if command -v bundle >/dev/null 2>&1; then
  bundle install

  if command -v npx >/dev/null 2>&1; then
    echo "Starting Decap CMS proxy server..."
    npx decap-server &
    DECAP_PID=$!
  else
    echo "Warning: npx not found; Decap local editing proxy will not start." >&2
  fi

  if command -v node >/dev/null 2>&1; then
    echo "Starting image upload server..."
    node admin/upload-server.js &
    UPLOAD_PID=$!
  else
    echo "Warning: node not found; clipboard image paste upload will not start." >&2
  fi

  trap cleanup EXIT

  exec bundle exec jekyll serve --host 0.0.0.0 --livereload --port 4000
fi

if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    exec docker compose up
  elif command -v docker-compose >/dev/null 2>&1; then
    exec docker-compose up
  fi
fi

echo "bundle or docker compose is required." >&2
echo "- Local setup: gem install bundler && bundle install" >&2
echo "- Docker setup: docker compose up" >&2
exit 1

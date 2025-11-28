#!/usr/bin/env bash
set -e

if command -v bundle >/dev/null 2>&1; then
  bundle install
  
  # Start Decap CMS proxy server in background for local file editing
  if command -v npx >/dev/null 2>&1; then
    echo "Starting Decap CMS proxy server..."
    npx decap-server &
    DECAP_PID=$!
  fi
  
  # Start image upload server for clipboard paste
  if command -v node >/dev/null 2>&1; then
    echo "Starting image upload server..."
    node admin/upload-server.js &
    UPLOAD_PID=$!
  fi
  
  # Clean up background processes when script exits
  trap "kill $DECAP_PID $UPLOAD_PID 2>/dev/null" EXIT
  
  exec bundle exec jekyll serve --host 0.0.0.0 --livereload --port 4000
fi

if command -v docker >/dev/null 2>&1; then
  if command -v docker compose >/dev/null 2>&1; then
    exec docker compose up
  elif command -v docker-compose >/dev/null 2>&1; then
    exec docker-compose up
  fi
fi

echo "bundle 또는 docker compose가 필요합니다.\n- 로컬 실행: gem install bundler && bundle install\n- Docker 실행: docker compose up" >&2
exit 1
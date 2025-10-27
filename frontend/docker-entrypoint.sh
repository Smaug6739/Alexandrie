#!/bin/sh
echo "Building application with current environment variables..."
echo "API: $VITE_BASE_API"
echo "CDN: $VITE_BASE_CDN"
echo "URL: $NUXT_PUBLIC_BASE_URL"
echo "Starting Nitro server..."
exec node .output/server/index.mjs
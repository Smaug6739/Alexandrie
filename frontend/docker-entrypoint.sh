#!/bin/sh
echo "Building application with current environment variables..."
echo "API: $NUXT_PUBLIC_BASE_API"
echo "CDN: $NUXT_PUBLIC_BASE_CDN"
echo "URL: $NUXT_PUBLIC_BASE_URL"
echo "Starting Nitro server..."
exec node .output/server/index.mjs
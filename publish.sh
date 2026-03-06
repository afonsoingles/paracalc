#!/bin/bash

# ParaCalc Docker Publish Script

set -e

echo "🐳 ParaCalc - Docker Publisher"
echo ""

# Get GitHub username
read -p "GitHub Username: " GITHUB_USER

# Get GitHub token
read -sp "GitHub Personal Access Token (create at https://github.com/settings/tokens/new with write:packages scope): " GITHUB_TOKEN
echo ""

REGISTRY="ghcr.io"
IMAGE_NAME="$REGISTRY/$GITHUB_USER/paracalc"
IMAGE_TAG="${1:-latest}"

echo ""
echo "📦 Image: $IMAGE_NAME:$IMAGE_TAG"
echo ""

# Login to GHCR
echo "🔐 Logging in to GHCR..."
echo "$GITHUB_TOKEN" | docker login "$REGISTRY" -u "$GITHUB_USER" --password-stdin

# Build
echo ""
echo "🔨 Building Docker image..."
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .
docker tag "$IMAGE_NAME:$IMAGE_TAG" "$IMAGE_NAME:latest"

# Push
echo ""
echo "📤 Pushing to GHCR..."
docker push "$IMAGE_NAME:$IMAGE_TAG"
docker push "$IMAGE_NAME:latest"

echo ""
echo "✅ Done!"
echo ""
echo "Image available at:"
echo "  $IMAGE_NAME:$IMAGE_TAG"
echo "  $IMAGE_NAME:latest"
echo ""
echo "To make it public:"
echo "  1. Go to https://github.com/settings/packages"
echo "  2. Find 'paracalc' package"
echo "  3. Click 'Package settings'"
echo "  4. Change visibility to 'Public'"
echo ""
echo "To run locally:"
echo "  docker run -p 3000:3000 $IMAGE_NAME:latest"

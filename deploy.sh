#!/bin/bash

# Deployment script for dual frontend architecture
set -e

echo "========================================="
echo "Starting deployment of Portfolio + Transcendence"
echo "========================================="
echo ""

# Check we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: docker-compose.yml not found!"
    echo "Please run this script from /home/vlad-plk/Transcandence/"
    exit 1
fi

# Check .env exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    exit 1
fi

echo "Step 1: Stopping old containers..."
docker-compose down

echo ""
echo "Step 2: Removing old frontend container if exists..."
docker rm -f frontend 2>/dev/null || echo "No old frontend container to remove"

echo ""
echo "Step 3: Building new containers..."
docker-compose build --no-cache

echo ""
echo "Step 4: Starting all services..."
docker-compose up -d

echo ""
echo "Step 5: Waiting for containers to be ready..."
sleep 10

echo ""
echo "Step 6: Checking container status..."
docker-compose ps

echo ""
echo "Step 7: Testing nginx configuration..."
docker exec nginx nginx -t

echo ""
echo "Step 8: Checking logs for errors..."
echo "=== Transcendence logs ==="
docker logs transcendence --tail 20
echo ""
echo "=== Portfolio logs ==="
docker logs portfolio --tail 20
echo ""
echo "=== Nginx logs ==="
docker logs nginx --tail 20

echo ""
echo "========================================="
echo "Deployment complete!"
echo "========================================="
echo ""
echo "Your sites should now be available at:"
echo "  - Portfolio: https://vladplk.mysmarttech.fr"
echo "  - Transcendence: https://transcendence.mysmarttech.fr"
echo ""
echo "To check logs:"
echo "  docker logs transcendence -f"
echo "  docker logs portfolio -f"
echo "  docker logs nginx -f"
echo ""
echo "To check status:"
echo "  docker ps"
echo ""

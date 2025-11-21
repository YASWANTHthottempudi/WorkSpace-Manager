#!/bin/bash

# Script to start backend server on correct port
# Run this: bash START_SERVER.sh

cd "$(dirname "$0")/backend"

echo "🔧 Checking backend configuration..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file not found!"
  echo "Creating .env file with default values..."
  echo "PORT=5001" > .env
  echo "CORS_ORIGIN=http://localhost:3000" >> .env
  echo "MONGODB_URI=your_mongodb_uri_here" >> .env
  echo "JWT_SECRET=your_jwt_secret_here" >> .env
  echo "✅ Created .env file"
fi

# Check current PORT setting
CURRENT_PORT=$(grep "^PORT=" .env 2>/dev/null | cut -d'=' -f2 || echo "5000")

if [ "$CURRENT_PORT" != "5001" ]; then
  echo "⚠️  Current PORT is $CURRENT_PORT"
  echo "📝 Updating PORT to 5001..."
  
  # Update PORT in .env
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's/^PORT=.*/PORT=5001/' .env
  else
    # Linux
    sed -i 's/^PORT=.*/PORT=5001/' .env
  fi
  
  echo "✅ Updated PORT to 5001"
  echo ""
  echo "⚠️  You need to restart the backend server for changes to take effect!"
  echo ""
else
  echo "✅ PORT is already set to 5001"
fi

# Check if server is already running
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "⚠️  Server is already running on port 5001"
  echo "Stop it first (Ctrl+C) or kill the process, then run: npm run dev"
else
  echo ""
  echo "🚀 Starting backend server..."
  echo ""
  npm run dev
fi


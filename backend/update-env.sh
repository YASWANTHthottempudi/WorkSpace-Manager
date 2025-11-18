#!/bin/bash

# Script to update MongoDB connection string in .env file
# Usage: ./update-env.sh YOUR_PASSWORD

if [ -z "$1" ]; then
    echo "Error: Password is required"
    echo "Usage: ./update-env.sh YOUR_PASSWORD"
    echo ""
    echo "Example:"
    echo "  ./update-env.sh MySecurePass123"
    echo ""
    echo "For password with special characters, use URL encoding:"
    echo "  ./update-env.sh 'MyP%40ss%23123%21'"
    exit 1
fi

PASSWORD="$1"
ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found"
    echo "Creating .env file from template..."
    cp .env.template .env 2>/dev/null || echo "Please create .env file manually"
    exit 1
fi

# Backup .env file
cp "$ENV_FILE" "${ENV_FILE}.backup"
echo "Backed up .env to ${ENV_FILE}.backup"

# Update MONGODB_URI in .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:${PASSWORD}@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true\&w=majority\&appName=AI-Workspace|" "$ENV_FILE"
else
    # Linux
    sed -i "s|MONGODB_URI=.*|MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:${PASSWORD}@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true\&w=majority\&appName=AI-Workspace|" "$ENV_FILE"
fi

echo "Updated MONGODB_URI in .env file"
echo ""
echo "Connection string (masked):"
echo "mongodb+srv://yaswanththottempudi_db_user:***@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?..."
echo ""
echo "You can now test the connection with: npm run dev"

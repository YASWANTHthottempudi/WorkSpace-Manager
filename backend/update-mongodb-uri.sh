#!/bin/bash

# Helper script to update MongoDB Atlas connection string
# Usage: ./update-mongodb-uri.sh YOUR_PASSWORD

if [ -z "$1" ]; then
    echo "Usage: ./update-mongodb-uri.sh YOUR_PASSWORD"
    echo "Example: ./update-mongodb-uri.sh mypassword123"
    exit 1
fi

PASSWORD="$1"
USERNAME="yaswanththottempudi_db_user"
CLUSTER="ai-workspace.o0vmcuv.mongodb.net"
DATABASE="ai-workspace"

# URL-encode the password (handle common special characters)
ENCODED_PASSWORD=$(echo -n "$PASSWORD" | sed 's/@/%40/g; s/#/%23/g; s/%/%25/g; s/&/%26/g; s/+/%2B/g; s/=/%3D/g; s/?/%3F/g; s/\//%2F/g; s/:/%3A/g')

# Create the connection string
MONGODB_URI="mongodb+srv://${USERNAME}:${ENCODED_PASSWORD}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority&appName=AI-Workspace"

# Update .env file
if [ -f .env ]; then
    # Backup original .env
    cp .env .env.backup
    echo "Backed up .env to .env.backup"
    
    # Update MONGODB_URI in .env
    if grep -q "MONGODB_URI=" .env; then
        # Use different sed syntax for macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=${MONGODB_URI}|" .env
        else
            sed -i "s|MONGODB_URI=.*|MONGODB_URI=${MONGODB_URI}|" .env
        fi
        echo "Updated MONGODB_URI in .env"
        echo "Connection string (masked): mongodb+srv://${USERNAME}:***@${CLUSTER}/${DATABASE}..."
    else
        echo "MONGODB_URI not found in .env, adding it..."
        echo "MONGODB_URI=${MONGODB_URI}" >> .env
    fi
else
    echo "Error: .env file not found"
    exit 1
fi

echo "Done! You can now test the connection with: npm run dev"


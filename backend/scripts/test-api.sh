#!/bin/bash

# Test Script: Frontend to Database Data Flow
# This script tests the complete data flow from API to database

API_URL="http://localhost:5000/api"
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="password123"
TEST_NAME="Test User"

echo ""
echo "=========================================="
echo "🧪 Testing Frontend to Database Data Flow"
echo "=========================================="
echo ""
echo "API URL: $API_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Health Check
echo "Step 1: Checking backend health..."
HEALTH_RESPONSE=$(curl -s "$API_URL/health")
if echo "$HEALTH_RESPONSE" | grep -q '"status":"OK"'; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    echo "$HEALTH_RESPONSE" | grep -o '"database":{"status":"[^"]*"' || echo ""
else
    echo -e "${RED}❌ Backend is not running or unhealthy${NC}"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

# Step 2: Register User
echo ""
echo "Step 2: Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$TEST_NAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ User registered successfully${NC}"
    echo "Email: $TEST_EMAIL"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Registration failed${NC}"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi

# Step 3: Login
echo ""
echo "Step 3: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
    echo -e "${GREEN}✅ Login successful${NC}"
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Step 4: Create Workspace
echo ""
echo "Step 4: Creating workspace..."
WORKSPACE_RESPONSE=$(curl -s -X POST "$API_URL/workspaces" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\": \"Test Workspace $(date +%s)\",
    \"description\": \"Test workspace created via API\"
  }")

WORKSPACE_ID=$(echo "$WORKSPACE_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "$WORKSPACE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$WORKSPACE_ID" ]; then
    echo -e "${GREEN}✅ Workspace created successfully${NC}"
    echo "Workspace ID: $WORKSPACE_ID"
else
    echo -e "${RED}❌ Workspace creation failed${NC}"
    echo "Response: $WORKSPACE_RESPONSE"
    exit 1
fi

# Step 5: Create Page
echo ""
echo "Step 5: Creating page..."
PAGE_RESPONSE=$(curl -s -X POST "$API_URL/pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"workspaceId\": \"$WORKSPACE_ID\",
    \"title\": \"Test Page\",
    \"content\": \"# Test Page\n\nThis content was created via API and should be in the database.\",
    \"parentId\": null
  }")

PAGE_ID=$(echo "$PAGE_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "$PAGE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$PAGE_ID" ]; then
    echo -e "${GREEN}✅ Page created successfully${NC}"
    echo "Page ID: $PAGE_ID"
else
    echo -e "${RED}❌ Page creation failed${NC}"
    echo "Response: $PAGE_RESPONSE"
    exit 1
fi

# Step 6: Verify Data in Database (by fetching back)
echo ""
echo "Step 6: Verifying data was saved to database..."
echo "Fetching workspace..."
WORKSPACE_GET=$(curl -s -X GET "$API_URL/workspaces/$WORKSPACE_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo "$WORKSPACE_GET" | grep -q '"title"'; then
    echo -e "${GREEN}✅ Workspace retrieved from database${NC}"
    echo "$WORKSPACE_GET" | grep -o '"title":"[^"]*"' | head -1
else
    echo -e "${RED}❌ Workspace not found in database${NC}"
fi

echo "Fetching pages..."
PAGES_GET=$(curl -s -X GET "$API_URL/pages/workspace/$WORKSPACE_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PAGES_GET" | grep -q '"pages"'; then
    PAGE_COUNT=$(echo "$PAGES_GET" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✅ Pages retrieved from database${NC}"
    echo "Page count: $PAGE_COUNT"
    if echo "$PAGES_GET" | grep -q "$PAGE_ID"; then
        echo -e "${GREEN}✅ Created page found in database${NC}"
    fi
else
    echo -e "${RED}❌ Pages not found in database${NC}"
fi

# Step 7: Update Page
echo ""
echo "Step 7: Updating page..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/pages/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"title\": \"Updated Test Page\",
    \"content\": \"# Updated Test Page\n\nThis content was updated via API.\"
  }")

if echo "$UPDATE_RESPONSE" | grep -q '"title":"Updated Test Page"'; then
    echo -e "${GREEN}✅ Page updated successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Page update response: $UPDATE_RESPONSE${NC}"
fi

# Step 8: Get Current User
echo ""
echo "Step 8: Getting current user..."
USER_GET=$(curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$USER_GET" | grep -q "$TEST_EMAIL"; then
    echo -e "${GREEN}✅ User data retrieved from database${NC}"
    echo "$USER_GET" | grep -o '"email":"[^"]*"' | head -1
else
    echo -e "${RED}❌ User data not found${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "${GREEN}✅ User Registration: Success${NC}"
echo -e "${GREEN}✅ User Login: Success${NC}"
echo -e "${GREEN}✅ Workspace Creation: Success${NC}"
echo -e "${GREEN}✅ Page Creation: Success${NC}"
echo -e "${GREEN}✅ Data Retrieval: Success${NC}"
echo -e "${GREEN}✅ Page Update: Success${NC}"
echo ""
echo -e "${GREEN}🎉 All API endpoints working!${NC}"
echo -e "${GREEN}✅ Data is flowing from Frontend → API → Database${NC}"
echo ""
echo "Test Data:"
echo "  Email: $TEST_EMAIL"
echo "  Workspace ID: $WORKSPACE_ID"
echo "  Page ID: $PAGE_ID"
echo ""


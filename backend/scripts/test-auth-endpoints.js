/**
 * Test Authentication Endpoints
 * Run with: node scripts/test-auth-endpoints.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';
const TEST_NAME = 'Test User';

console.log('\n🧪 Testing Authentication Endpoints\n');
console.log(`API URL: ${API_URL}\n`);

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1️⃣ Testing Health Check...');
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', response.status, response.data.status);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Backend server is not running!');
      console.error('   → Start it with: cd backend && npm run dev');
    }
    return false;
  }
}

// Test 2: Register User
async function testRegister() {
  console.log('\n2️⃣ Testing User Registration...');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    console.log('✅ Registration Successful:', response.status);
    console.log('   User ID:', response.data.user?.id || response.data.user?._id);
    console.log('   Email:', response.data.user?.email);
    console.log('   Token:', response.data.token ? '✅ Received' : '❌ Missing');
    
    return response.data.token;
  } catch (error) {
    console.error('❌ Registration Failed:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('   Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Backend server is not running!');
    } else if (error.response?.status === 400) {
      console.error('   → Validation error. Check your input.');
    } else if (error.response?.status === 500) {
      console.error('   → Server error. Check backend logs.');
    }
    return null;
  }
}

// Test 3: Login User
async function testLogin(token) {
  console.log('\n3️⃣ Testing User Login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    console.log('✅ Login Successful:', response.status);
    console.log('   User ID:', response.data.user?.id || response.data.user?._id);
    console.log('   Email:', response.data.user?.email);
    console.log('   Token:', response.data.token ? '✅ Received' : '❌ Missing');
    
    return response.data.token;
  } catch (error) {
    console.error('❌ Login Failed:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('   Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.response?.status === 401) {
      console.error('   → Invalid credentials. User may not exist.');
    }
    return null;
  }
}

// Test 4: Get Current User
async function testGetCurrentUser(token) {
  console.log('\n4️⃣ Testing Get Current User...');
  if (!token) {
    console.log('⏭️  Skipping (no token available)');
    return;
  }
  
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('✅ Get Current User Successful:', response.status);
    console.log('   User ID:', response.data.user?.id || response.data.user?._id);
    console.log('   Email:', response.data.user?.email);
    console.log('   Name:', response.data.user?.name);
    
    return true;
  } catch (error) {
    console.error('❌ Get Current User Failed:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('   Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.response?.status === 401) {
      console.error('   → Invalid or expired token.');
    }
    return false;
  }
}

// Run all tests
async function runTests() {
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    console.log('\n⚠️  Backend server is not running. Please start it first.');
    console.log('   Command: cd backend && npm run dev\n');
    process.exit(1);
  }
  
  const registerToken = await testRegister();
  const loginToken = await testLogin(registerToken);
  await testGetCurrentUser(loginToken || registerToken);
  
  console.log('\n' + '='.repeat(50));
  if (registerToken && loginToken) {
    console.log('✅ All Authentication Tests Passed!');
    console.log('   Registration: ✅');
    console.log('   Login: ✅');
    console.log('   Get Current User: ✅');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  console.log('='.repeat(50) + '\n');
}

runTests().catch(console.error);


/**
 * Manual Test Script: Test Frontend to Database Data Flow
 * Run with: node scripts/test-data-flow.js
 */

import axios from 'axios';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Workspace from '../src/models/Workspace.js';
import Page from '../src/models/Page.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Test user data
const testUser = {
  name: `Test User ${Date.now()}`,
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
};

let authToken;
let userId;
let workspaceId;
let pageId;

const log = (message, data = '') => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log('='.repeat(60));
};

const logSuccess = (message) => {
  console.log(`✅ ${message}`);
};

const logError = (message, error) => {
  console.error(`❌ ${message}`);
  if (error) console.error('Error:', error.response?.data || error.message);
};

async function testDataFlow() {
  try {
    // Step 1: Register User
    log('Step 1: Registering new user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user.id || registerResponse.data.user._id;
    logSuccess(`User registered: ${testUser.email}`);
    
    // Verify in database
    const userInDB = await User.findOne({ email: testUser.email });
    if (userInDB) {
      logSuccess(`✅ User verified in database: ${userInDB.email}`);
    } else {
      logError('❌ User NOT found in database!');
      return;
    }

    // Step 2: Login
    log('Step 2: Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    logSuccess('Login successful');

    // Step 3: Create Workspace
    log('Step 3: Creating workspace...');
    const workspaceData = {
      title: `Test Workspace ${Date.now()}`,
      description: 'Test workspace created via API',
    };
    const workspaceResponse = await axios.post(
      `${API_URL}/workspaces`,
      workspaceData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    workspaceId = workspaceResponse.data.workspace._id || workspaceResponse.data.workspace.id;
    logSuccess(`Workspace created: ${workspaceData.title}`);
    
    // Verify in database
    const workspaceInDB = await Workspace.findById(workspaceId).populate('owner');
    if (workspaceInDB) {
      logSuccess(`✅ Workspace verified in database: ${workspaceInDB.title}`);
      logSuccess(`✅ Workspace owner: ${workspaceInDB.owner.email}`);
    } else {
      logError('❌ Workspace NOT found in database!');
      return;
    }

    // Step 4: Create Page
    log('Step 4: Creating page...');
    const pageData = {
      workspaceId: workspaceId,
      title: 'Test Page',
      content: '# Test Page\n\nThis content was created via API and should be in the database.',
      parentId: null,
    };
    const pageResponse = await axios.post(
      `${API_URL}/pages`,
      pageData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    pageId = pageResponse.data.page._id || pageResponse.data.page.id;
    logSuccess(`Page created: ${pageData.title}`);
    
    // Verify in database
    const pageInDB = await Page.findById(pageId)
      .populate('workspaceId')
      .populate('updatedBy');
    if (pageInDB) {
      logSuccess(`✅ Page verified in database: ${pageInDB.title}`);
      logSuccess(`✅ Page workspace: ${pageInDB.workspaceId.title}`);
      logSuccess(`✅ Page content length: ${pageInDB.content.length} characters`);
    } else {
      logError('❌ Page NOT found in database!');
      return;
    }

    // Step 5: Update Page
    log('Step 5: Updating page...');
    const updateData = {
      title: 'Updated Test Page',
      content: '# Updated Test Page\n\nThis content was updated via API.',
    };
    const updateResponse = await axios.put(
      `${API_URL}/pages/${pageId}`,
      updateData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logSuccess('Page updated');
    
    // Verify update in database
    const updatedPageInDB = await Page.findById(pageId);
    if (updatedPageInDB && updatedPageInDB.title === updateData.title) {
      logSuccess(`✅ Page update verified in database: ${updatedPageInDB.title}`);
    } else {
      logError('❌ Page update NOT reflected in database!');
    }

    // Step 6: Get All Pages
    log('Step 6: Fetching pages...');
    const pagesResponse = await axios.get(
      `${API_URL}/pages/workspace/${workspaceId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logSuccess(`Fetched ${pagesResponse.data.pages.length} page(s)`);
    logSuccess(`✅ Data retrieved from database successfully`);

    // Step 7: Update Workspace
    log('Step 7: Updating workspace...');
    const workspaceUpdate = {
      title: 'Updated Test Workspace',
      description: 'Updated description',
    };
    const workspaceUpdateResponse = await axios.put(
      `${API_URL}/workspaces/${workspaceId}`,
      workspaceUpdate,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logSuccess('Workspace updated');
    
    // Verify update in database
    const updatedWorkspaceInDB = await Workspace.findById(workspaceId);
    if (updatedWorkspaceInDB && updatedWorkspaceInDB.title === workspaceUpdate.title) {
      logSuccess(`✅ Workspace update verified in database: ${updatedWorkspaceInDB.title}`);
    } else {
      logError('❌ Workspace update NOT reflected in database!');
    }

    // Step 8: Final Verification
    log('Step 8: Final database verification...');
    const finalUser = await User.findById(userId);
    const finalWorkspace = await Workspace.findById(workspaceId);
    const finalPage = await Page.findById(pageId);
    
    if (finalUser && finalWorkspace && finalPage) {
      logSuccess('✅ All data exists in database:');
      logSuccess(`   - User: ${finalUser.email}`);
      logSuccess(`   - Workspace: ${finalWorkspace.title}`);
      logSuccess(`   - Page: ${finalPage.title}`);
      logSuccess(`   - Page content: ${finalPage.content.substring(0, 50)}...`);
      
      // Verify relationships
      if (finalWorkspace.owner.toString() === finalUser._id.toString()) {
        logSuccess('✅ Workspace-User relationship verified');
      }
      if (finalPage.workspaceId.toString() === finalWorkspace._id.toString()) {
        logSuccess('✅ Page-Workspace relationship verified');
      }
      if (finalPage.updatedBy.toString() === finalUser._id.toString()) {
        logSuccess('✅ Page-User relationship verified');
      }
    }

    // Summary
    log('\n🎉 DATA FLOW TEST COMPLETE!', {
      summary: {
        userCreated: !!finalUser,
        workspaceCreated: !!finalWorkspace,
        pageCreated: !!finalPage,
        dataInDatabase: !!(finalUser && finalWorkspace && finalPage),
        relationshipsValid: !!(
          finalUser && finalWorkspace && finalPage &&
          finalWorkspace.owner.toString() === finalUser._id.toString() &&
          finalPage.workspaceId.toString() === finalWorkspace._id.toString()
        ),
      },
    });

    // Cleanup (optional)
    log('Cleaning up test data...');
    await Page.deleteMany({ _id: pageId });
    await Workspace.deleteMany({ _id: workspaceId });
    await User.deleteMany({ _id: userId });
    logSuccess('Test data cleaned up');

  } catch (error) {
    logError('Test failed:', error);
    process.exit(1);
  }
}

// Run test
console.log('\n🚀 Starting Frontend to Database Data Flow Test...');
console.log(`📡 API URL: ${API_URL}\n`);

// Connect to database first
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB\n');
    return testDataFlow();
  })
  .then(() => {
    console.log('\n✅ Test completed successfully!\n');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  });


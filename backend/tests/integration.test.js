import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Workspace from '../src/models/Workspace.js';
import Page from '../src/models/Page.js';

describe('Integration Test: Frontend to Database Flow', () => {
  let authToken;
  let userId;
  let workspaceId;
  let pageId;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    }
  });

  afterAll(async () => {
    // Clean up test data
    await Page.deleteMany({});
    await Workspace.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Complete Data Flow Test', () => {
    it('Step 1: Should register a new user and save to database', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: testEmail,
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testEmail);

      authToken = response.body.token;
      userId = response.body.user.id;

      // Verify user exists in database
      const userInDB = await User.findOne({ email: testEmail });
      expect(userInDB).toBeTruthy();
      expect(userInDB.email).toBe(testEmail);
      expect(userInDB.name).toBe('Test User');
      expect(userInDB).toHaveProperty('passwordHash');
    });

    it('Step 2: Should login user and verify token', async () => {
      const testUser = await User.findById(userId).select('email');
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      // Update authToken for subsequent tests
      authToken = response.body.token;
      expect(response.body.user._id?.toString() || response.body.user.id).toBe(userId?.toString() || userId);
    });

    it('Step 3: Should create a workspace and save to database', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Workspace',
          description: 'Integration test workspace',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('workspace');
      expect(response.body.workspace).toHaveProperty('title', 'Test Workspace');
      expect(response.body.workspace).toHaveProperty('owner');

      workspaceId = response.body.workspace._id || response.body.workspace.id;

      // Verify workspace exists in database
      const workspaceInDB = await Workspace.findById(workspaceId)
        .populate('owner', 'name email');
      
      expect(workspaceInDB).toBeTruthy();
      expect(workspaceInDB.title).toBe('Test Workspace');
      expect(workspaceInDB.description).toBe('Integration test workspace');
      expect(workspaceInDB.owner._id.toString()).toBe(userId);
      expect(workspaceInDB.members).toHaveLength(1);
    });

    it('Step 4: Should create a page and save to database', async () => {
      const response = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          workspaceId: workspaceId,
          title: 'Test Page',
          content: '# Test Page\n\nThis is test content',
          parentId: null,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('page');
      expect(response.body.page).toHaveProperty('title', 'Test Page');
      expect(response.body.page).toHaveProperty('content', '# Test Page\n\nThis is test content');

      pageId = response.body.page._id || response.body.page.id;

      // Verify page exists in database
      const pageInDB = await Page.findById(pageId)
        .populate('workspaceId')
        .populate('updatedBy');
      
      expect(pageInDB).toBeTruthy();
      expect(pageInDB.title).toBe('Test Page');
      expect(pageInDB.content).toBe('# Test Page\n\nThis is test content');
      expect(pageInDB.workspaceId._id.toString()).toBe(workspaceId.toString());
      expect(pageInDB.updatedBy._id.toString()).toBe(userId);
    });

    it('Step 5: Should update page and persist changes to database', async () => {
      const response = await request(app)
        .put(`/api/pages/${pageId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Page',
          content: '# Updated Test Page\n\nUpdated content',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('page');
      expect(response.body.page).toHaveProperty('title', 'Updated Test Page');
      expect(response.body.page).toHaveProperty('content', '# Updated Test Page\n\nUpdated content');

      // Verify changes persisted in database
      const pageInDB = await Page.findById(pageId);
      expect(pageInDB.title).toBe('Updated Test Page');
      expect(pageInDB.content).toBe('# Updated Test Page\n\nUpdated content');
      expect(pageInDB).toHaveProperty('updatedAt');
    });

    it('Step 6: Should retrieve workspace with all pages from database', async () => {
      const response = await request(app)
        .get(`/api/pages/workspace/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pages');
      expect(Array.isArray(response.body.pages)).toBe(true);
      expect(response.body.pages.length).toBeGreaterThan(0);
      
      const testPage = response.body.pages.find(p => (p._id || p.id) === pageId);
      expect(testPage).toBeTruthy();
      expect(testPage.title).toBe('Updated Test Page');
    });

    it('Step 7: Should update workspace and persist to database', async () => {
      const response = await request(app)
        .put(`/api/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Workspace',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('workspace');
      expect(response.body.workspace).toHaveProperty('title', 'Updated Test Workspace');

      // Verify changes persisted in database
      const workspaceInDB = await Workspace.findById(workspaceId);
      expect(workspaceInDB.title).toBe('Updated Test Workspace');
      expect(workspaceInDB.description).toBe('Updated description');
    });

    it('Step 8: Should delete page and remove from database', async () => {
      const response = await request(app)
        .delete(`/api/pages/${pageId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('deletedCount');

      // Verify page is removed from database
      const pageInDB = await Page.findById(pageId);
      expect(pageInDB).toBeNull();
    });

    it('Step 9: Should delete workspace and remove from database', async () => {
      const response = await request(app)
        .delete(`/api/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify workspace is removed from database
      const workspaceInDB = await Workspace.findById(workspaceId);
      expect(workspaceInDB).toBeNull();
    });

    it('Step 10: Should verify all data flow works end-to-end', async () => {
      // Create complete workflow: User -> Workspace -> Page -> Update -> Delete
      const testEmail = `test-full-${Date.now()}@example.com`;
      
      // Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Full Test User',
          email: testEmail,
          password: 'password123',
        });
      
      const token = registerResponse.body.token;
      const workspaceResp = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Full Test Workspace' });
      
      const wsId = workspaceResp.body.workspace._id || workspaceResp.body.workspace.id;
      
      const pageResp = await request(app)
        .post('/api/pages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          workspaceId: wsId,
          title: 'Full Test Page',
          content: 'Test content',
        });
      
      const pId = pageResp.body.page._id || pageResp.body.page.id;
      
      // Verify all data in database
      const user = await User.findOne({ email: testEmail });
      const workspace = await Workspace.findById(wsId);
      const page = await Page.findById(pId);
      
      expect(user).toBeTruthy();
      expect(workspace).toBeTruthy();
      expect(page).toBeTruthy();
      expect(workspace.owner.toString()).toBe(user._id.toString());
      expect(page.workspaceId.toString()).toBe(workspace._id.toString());
      expect(page.updatedBy.toString()).toBe(user._id.toString());
      
      console.log('\n✅ Complete data flow test passed!');
      console.log('✅ User created in database:', user.email);
      console.log('✅ Workspace created in database:', workspace.title);
      console.log('✅ Page created in database:', page.title);
      console.log('✅ All relationships verified in database\n');
    });
  });
});


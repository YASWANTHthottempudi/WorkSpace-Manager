import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Workspace from '../src/models/Workspace.js';

describe('Workspace API', () => {
  let authToken;
  let testUser;
  let testWorkspace;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    }

    // Clean up test database
    await Workspace.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'workspace-test@example.com',
        password: 'password123',
      });

    testUser = userResponse.body.user;
    authToken = userResponse.body.token;
  });

  afterAll(async () => {
    await Workspace.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/workspaces', () => {
    it('should create a workspace successfully', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Workspace',
          description: 'Test Description',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('workspace');
      expect(response.body.workspace).toHaveProperty('title', 'Test Workspace');
      expect(response.body.workspace).toHaveProperty('owner');
      
      testWorkspace = response.body.workspace;
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .send({
          title: 'Test Workspace',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Test Description',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/workspaces', () => {
    it('should get all workspaces for authenticated user', async () => {
      const response = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('workspaces');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.workspaces)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/workspaces');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/workspaces/:id', () => {
    it('should get workspace by ID', async () => {
      const workspaceId = testWorkspace._id || testWorkspace.id;
      const response = await request(app)
        .get(`/api/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('workspace');
      expect(response.body.workspace).toHaveProperty('title', 'Test Workspace');
    });

    it('should return 404 for non-existent workspace', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/workspaces/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/workspaces/:id', () => {
    it('should update workspace successfully', async () => {
      const workspaceId = testWorkspace._id || testWorkspace.id;
      const response = await request(app)
        .put(`/api/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Workspace',
          description: 'Updated Description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('workspace');
      expect(response.body.workspace).toHaveProperty('title', 'Updated Workspace');
    });
  });

  describe('DELETE /api/workspaces/:id', () => {
    it('should delete workspace successfully', async () => {
      // Create a new workspace for deletion
      const createResponse = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Delete Workspace',
        });

      const workspaceId = createResponse.body.workspace._id || createResponse.body.workspace.id;
      
      const response = await request(app)
        .delete(`/api/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});


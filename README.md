# AI Knowledge Workspace

A Notion-like collaborative editor with AI summarization, real-time sync, Redis caching, and CI/CD.

## 🎯 Project Overview

**Goal**: Build a collaborative workspace where users can create and share "pages" (markdown or blocks). AI assists by summarizing, rewriting, or answering questions about page content.

### Key Features
- 📝 Real-time collaborative editing
- 🤖 AI-powered summarization, rewriting, and Q&A
- 🔄 Real-time synchronization using Socket.IO
- ⚡ Redis caching for performance
- 🔐 Secure JWT authentication
- 🌐 Full CI/CD pipeline

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router (JavaScript)
- **React** - UI library
- **TailwindCSS** - Styling
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Framer Motion** - Animations
- **Headless UI** - Accessible UI components
- **Heroicons** - Icons



### AI Integration
- **OpenAI API (GPT-4o)** - AI capabilities

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend deployment
- **Render/AWS** - Backend deployment
- **AWS S3** - File storage (optional)

## 📁 Project Structure

```
AI_Workspace/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.js
│   │   │   │   └── signup/
│   │   │   │       └── page.js
│   │   │   ├── dashboard/
│   │   │   │   └── page.js
│   │   │   └── workspace/
│   │   │       └── [id]/
│   │   │           └── page.js
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── editor/
│   │   │   ├── sidebar/
│   │   │   └── shared/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   └── server.js
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```



<<<<<<< HEAD
=======
| Day | Focus | Deliverables |
|-----|-------|-------------|
| 1 | Project setup | Init frontend with Next.js, Tailwind, ESLint. Add folder structure `/app`, `/components`, `/context`. Basic layout (Sidebar + Topbar). |
| 2 | Auth UI | Login/Signup pages, reusable `<Input>` + `<Button>`. Local state only. Add Context for auth. |
| 3 | Dashboard UI | "My Workspaces" list. Add modal for creating a workspace. Store mock data in localStorage. |
| 4 | Page editor UI | Create markdown/text editor using react-markdown or block editor (simple). Add "Ask AI" and "Summarize" buttons (no backend yet). |
| 5 | Page list sidebar | Nested structure like Notion (workspace → pages). Manage via Redux Toolkit. |
| 6 | UI polish | Responsive layout, Tailwind themes, animations (Framer Motion). |
| 7 | Test & docs | Component testing with Testing Library. Commit: `feat(ui): base dashboard + editor`. |

**Result**: Full mock frontend with navigation and editor ready to connect backend.

---

### **WEEK 2 – Backend API (Express + MongoDB)**
**Goal**: Implement auth, workspaces, and pages CRUD.

| Day | Focus | Deliverables |
|-----|-------|-------------|
| 8 | Init backend | Express + dotenv + cors + mongoose setup. `/api/health` route. Connect to MongoDB Atlas. |
| 9 | Auth system | User model `{name,email,passwordHash}`. Routes: `/auth/register`, `/auth/login`. bcrypt + JWT. |
| 10 | Workspace model | `{title, owner, members}` CRUD routes `/api/workspaces`. Auth middleware. |
| 11 | Page model | `{title, content, workspaceId, updatedBy}` CRUD routes `/api/pages`. |
| 12 | Connect frontend | Replace mock calls with Axios. Show real workspace/page data. |
| 13 | Error handling | Global error middleware + request validation. |
| 14 | API testing | Postman + Jest tests. Commit: `feat(api): users, workspaces, pages CRUD`. |

**Result**: Fully functional REST API, secure JWT auth, and Mongo integration.

---

### **WEEK 3 – Realtime Sync + Redis + AI Integration**
**Goal**: Add live collaboration and AI summarization features.

| Day | Focus | Deliverables |
|-----|-------|-------------|
| 15 | Redis setup | Install Redis locally or Upstash. Add caching layer for `/pages/:id` fetch. |
| 16 | Socket.IO integration | Server: `io.on('join_page')`, emit `page_update`. Client: update content in real time. |
| 17 | Redis pub/sub | Publish updates to `page_update` channel. Subscribed servers sync across instances. |
| 18 | AI summarization | Add `/api/ai/summarize` route. Input: text → output: summary via GPT API. |
| 19 | AI rewrite / query | Add `/api/ai/rewrite` and `/api/ai/query`. Integrate buttons in editor. |
| 20 | Performance pass | Cache AI responses (TTL 5 min) in Redis. Add rate limiter. |
| 21 | Manual test | Multi-tab editing test. AI outputs functional. Commit: `feat(realtime+ai): sockets + summarizer`. |

**Result**: Real-time collaborative editing, Redis caching, and AI summarization integrated.

---

### **WEEK 4 – CI/CD + Cloud Integration + Final Polish**
**Goal**: Automate build/test/deploy; finish docs and metrics.

| Day | Focus | Deliverables |
|-----|-------|-------------|
| 22 | AWS + S3 setup | Store attachments (optional). Configure aws-sdk + presigned URLs. |
| 23 | GitHub Actions | `.github/workflows/ci.yml` — lint, test, build on push. |
| 24 | Deployment | Frontend → Vercel, Backend → Render/AWS ECS. Configure env vars + secrets. |
| 25 | Logging + monitoring | Add Winston logger + health check dashboard. |
| 26 | Optimization | Mongo indexes, Redis TTL tuning, compression. |
| 27 | Documentation | Full README.md: architecture diagram, setup, routes, API examples. |
| 28 | Final QA | Cross-device test, performance audit, commit `release(v1.0): production build`. |

**Result**: Production-ready system with CI/CD, cloud integrations, and docs.

---

## 🚀 Getting Started
>>>>>>> 1804390 (backend setup)

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)
- OpenAI API key

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# REDIS_URL=your_redis_url
# JWT_SECRET=your_secret_key
# OPENAI_API_KEY=your_openai_key

npm run dev
```

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Workspaces
- `GET /api/workspaces` - Get all user workspaces
- `POST /api/workspaces` - Create new workspace
- `GET /api/workspaces/:id` - Get workspace by ID
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Pages
- `GET /api/pages` - Get all pages in workspace
- `POST /api/pages` - Create new page
- `GET /api/pages/:id` - Get page by ID
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### AI Features
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/rewrite` - Rewrite text
- `POST /api/ai/query` - Answer questions about text






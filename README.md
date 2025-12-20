# AI Knowledge Workspace

A Notion-like collaborative editor with AI summarization, real-time sync, Redis caching, and CI/CD.

## 🎯 Project Overview

**Goal**: Build a collaborative workspace where users can create and share "pages" (markdown or blocks). AI assists by summarizing, rewriting, or answering questions about page content.


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






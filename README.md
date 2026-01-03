# 💡 Ideate - AI-Enhanced Ideas & Collaboration Platform

A full-stack MVP for managing ideas and notes with AI enhancement, real-time collaboration, and cross-device sync powered by Google's Gemini API.

## ✨ Features

### 🔐 Authentication & Security
- Secure user signup/login with JWT tokens
- Password hashing with bcrypt
- Persistent session management
- Protected API routes

### 📝 Idea Management
- Create, read, update, delete ideas/notes
- Rich text editor with auto-save
- PostgreSQL storage with timestamping
- Idea ownership tracking

### 🤖 AI Enhancement with Gemini
- Integrate Google Gemini API (free tier)
- "Enhance Idea" feature—AI expands and refines ideas
- Enhancement history stored in database
- Rate limiting (15 requests/minute) handled gracefully
- Real-time enhancement sharing with collaborators

### 🤝 Collaborative Sharing
- Share ideas with specific users (by username/email)
- Generate public shareable links
- Real-time collaborative editing
- Live presence indicators showing active collaborators
- Permission management (edit/view)
- "Shared with me" filter in dashboard

### 🔔 Notifications & Real-Time Updates
- WebSocket-based real-time sync
- Notifications when ideas are shared
- Live updates when collaborators edit
- Presence tracking for active users
- Instant sync across all devices and users

### 📱 Cross-Device Sync
- WebSocket connection for real-time synchronization
- Automatic sync when switching devices
- Real-time idea updates across sessions

### 🎨 User Experience
- Modern, futuristic UI design
- Dashboard with idea filtering (All, My Ideas, Shared with Me)
- Idea detail view with enhancement panel
- Collaborators panel with presence indicators
- Public share link management
- Responsive design (mobile, tablet, desktop)

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Real-time**: WebSockets (ws library)
- **Authentication**: JWT, bcryptjs
- **AI**: Google Gemini API (free tier)
- **Frontend**: React 18, React Router
- **Styling**: Custom CSS with glassmorphism effects

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Google Gemini API key (free tier)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ideate
```

### 2. Get a free Gemini API key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Note**: The free tier includes 15 requests per minute, which is perfect for development and small-scale use.

### 3. Set up the database

```bash
# Create PostgreSQL database
createdb ideate

# Or using psql
psql -U postgres
CREATE DATABASE ideate;
\q
```

### 4. Configure environment variables

```bash
# Backend configuration
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your configuration:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ideate
JWT_SECRET=your-super-secret-jwt-key-change-this
GEMINI_API_KEY=your-gemini-api-key-here
```

### 5. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 6. Initialize the database

```bash
cd backend
npm run db:init
```

You should see: ✅ Database tables created successfully!

### 7. Start the application

#### Option 1: Run both servers concurrently (recommended)

```bash
# From the root directory
npm run dev
```

#### Option 2: Run servers separately

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 8. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000

## 📚 Usage Guide

### Creating an Account

1. Navigate to http://localhost:3000
2. Click "Sign up"
3. Enter your email, username, and password
4. You'll be automatically logged in

### Creating Ideas

1. Click "✨ New Idea" on the dashboard
2. Enter a title and content
3. Click "Create Idea"

### Enhancing Ideas with AI

1. Open an idea
2. Click "✨ Enhance" in the AI Enhancements panel
3. Wait for Gemini to analyze and enhance your idea
4. View the AI-generated enhancement below
5. All collaborators will see the enhancement in real-time

### Sharing Ideas

#### Share with specific users:
1. Open an idea you own
2. Click "🔗 Share"
3. Enter the username or email of the person
4. They'll receive a notification and can view/edit the idea

#### Generate public link:
1. Open an idea you own
2. Scroll to the Collaborators panel
3. Click "Generate Public Link"
4. Copy and share the link with anyone
5. They can view the idea without logging in

### Real-Time Collaboration

1. Share an idea with another user
2. Both open the same idea
3. See each other in the "Active now" section
4. Changes made by one user appear instantly for the other
5. AI enhancements are also synced in real-time

## 🗂 Project Structure

```
ideate/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User model & queries
│   │   ├── Idea.js               # Idea model & queries
│   │   ├── Enhancement.js        # Enhancement model
│   │   └── PublicShare.js        # Public share links
│   ├── routes/
│   │   ├── auth.js               # Auth routes (signup/login)
│   │   ├── ideas.js              # CRUD & sharing routes
│   │   └── ai.js                 # Gemini AI integration
│   ├── scripts/
│   │   └── init-db.js            # Database initialization
│   ├── server.js                 # Express & WebSocket server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Navbar.js
│   │   │   ├── IdeaCard.js
│   │   │   ├── IdeaEditor.js
│   │   │   ├── EnhancementPanel.js
│   │   │   ├── CollaboratorsPanel.js
│   │   │   ├── ShareModal.js
│   │   │   ├── CreateIdeaModal.js
│   │   │   └── NotificationToast.js
│   │   ├── context/              # React context providers
│   │   │   ├── AuthContext.js
│   │   │   └── WebSocketContext.js
│   │   ├── pages/                # Page components
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── IdeaDetail.js
│   │   │   └── PublicIdea.js
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json                   # Root package.json
└── README.md
```

## 🗄 Database Schema

### users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `username` (VARCHAR UNIQUE)
- `password` (VARCHAR - hashed)
- `created_at` (TIMESTAMP)

### ideas
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FK → users)
- `title` (VARCHAR)
- `content` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### idea_collaborators
- `id` (SERIAL PRIMARY KEY)
- `idea_id` (INTEGER FK → ideas)
- `user_id` (INTEGER FK → users)
- `permission_level` (VARCHAR: 'edit' or 'view')
- `added_at` (TIMESTAMP)

### public_shares
- `id` (SERIAL PRIMARY KEY)
- `idea_id` (INTEGER FK → ideas)
- `share_token` (VARCHAR UNIQUE)
- `created_at` (TIMESTAMP)

### enhancements
- `id` (SERIAL PRIMARY KEY)
- `idea_id` (INTEGER FK → ideas)
- `original_content` (TEXT)
- `enhanced_content` (TEXT)
- `created_at` (TIMESTAMP)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Ideas
- `GET /api/ideas` - Get all ideas (with filters)
- `GET /api/ideas/:id` - Get single idea
- `POST /api/ideas` - Create idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea

### Sharing
- `POST /api/ideas/:id/share` - Share with user
- `DELETE /api/ideas/:id/share/:userId` - Remove collaborator
- `POST /api/ideas/:id/public-share` - Generate public link
- `DELETE /api/ideas/:id/public-share` - Revoke public link
- `GET /api/ideas/public/:token` - View public idea

### AI Enhancement
- `POST /api/ai/enhance/:ideaId` - Enhance idea with Gemini
- `GET /api/ai/enhancements/:ideaId` - Get enhancement history

## 🌐 WebSocket Events

### Client → Server
- `authenticate` - Authenticate WebSocket connection
- `join-idea` - Join idea room for real-time updates
- `leave-idea` - Leave idea room
- `idea-update` - Notify others of idea changes
- `enhancement-created` - Notify others of new enhancement
- `idea-shared` - Notify user of new share

### Server → Client
- `authenticated` - Authentication successful
- `presence-update` - Active users in idea updated
- `idea-updated` - Idea was modified by collaborator
- `new-enhancement` - New AI enhancement created
- `notification` - System notification
- `error` - Error message

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```env
PORT=5000                          # Server port
DATABASE_URL=postgresql://...     # PostgreSQL connection string
JWT_SECRET=your-secret-key        # JWT signing secret
GEMINI_API_KEY=your-api-key       # Google Gemini API key
```

**Frontend**:
The frontend uses default values but can be configured with:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

## 🚨 Rate Limiting

The Gemini free tier has the following limits:
- 15 requests per minute
- 1,500 requests per day

The app handles this by:
- Client-side rate limiting per user
- Graceful error handling with retry suggestions
- Clear error messages when limits are reached

## 🐛 Troubleshooting

### Database connection fails
- Ensure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in `.env`
- Verify database exists: `psql -l | grep ideate`

### WebSocket connection fails
- Check that backend is running on port 5000
- Ensure no firewall blocking WebSocket connections
- Check browser console for connection errors

### Gemini API errors
- Verify your API key is correct
- Check you haven't exceeded rate limits
- Ensure you have an active Google Cloud account

### Frontend can't connect to backend
- Ensure backend is running: `curl http://localhost:5000/api/health`
- Check CORS settings in backend
- Verify API_URL in frontend

## 📝 Development Tips

### Testing collaboration features
1. Open the app in two different browsers
2. Sign up with two different accounts
3. Share an idea from one account to the other
4. See real-time updates as you edit

### Resetting the database
```bash
psql -U postgres
DROP DATABASE ideate;
CREATE DATABASE ideate;
\q
cd backend
npm run db:init
```

## 🚀 Production Deployment

### Backend Deployment (Heroku, Railway, Render, etc.)
1. Set environment variables
2. Ensure PostgreSQL addon is configured
3. Run database initialization on first deploy
4. Configure WebSocket support

### Frontend Deployment (Vercel, Netlify, etc.)
1. Set REACT_APP_API_URL to your backend URL
2. Set REACT_APP_WS_URL to your WebSocket URL
3. Build: `npm run build`
4. Deploy the `build` directory

## 🎯 Future Enhancements

- [ ] Rich text editor with formatting
- [ ] File attachments and images
- [ ] Tags and categories
- [ ] Search functionality
- [ ] Export ideas to PDF/Markdown
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Version history for ideas
- [ ] Comments on ideas

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the code comments
3. Open an issue on GitHub

---

Built with ❤️ using React, Node.js, PostgreSQL, and Google Gemini AI

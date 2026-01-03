# 🏗 Architecture Documentation

## System Overview

Ideate is a full-stack real-time collaborative application with AI enhancement capabilities. The system follows a client-server architecture with WebSocket connections for real-time features.

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │  React   │  │  Router  │  │  Context API             │  │
│  │  Pages   │──│  (SPA)   │──│  (Auth, WebSocket)       │  │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
│       │              │                    │                  │
│       └──────────────┴────────────────────┘                  │
│                      │                                        │
│                 HTTP & WS                                     │
└─────────────────────┼─────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Server                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Express    │  │   WebSocket  │  │  Gemini AI API  │   │
│  │   REST API   │  │   Server     │  │   Integration   │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
                  ┌────────────────────┐
                  │    PostgreSQL      │
                  │    Database        │
                  └────────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: UI library with hooks
- **React Router v6**: Client-side routing
- **Context API**: State management (Auth, WebSocket)
- **Native WebSocket API**: Real-time communication
- **CSS3**: Custom styling with glassmorphism effects

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **ws**: WebSocket library for real-time features
- **pg**: PostgreSQL client
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **@google/generative-ai**: Gemini API integration

### Database
- **PostgreSQL 12+**: Relational database with ACID compliance

### External Services
- **Google Gemini API**: AI text enhancement (free tier)

## Data Flow

### 1. Authentication Flow

```
User ─────────────────────────────────────────────────────┐
  │                                                        │
  │ 1. POST /api/auth/signup or /api/auth/login           │
  │                                                        ▼
  │                                              ┌──────────────┐
  │                                              │   Express    │
  │                                              │   Server     │
  │                                              └──────┬───────┘
  │                                                     │
  │                                         2. Validate & hash password
  │                                                     │
  │                                                     ▼
  │                                              ┌──────────────┐
  │                                              │  PostgreSQL  │
  │                                              │  (users)     │
  │                                              └──────┬───────┘
  │                                                     │
  │                                         3. Create/find user
  │                                                     │
  │ ◄─────────────────────────────────────────────────┘
  │ 4. Return JWT token + user data
  │
  └───► Store token in localStorage
        Use for authenticated requests
```

### 2. Real-Time Collaboration Flow

```
User A                    WebSocket Server              User B
  │                              │                        │
  │ 1. Authenticate with JWT     │                        │
  ├─────────────────────────────►│                        │
  │                              │                        │
  │ 2. Join idea room (ID: 123)  │                        │
  ├─────────────────────────────►│                        │
  │                              │ 3. Track User A in room│
  │                              │                        │
  │                              │◄───────────────────────┤
  │                              │ 4. User B joins room   │
  │                              │                        │
  │◄─────────────────────────────┤                        │
  │ 5. Presence update (User B)  ├───────────────────────►│
  │                              │ 5. Presence update     │
  │                              │                        │
  │ 6. Edit idea                 │                        │
  ├─────────────────────────────►│                        │
  │                              │                        │
  │                              │ 7. Broadcast update    │
  │                              ├───────────────────────►│
  │                              │                        │
  │◄─────────────────────────────┤                        │
  │ 8. Leave room                │                        │
  │                              │                        │
  │                              │ 9. Update presence     │
  │                              ├───────────────────────►│
```

### 3. AI Enhancement Flow

```
User                      Backend                    Gemini API
  │                         │                            │
  │ 1. Click "Enhance"      │                            │
  ├────────────────────────►│                            │
  │                         │                            │
  │                         │ 2. Check rate limit        │
  │                         │ 3. Fetch idea content      │
  │                         │                            │
  │                         │ 4. POST /generateContent   │
  │                         ├───────────────────────────►│
  │                         │                            │
  │                         │                            │ 5. Process
  │                         │                            │    with AI
  │                         │                            │
  │                         │◄───────────────────────────┤
  │                         │ 6. Enhanced text           │
  │                         │                            │
  │                         │ 7. Save to enhancements    │
  │                         │    table                   │
  │                         │                            │
  │◄────────────────────────┤                            │
  │ 8. Return enhancement   │                            │
  │                         │                            │
  │ 9. Broadcast via WS     │                            │
  │    to all collaborators │                            │
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ username (UNIQ) │
│ password        │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│     ideas       │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │◄────────────┐
│ title           │             │
│ content         │             │ N:1
│ created_at      │             │
│ updated_at      │             │
└────┬────┬───────┘             │
     │    │                     │
     │    │ 1:N                 │
     │    │                     │
     │    └───────────┐         │
     │                │         │
     │ 1:N            ▼         │
     │         ┌──────────────────────┐
     │         │ idea_collaborators   │
     │         ├──────────────────────┤
     │         │ id (PK)              │
     │         │ idea_id (FK)         │
     │         │ user_id (FK)         ├─────────┘
     │         │ permission_level     │
     │         │ added_at             │
     │         └──────────────────────┘
     │
     │ 1:N
     │
     ├───────────►┌──────────────────┐
     │            │  enhancements    │
     │            ├──────────────────┤
     │            │ id (PK)          │
     │            │ idea_id (FK)     │
     │            │ original_content │
     │            │ enhanced_content │
     │            │ created_at       │
     │            └──────────────────┘
     │
     │ 1:1
     │
     └───────────►┌──────────────────┐
                  │  public_shares   │
                  ├──────────────────┤
                  │ id (PK)          │
                  │ idea_id (FK)     │
                  │ share_token (UNQ)│
                  │ created_at       │
                  └──────────────────┘
```

### Indexes

For query performance:
- `idx_ideas_user_id`: Fast lookup of user's ideas
- `idx_collaborators_idea_id`: Fast lookup of idea's collaborators
- `idx_collaborators_user_id`: Fast lookup of user's shared ideas

## API Architecture

### RESTful Endpoints

```
/api
├── /auth
│   ├── POST   /signup         # Create new user
│   ├── POST   /login          # Authenticate user
│   └── GET    /me             # Get current user (JWT)
│
├── /ideas
│   ├── GET    /               # List ideas (with filters)
│   ├── POST   /               # Create idea
│   ├── GET    /:id            # Get idea details
│   ├── PUT    /:id            # Update idea
│   ├── DELETE /:id            # Delete idea
│   │
│   ├── POST   /:id/share      # Share with user
│   ├── DELETE /:id/share/:userId  # Remove collaborator
│   │
│   ├── POST   /:id/public-share   # Generate public link
│   ├── DELETE /:id/public-share   # Revoke public link
│   └── GET    /public/:token      # View public idea
│
└── /ai
    ├── POST   /enhance/:ideaId        # Enhance idea
    └── GET    /enhancements/:ideaId   # Get enhancements
```

### WebSocket Protocol

```javascript
// Message format
{
  type: string,      // Event type
  ...payload         // Event-specific data
}

// Client → Server events
{
  type: 'authenticate',
  token: string
}

{
  type: 'join-idea',
  ideaId: number
}

{
  type: 'idea-update',
  ideaId: number,
  idea: object
}

// Server → Client events
{
  type: 'authenticated',
  userId: number
}

{
  type: 'presence-update',
  ideaId: number,
  activeUsers: array
}

{
  type: 'idea-updated',
  ideaId: number,
  idea: object,
  updatedBy: number
}

{
  type: 'notification',
  notification: object
}
```

## Security Architecture

### Authentication

1. **Password Storage**
   - Passwords hashed using bcrypt (10 rounds)
   - Never stored or transmitted in plain text

2. **JWT Tokens**
   - Signed with HS256 algorithm
   - 7-day expiration
   - Stored in localStorage (frontend)
   - Sent in Authorization header

3. **Protected Routes**
   - Middleware validates JWT on each request
   - Invalid/expired tokens return 401
   - User ID extracted from token payload

### Authorization

1. **Idea Ownership**
   - Only owner can delete ideas
   - Only owner can manage collaborators
   - Only owner can create/revoke public links

2. **Idea Access**
   - Owners have full access
   - Collaborators have permission-based access (edit/view)
   - Public links allow read-only access

3. **WebSocket Security**
   - Requires JWT authentication
   - Validates token before allowing connections
   - Disconnects on authentication failure

### Input Validation

1. **Backend Validation**
   - Email format validation
   - Password length requirements (min 6 chars)
   - SQL injection prevention via parameterized queries
   - XSS prevention via content escaping

2. **Frontend Validation**
   - Form validation before submission
   - Real-time error feedback
   - Prevents empty submissions

## Real-Time Architecture

### WebSocket Connection Management

```javascript
// Server-side
const clients = new Map();        // userId → WebSocket
const ideaRooms = new Map();      // ideaId → Set<WebSocket>

// Connection lifecycle
1. Client connects → WebSocket created
2. Client authenticates → Added to clients map
3. Client joins idea → Added to idea room
4. Client leaves idea → Removed from room
5. Client disconnects → Cleanup from all rooms
```

### Presence Tracking

```javascript
// Active users per idea
ideaRooms.get(ideaId) → Set of WebSocket connections

// Each WebSocket has:
ws.userId        // User identifier
ws.userEmail     // User email
ws.currentIdeaId // Currently viewing idea

// Presence updates sent on:
- User joins idea
- User leaves idea
- User disconnects
```

### Broadcast Strategy

```javascript
// Targeted broadcasts (idea-specific)
ideaRooms.get(ideaId).forEach(client => {
  if (client !== sender) {
    client.send(message);
  }
});

// User-specific notifications
const targetClient = clients.get(userId);
targetClient.send(notification);
```

## AI Integration Architecture

### Gemini API Integration

```javascript
// Rate limiting strategy
const rateLimitMap = new Map();  // userId → [timestamps]

// Per-user tracking
- 15 requests per minute (free tier)
- 60-second sliding window
- Graceful degradation on limit

// Error handling
- Network errors → Retry suggestion
- API errors → User-friendly message
- Rate limits → Wait time indication
```

### Enhancement Processing

1. **Request Flow**
   - User clicks "Enhance"
   - Frontend shows loading state
   - Backend checks rate limit
   - If allowed, sends to Gemini
   - Saves response to database
   - Returns to frontend
   - Broadcasts to collaborators

2. **Prompt Engineering**
   - Includes idea title and content
   - Requests structured enhancement
   - Asks for expansion and refinement
   - Maintains original intent

## State Management

### Frontend State Architecture

```
┌─────────────────────────────────────┐
│         Application State            │
├─────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────┐    │
│  │      AuthContext            │    │
│  ├────────────────────────────┤    │
│  │ • user                      │    │
│  │ • token                     │    │
│  │ • loading                   │    │
│  │ • isAuthenticated           │    │
│  │ • login()                   │    │
│  │ • signup()                  │    │
│  │ • logout()                  │    │
│  └────────────────────────────┘    │
│                                      │
│  ┌────────────────────────────┐    │
│  │    WebSocketContext         │    │
│  ├────────────────────────────┤    │
│  │ • ws                        │    │
│  │ • connected                 │    │
│  │ • notifications             │    │
│  │ • activeUsers               │    │
│  │ • joinIdea()                │    │
│  │ • leaveIdea()               │    │
│  │ • notifyIdeaUpdate()        │    │
│  └────────────────────────────┘    │
│                                      │
│  ┌────────────────────────────┐    │
│  │      Component State        │    │
│  ├────────────────────────────┤    │
│  │ • Local UI state            │    │
│  │ • Form inputs               │    │
│  │ • Loading flags             │    │
│  │ • Error messages            │    │
│  └────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

## Performance Considerations

### Frontend Optimization

1. **Component Re-renders**
   - Context split (Auth, WebSocket) prevents unnecessary re-renders
   - Memoization not needed for current scale
   - Virtual scrolling not needed (< 1000 ideas expected)

2. **WebSocket Efficiency**
   - Single connection per client
   - Room-based message filtering
   - Automatic reconnection on disconnect

3. **API Calls**
   - Debounced auto-save (not implemented, manual save only)
   - Optimistic UI updates
   - Error retry logic

### Backend Optimization

1. **Database Queries**
   - Indexed foreign keys
   - Parameterized queries prevent injection
   - Connection pooling (pg Pool)

2. **WebSocket Performance**
   - In-memory tracking (Map/Set)
   - O(1) user lookup
   - O(n) broadcast (n = active users in room)

3. **Rate Limiting**
   - In-memory tracking (suitable for single instance)
   - Redis recommended for multi-instance

## Scalability Considerations

### Current Architecture (Single Instance)

- ✅ Suitable for 100s of concurrent users
- ✅ WebSocket state in memory
- ✅ Rate limiting in memory
- ✅ Single database connection pool

### Scaling to Multiple Instances

Required changes:

1. **WebSocket State**
   - Move to Redis (pub/sub for broadcasts)
   - Sticky sessions or WebSocket gateway

2. **Rate Limiting**
   - Move to Redis (shared rate limit state)
   - Distributed rate limiting algorithm

3. **Database**
   - Read replicas for scaling reads
   - Connection pool per instance

4. **Load Balancing**
   - Nginx or ALB
   - WebSocket-aware routing

## Error Handling

### Frontend Error Handling

```javascript
try {
  // API call
} catch (error) {
  // 1. Display user-friendly message
  // 2. Log to console (dev)
  // 3. Optionally report to service (production)
  // 4. Provide recovery action
}
```

### Backend Error Handling

```javascript
try {
  // Operation
} catch (error) {
  console.error('Error context:', error);
  res.status(500).json({
    error: 'User-friendly message'
  });
}
```

### WebSocket Error Handling

```javascript
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  // Connection automatically closed
});

ws.on('close', () => {
  // Cleanup: remove from rooms, clients map
});
```

## Monitoring & Logging

### Current Logging

- Console logs for development
- Error logging for debugging
- WebSocket connection events

### Production Recommendations

1. **Application Monitoring**
   - Use PM2 or similar for process management
   - Log to file (Winston, Bunyan)
   - Aggregate logs (ELK stack, CloudWatch)

2. **Performance Monitoring**
   - Response times (express middleware)
   - Database query performance
   - WebSocket connection count

3. **Error Tracking**
   - Sentry or similar for frontend/backend
   - Alert on critical errors
   - Track error rates

## Deployment Architecture

### Development

```
Local Machine
├── PostgreSQL (localhost:5432)
├── Backend (localhost:5000)
└── Frontend (localhost:3000)
```

### Production (Example)

```
                    ┌──────────────┐
                    │   CDN/Cache  │
                    │  (Frontend)  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │Load Balancer │
                    └──────┬───────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
    ┌────────────┐                  ┌────────────┐
    │  Backend   │                  │  Backend   │
    │ Instance 1 │                  │ Instance 2 │
    └─────┬──────┘                  └─────┬──────┘
          │                               │
          └───────────────┬───────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  PostgreSQL  │
                   │   (Managed)  │
                   └──────────────┘
```

### Environment Configuration

**Development**:
- Local PostgreSQL
- Hot reload (nodemon, react-scripts)
- Debug logging

**Production**:
- Managed PostgreSQL (AWS RDS, Heroku Postgres)
- Process manager (PM2)
- Production build (optimized)
- Secure environment variables
- HTTPS/WSS

---

This architecture supports the MVP requirements and provides a foundation for future scaling.

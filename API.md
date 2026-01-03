# 📡 API Documentation

Complete REST API and WebSocket documentation for Ideate.

## Base URL

```
Development: http://localhost:5000/api
Production:  https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via JWT token.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Getting a Token

Tokens are obtained through `/auth/signup` or `/auth/login` endpoints and are valid for 7 days.

---

## Authentication Endpoints

### Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Validation:**
- Email: Valid email format, unique
- Username: Alphanumeric + underscore, unique
- Password: Minimum 6 characters

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Email already registered"
}

// 400 - Validation Error
{
  "error": "Username already taken"
}

// 400 - Validation Error
{
  "error": "Password must be at least 6 characters"
}
```

---

### Log In

Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**
```json
// 401 - Authentication Failed
{
  "error": "Invalid email or password"
}
```

---

### Get Current User

Get details of the currently authenticated user.

**Endpoint:** `GET /auth/me`

**Headers Required:** Authorization

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 401 - Unauthorized
{
  "error": "No authentication token"
}

// 404 - Not Found
{
  "error": "User not found"
}
```

---

## Ideas Endpoints

### List Ideas

Get all ideas accessible to the user (owned + shared).

**Endpoint:** `GET /ideas`

**Headers Required:** Authorization

**Query Parameters:**
- `filter` (optional): `all` | `owned` | `shared`

**Examples:**
```
GET /ideas                 // All ideas (owned + shared)
GET /ideas?filter=owned    // Only owned ideas
GET /ideas?filter=shared   // Only shared ideas
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "My Awesome Idea",
    "content": "This is the content of my idea...",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "is_owner": true
  },
  {
    "id": 2,
    "user_id": 2,
    "title": "Shared Idea",
    "content": "This idea was shared with me...",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z",
    "is_owner": false,
    "owner_username": "janedoe",
    "owner_email": "jane@example.com",
    "permission_level": "edit"
  }
]
```

---

### Get Idea

Get details of a specific idea.

**Endpoint:** `GET /ideas/:id`

**Headers Required:** Authorization

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "My Awesome Idea",
  "content": "This is the content...",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "owner_username": "johndoe",
  "owner_email": "john@example.com",
  "is_owner": true,
  "collaborators": [
    {
      "id": 2,
      "username": "janedoe",
      "email": "jane@example.com",
      "permission_level": "edit",
      "added_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "enhancements": [
    {
      "id": 1,
      "idea_id": 1,
      "original_content": "Original text...",
      "enhanced_content": "AI enhanced text...",
      "created_at": "2024-01-01T13:00:00.000Z"
    }
  ],
  "public_share": {
    "id": 1,
    "idea_id": 1,
    "share_token": "abc123-def456-ghi789",
    "created_at": "2024-01-01T14:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Access denied"
}

// 404 - Not Found
{
  "error": "Idea not found"
}
```

---

### Create Idea

Create a new idea.

**Endpoint:** `POST /ideas`

**Headers Required:** Authorization

**Request Body:**
```json
{
  "title": "My New Idea",
  "content": "The content of the idea..."
}
```

**Validation:**
- Title: Required, max 500 characters
- Content: Optional, text

**Success Response (201):**
```json
{
  "id": 3,
  "user_id": 1,
  "title": "My New Idea",
  "content": "The content of the idea...",
  "created_at": "2024-01-03T00:00:00.000Z",
  "updated_at": "2024-01-03T00:00:00.000Z"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Title is required"
}
```

---

### Update Idea

Update an existing idea.

**Endpoint:** `PUT /ideas/:id`

**Headers Required:** Authorization

**Permission:** Owner or collaborator with edit permission

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-03T10:00:00.000Z"
}
```

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Access denied"
}

// 400 - Validation Error
{
  "error": "Title is required"
}
```

---

### Delete Idea

Delete an idea (owner only).

**Endpoint:** `DELETE /ideas/:id`

**Headers Required:** Authorization

**Permission:** Owner only

**Success Response (200):**
```json
{
  "message": "Idea deleted successfully"
}
```

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Only the owner can delete this idea"
}
```

---

## Sharing Endpoints

### Share with User

Share an idea with another user.

**Endpoint:** `POST /ideas/:id/share`

**Headers Required:** Authorization

**Permission:** Owner only

**Request Body:**
```json
{
  "userIdentifier": "janedoe",  // username or email
  "permissionLevel": "edit"      // "edit" or "view" (optional, defaults to "edit")
}
```

**Success Response (200):**
```json
{
  "message": "Idea shared successfully",
  "collaborators": [
    {
      "id": 2,
      "username": "janedoe",
      "email": "jane@example.com",
      "permission_level": "edit",
      "added_at": "2024-01-03T15:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Only the owner can share this idea"
}

// 404 - Not Found
{
  "error": "User not found"
}

// 400 - Bad Request
{
  "error": "Cannot share with yourself"
}
```

---

### Remove Collaborator

Remove a collaborator from an idea.

**Endpoint:** `DELETE /ideas/:id/share/:userId`

**Headers Required:** Authorization

**Permission:** Owner only

**Success Response (200):**
```json
{
  "message": "Collaborator removed successfully",
  "collaborators": []
}
```

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Only the owner can remove collaborators"
}
```

---

### Generate Public Link

Create a public shareable link for an idea.

**Endpoint:** `POST /ideas/:id/public-share`

**Headers Required:** Authorization

**Permission:** Owner only

**Success Response (200):**
```json
{
  "id": 1,
  "idea_id": 1,
  "share_token": "abc123-def456-ghi789",
  "created_at": "2024-01-03T16:00:00.000Z"
}
```

**Note:** If a public link already exists, returns the existing one.

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Only the owner can create public links"
}
```

---

### Revoke Public Link

Delete the public share link for an idea.

**Endpoint:** `DELETE /ideas/:id/public-share`

**Headers Required:** Authorization

**Permission:** Owner only

**Success Response (200):**
```json
{
  "message": "Public share link revoked"
}
```

---

### View Public Idea

View an idea via public share link (no authentication required).

**Endpoint:** `GET /ideas/public/:token`

**Headers Required:** None

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Publicly Shared Idea",
  "content": "The content...",
  "owner_username": "johndoe",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-03T00:00:00.000Z",
  "enhancements": [
    {
      "id": 1,
      "enhanced_content": "AI enhanced text...",
      "created_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "is_public": true
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "Share link not found or expired"
}
```

---

## AI Enhancement Endpoints

### Enhance Idea

Request AI enhancement of an idea using Google Gemini.

**Endpoint:** `POST /ai/enhance/:ideaId`

**Headers Required:** Authorization

**Permission:** Owner or collaborator

**Request Body:** None (uses idea content)

**Rate Limit:** 15 requests per minute per user

**Success Response (200):**
```json
{
  "id": 1,
  "idea_id": 1,
  "original_content": "My original idea...",
  "enhanced_content": "Here's an enhanced version of your idea:\n\n1. Expanded concept...\n2. Additional insights...\n3. Suggested next steps...",
  "created_at": "2024-01-03T17:00:00.000Z"
}
```

**Error Responses:**
```json
// 403 - Forbidden
{
  "error": "Access denied"
}

// 429 - Rate Limit Exceeded
{
  "error": "Rate limit exceeded. Please wait a moment before trying again.",
  "retryAfter": 60
}

// 429 - API Rate Limit
{
  "error": "API rate limit reached. Please try again in a few moments.",
  "retryAfter": 60
}
```

---

### Get Enhancements

Get all AI enhancements for an idea.

**Endpoint:** `GET /ai/enhancements/:ideaId`

**Headers Required:** Authorization

**Permission:** Owner or collaborator

**Success Response (200):**
```json
[
  {
    "id": 2,
    "idea_id": 1,
    "original_content": "Updated content...",
    "enhanced_content": "Latest enhancement...",
    "created_at": "2024-01-03T18:00:00.000Z"
  },
  {
    "id": 1,
    "idea_id": 1,
    "original_content": "Original content...",
    "enhanced_content": "First enhancement...",
    "created_at": "2024-01-03T17:00:00.000Z"
  }
]
```

**Note:** Returns enhancements in reverse chronological order (newest first).

---

## WebSocket API

### Connection

**URL:** `ws://localhost:5000` (development) or `wss://your-domain.com` (production)

**Protocol:** JSON messages

### Authentication

After connecting, client must authenticate:

```json
{
  "type": "authenticate",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "type": "authenticated",
  "userId": 1
}
```

**Error:**
```json
{
  "type": "error",
  "message": "Authentication failed"
}
```

---

### Client → Server Events

#### Join Idea Room

```json
{
  "type": "join-idea",
  "ideaId": 1
}
```

Joins the real-time room for a specific idea. Receives presence updates and change notifications.

---

#### Leave Idea Room

```json
{
  "type": "leave-idea",
  "ideaId": 1
}
```

Leaves the idea room. No longer receives updates for this idea.

---

#### Idea Update

```json
{
  "type": "idea-update",
  "ideaId": 1,
  "idea": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "updated_at": "2024-01-03T19:00:00.000Z"
  }
}
```

Notifies other users in the room that the idea was updated.

---

#### Enhancement Created

```json
{
  "type": "enhancement-created",
  "ideaId": 1,
  "enhancement": {
    "id": 3,
    "enhanced_content": "New AI enhancement...",
    "created_at": "2024-01-03T19:30:00.000Z"
  }
}
```

Notifies collaborators of a new AI enhancement.

---

#### Idea Shared

```json
{
  "type": "idea-shared",
  "targetUserId": 2,
  "ideaId": 1,
  "ideaTitle": "My Shared Idea",
  "sharedBy": "johndoe"
}
```

Sends a notification to the target user that an idea was shared with them.

---

### Server → Client Events

#### Presence Update

```json
{
  "type": "presence-update",
  "ideaId": 1,
  "activeUsers": [
    {
      "userId": 1,
      "email": "john@example.com"
    },
    {
      "userId": 2,
      "email": "jane@example.com"
    }
  ]
}
```

Sent when users join or leave an idea room.

---

#### Idea Updated

```json
{
  "type": "idea-updated",
  "ideaId": 1,
  "idea": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "updated_at": "2024-01-03T19:00:00.000Z"
  },
  "updatedBy": 2
}
```

Broadcast when another user updates the idea.

---

#### New Enhancement

```json
{
  "type": "new-enhancement",
  "ideaId": 1,
  "enhancement": {
    "id": 3,
    "enhanced_content": "AI enhancement...",
    "created_at": "2024-01-03T19:30:00.000Z"
  }
}
```

Broadcast when a new AI enhancement is created.

---

#### Notification

```json
{
  "type": "notification",
  "notification": {
    "type": "idea-shared",
    "message": "johndoe shared an idea with you: \"My Awesome Idea\"",
    "ideaId": 1,
    "timestamp": "2024-01-03T20:00:00.000Z"
  }
}
```

System notification for user actions.

---

#### Error

```json
{
  "type": "error",
  "message": "Invalid message format"
}
```

Error notification.

---

## Error Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## Rate Limits

### Gemini AI API

- **Free Tier:** 15 requests per minute per user
- **Daily Limit:** 1,500 requests per day
- **Handling:** Automatic retry suggestion, graceful degradation

### General API

No rate limiting currently implemented. Recommended for production:
- 100 requests per minute per user
- 1000 requests per hour per IP

---

## Pagination

Not currently implemented. Ideas are returned in full.

**Future Enhancement:**
```
GET /ideas?page=1&limit=20
```

---

## Webhooks

Not currently implemented.

**Future Enhancement:**
- Webhook for idea shares
- Webhook for AI enhancements
- Webhook for collaborator actions

---

## SDK / Client Libraries

Not available yet. Use fetch/axios or WebSocket client directly.

**Example:**
```javascript
// REST API
const response = await fetch('http://localhost:5000/api/ideas', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
const ideas = await response.json();

// WebSocket
const ws = new WebSocket('ws://localhost:5000');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'authenticate', token }));
};
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Authentication endpoints
- CRUD operations for ideas
- Sharing functionality
- AI enhancement integration
- Real-time WebSocket support

---

For questions or issues, please open an issue on GitHub.

# 🤝 Contributing to Ideate

Thank you for your interest in contributing to Ideate! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ideate.git
   cd ideate
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run db:init
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions/changes

Examples:
- `feature/markdown-editor`
- `fix/websocket-reconnection`
- `docs/api-endpoints`

### Commit Message Format

Follow conventional commits:

```
type(scope): short description

Longer description if needed.

Fixes #123
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:
```
feat(ai): add retry logic for Gemini API failures

fix(websocket): prevent memory leak in presence tracking

docs(readme): add Docker deployment instructions
```

## Coding Standards

### JavaScript/React Style

1. **Naming Conventions**
   ```javascript
   // camelCase for variables and functions
   const userName = 'John';
   function getUserIdeas() {}

   // PascalCase for components and classes
   class IdeaManager {}
   function IdeaCard() {}

   // UPPER_CASE for constants
   const MAX_RETRIES = 3;
   const API_BASE_URL = 'http://api.example.com';
   ```

2. **Code Formatting**
   - Use 2 spaces for indentation
   - Always use semicolons
   - Single quotes for strings (except JSX)
   - Trailing commas in objects/arrays

   ```javascript
   // Good
   const user = {
     name: 'John',
     email: 'john@example.com',
   };

   // Bad
   const user = {
     name: "John",
     email: "john@example.com"
   }
   ```

3. **React Patterns**
   ```javascript
   // Functional components with hooks
   function IdeaCard({ idea, onDelete }) {
     const [loading, setLoading] = useState(false);

     const handleClick = async () => {
       setLoading(true);
       await onDelete(idea.id);
       setLoading(false);
     };

     return (
       <div className="idea-card">
         {/* JSX */}
       </div>
     );
   }
   ```

4. **Async/Await**
   ```javascript
   // Always use try-catch with async/await
   const fetchIdea = async (id) => {
     try {
       const response = await api.getIdea(id);
       return response;
     } catch (error) {
       console.error('Failed to fetch idea:', error);
       throw error;
     }
   };
   ```

5. **Comments**
   - Comment complex logic
   - Don't comment obvious code
   - Use JSDoc for functions

   ```javascript
   // Good
   /**
    * Calculates the rate limit window for a user
    * @param {number} userId - The user identifier
    * @returns {Array<number>} Recent request timestamps
    */
   function getRateLimitWindow(userId) {
     // Complex logic here
   }

   // Bad
   // Get user name
   const userName = user.name;
   ```

### CSS Style

1. **Class Naming**
   ```css
   /* Use kebab-case */
   .idea-card { }
   .create-button { }
   .user-profile-section { }

   /* Use BEM for complex components */
   .idea-card__header { }
   .idea-card__title { }
   .idea-card__content { }
   .idea-card--featured { }
   ```

2. **Organization**
   ```css
   /* Group related properties */
   .element {
     /* Positioning */
     position: relative;
     top: 0;
     left: 0;

     /* Box model */
     display: flex;
     width: 100%;
     padding: 20px;
     margin: 10px;

     /* Visual */
     background: #fff;
     border: 1px solid #ccc;
     border-radius: 8px;

     /* Typography */
     color: #333;
     font-size: 1rem;
     line-height: 1.5;

     /* Misc */
     cursor: pointer;
     transition: all 0.3s ease;
   }
   ```

### Backend Patterns

1. **Error Handling**
   ```javascript
   router.post('/ideas', auth, async (req, res) => {
     try {
       // Validate input
       if (!req.body.title) {
         return res.status(400).json({ error: 'Title is required' });
       }

       // Business logic
       const idea = await Idea.create(req.userId, req.body.title);

       // Success response
       res.status(201).json(idea);
     } catch (error) {
       console.error('Create idea error:', error);
       res.status(500).json({ error: 'Failed to create idea' });
     }
   });
   ```

2. **Database Queries**
   ```javascript
   // Always use parameterized queries
   const result = await pool.query(
     'SELECT * FROM ideas WHERE user_id = $1',
     [userId]
   );

   // Never concatenate SQL
   // ❌ DON'T DO THIS
   const result = await pool.query(
     `SELECT * FROM ideas WHERE user_id = ${userId}`
   );
   ```

## Testing Guidelines

### Manual Testing

Before submitting:

1. **Test the feature thoroughly**
   - Happy path
   - Edge cases
   - Error scenarios

2. **Cross-browser testing**
   - Chrome
   - Firefox
   - Safari (if possible)

3. **Responsive testing**
   - Mobile (< 768px)
   - Tablet (768-1024px)
   - Desktop (> 1024px)

4. **Real-time features**
   - Test with multiple browser windows
   - Test WebSocket reconnection
   - Test presence indicators

### Writing Tests (Future)

When we add automated testing:

```javascript
// Example unit test
describe('Idea Model', () => {
  it('should create a new idea', async () => {
    const idea = await Idea.create(1, 'Test Idea', 'Content');
    expect(idea.title).toBe('Test Idea');
    expect(idea.user_id).toBe(1);
  });
});

// Example integration test
describe('POST /api/ideas', () => {
  it('should create idea with valid token', async () => {
    const response = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ title: 'Test', content: 'Content' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test');
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   ```

2. **Ensure code quality**
   - [ ] Code follows style guidelines
   - [ ] No console.log() in production code (use proper logging)
   - [ ] All features tested manually
   - [ ] No breaking changes (or documented)
   - [ ] Environment variables documented in .env.example

3. **Update documentation**
   - [ ] Update README.md if needed
   - [ ] Add/update comments in code
   - [ ] Update API docs if endpoints changed

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Use the PR template below
   - Link related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested in multiple browsers
- [ ] Tested responsive design
- [ ] Tested real-time features (if applicable)

## Screenshots
If UI changes, add screenshots

## Related Issues
Fixes #123
Related to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** (when set up)
   - Linting
   - Type checking
   - Tests

2. **Code review**
   - Maintainer will review within 2-3 days
   - Address feedback and push updates
   - Reviewer will approve or request changes

3. **Merge**
   - Maintainer will merge when approved
   - Squash commits for clean history

## Bug Reports

### Before Submitting

1. **Check existing issues**
   - Search for similar issues
   - Check if already fixed in main branch

2. **Gather information**
   - Reproduce the bug
   - Note steps to reproduce
   - Check browser console for errors
   - Check backend logs

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 95]
- Node version: [e.g., 16.14.0]
- PostgreSQL version: [e.g., 13.4]

## Additional Context
Console errors, logs, etc.
```

## Feature Requests

### Before Submitting

1. **Check existing requests**
   - Search issues for similar features
   - Check project roadmap

2. **Consider scope**
   - Does it fit the project vision?
   - Is it feasible with current architecture?
   - Would it benefit most users?

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem it Solves
What problem does this feature address?

## Proposed Solution
How would you implement this?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples from other apps, etc.
```

## Questions?

- **Discord/Slack**: [Link if available]
- **GitHub Discussions**: [Link]
- **Email**: [Maintainer email]

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to Ideate! 🎉

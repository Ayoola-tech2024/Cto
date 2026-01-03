# 🧪 Testing Guide

This guide walks you through testing all features of Ideate.

## Test Checklist

### ✅ Authentication Tests

1. **Sign Up**
   - [ ] Create a new account with email, username, and password
   - [ ] Verify you're automatically logged in
   - [ ] Try signing up with the same email (should fail)
   - [ ] Try password less than 6 characters (should fail)

2. **Login**
   - [ ] Log out from the dashboard
   - [ ] Log in with correct credentials
   - [ ] Try wrong password (should fail)
   - [ ] Try non-existent email (should fail)

3. **Session Persistence**
   - [ ] Refresh the page while logged in
   - [ ] Verify you stay logged in
   - [ ] Close and reopen the browser
   - [ ] Verify session persists

### ✅ Idea Management Tests

1. **Create Ideas**
   - [ ] Click "New Idea" button
   - [ ] Enter title and content
   - [ ] Verify idea appears in dashboard
   - [ ] Create idea with only title (no content)
   - [ ] Try creating idea without title (should fail)

2. **View Ideas**
   - [ ] Click on an idea card to open detail view
   - [ ] Verify title and content display correctly
   - [ ] Navigate back to dashboard
   - [ ] Verify ideas show creation date

3. **Edit Ideas**
   - [ ] Open an idea you own
   - [ ] Edit the title
   - [ ] Edit the content
   - [ ] Click "Save Changes"
   - [ ] Verify changes are saved
   - [ ] Refresh page and verify changes persist

4. **Delete Ideas**
   - [ ] Click delete button on an idea card
   - [ ] Confirm deletion
   - [ ] Verify idea is removed from dashboard
   - [ ] Verify you can't delete shared ideas you don't own

### ✅ AI Enhancement Tests

1. **Basic Enhancement**
   - [ ] Open an idea
   - [ ] Click "✨ Enhance" button
   - [ ] Wait for AI response (should show loading spinner)
   - [ ] Verify enhancement appears in panel
   - [ ] Verify enhancement is well-formatted and relevant

2. **Multiple Enhancements**
   - [ ] Click "Enhance" again on the same idea
   - [ ] Verify new enhancement is added
   - [ ] Verify both enhancements are visible
   - [ ] Verify enhancements are sorted by date (newest first)

3. **Rate Limiting**
   - [ ] Click "Enhance" multiple times quickly
   - [ ] After 15 requests, verify rate limit message appears
   - [ ] Wait 1 minute
   - [ ] Verify you can enhance again

### ✅ Sharing & Collaboration Tests

**Note**: You'll need two accounts for these tests. Open the app in two different browsers or use incognito mode.

1. **Share with User**
   - [ ] **User A**: Create an idea
   - [ ] **User A**: Click "Share" button
   - [ ] **User A**: Enter User B's username or email
   - [ ] **User B**: Check for notification
   - [ ] **User B**: Verify shared idea appears in "Shared with Me" filter
   - [ ] **User B**: Open the shared idea
   - [ ] **User B**: Verify you can edit the idea

2. **Collaborator Management**
   - [ ] **User A**: Open the shared idea
   - [ ] **User A**: Verify User B appears in Collaborators panel
   - [ ] **User A**: Click remove button (×) on collaborator
   - [ ] **User B**: Verify you can no longer access the idea

3. **Public Share Links**
   - [ ] **User A**: Open an idea
   - [ ] **User A**: Click "Generate Public Link"
   - [ ] **User A**: Copy the link
   - [ ] **User A**: Open link in incognito/another browser
   - [ ] Verify idea is visible without login
   - [ ] Verify enhancements are visible
   - [ ] **User A**: Click "Revoke" on public link
   - [ ] Verify link no longer works

### ✅ Real-Time Collaboration Tests

**Setup**: Two browsers, both logged in to different accounts, with an idea shared between them.

1. **Live Editing**
   - [ ] **Both users**: Open the same shared idea
   - [ ] **User A**: Edit the title
   - [ ] **User B**: Verify title updates in real-time
   - [ ] **User B**: Edit the content
   - [ ] **User A**: Verify content updates in real-time

2. **Presence Indicators**
   - [ ] **Both users**: Open the same idea
   - [ ] **User A**: Verify User B appears in "Active now" section
   - [ ] **User B**: Verify User A appears in "Active now" section
   - [ ] **User A**: Navigate away from the idea
   - [ ] **User B**: Verify User A disappears from "Active now"

3. **Real-Time Enhancements**
   - [ ] **Both users**: Open the same shared idea
   - [ ] **User A**: Click "Enhance"
   - [ ] **User B**: Verify enhancement appears in real-time
   - [ ] **User B**: Verify loading state shows for both users

4. **Connection Status**
   - [ ] Verify "Connected" indicator in navbar
   - [ ] Stop the backend server
   - [ ] Verify connection indicator changes
   - [ ] Restart backend
   - [ ] Verify automatic reconnection

### ✅ Dashboard Filters Tests

1. **All Ideas Filter**
   - [ ] Click "All Ideas" tab
   - [ ] Verify you see both owned and shared ideas
   - [ ] Verify owned ideas don't have "Shared" badge
   - [ ] Verify shared ideas have "Shared" badge

2. **My Ideas Filter**
   - [ ] Click "My Ideas" tab
   - [ ] Verify only ideas you created are shown
   - [ ] Verify no shared ideas appear

3. **Shared with Me Filter**
   - [ ] Click "Shared with Me" tab
   - [ ] Verify only ideas shared with you are shown
   - [ ] Verify owner username is displayed
   - [ ] Verify no ideas you own appear

### ✅ UI/UX Tests

1. **Responsive Design**
   - [ ] Resize browser to mobile width (< 768px)
   - [ ] Verify layout adapts properly
   - [ ] Verify all buttons are accessible
   - [ ] Test on tablet width (768-1024px)
   - [ ] Test on desktop (> 1024px)

2. **Loading States**
   - [ ] Verify loading spinner when fetching ideas
   - [ ] Verify "Saving..." indicator when editing
   - [ ] Verify "Enhancing..." state during AI processing
   - [ ] Verify disabled buttons during async operations

3. **Error Handling**
   - [ ] Try invalid login credentials
   - [ ] Try sharing with non-existent user
   - [ ] Verify error messages are clear and helpful
   - [ ] Verify errors don't crash the app

4. **Empty States**
   - [ ] Create a fresh account
   - [ ] Verify empty state on dashboard
   - [ ] Verify helpful messaging
   - [ ] Verify "Create Idea" button in empty state

### ✅ Cross-Device Sync Tests

1. **Multi-Device Access**
   - [ ] Log in on Device A
   - [ ] Log in on Device B (same account)
   - [ ] Create idea on Device A
   - [ ] Verify it appears on Device B in real-time
   - [ ] Edit idea on Device B
   - [ ] Verify changes appear on Device A

2. **Session Management**
   - [ ] Log in on multiple devices
   - [ ] Verify WebSocket connections work on all
   - [ ] Log out on one device
   - [ ] Verify other sessions remain active

### ✅ Data Persistence Tests

1. **After Page Refresh**
   - [ ] Create an idea
   - [ ] Refresh the page
   - [ ] Verify idea still exists
   - [ ] Verify you're still logged in

2. **After Browser Restart**
   - [ ] Log in and create ideas
   - [ ] Close the browser completely
   - [ ] Reopen and navigate to the app
   - [ ] Verify you're still logged in
   - [ ] Verify all ideas are still there

3. **Database Integrity**
   - [ ] Create ideas with special characters
   - [ ] Create ideas with long content (> 1000 chars)
   - [ ] Create ideas with emojis
   - [ ] Verify all save and display correctly

## Performance Tests

1. **Load Testing**
   - [ ] Create 50+ ideas
   - [ ] Verify dashboard loads quickly
   - [ ] Verify scrolling is smooth
   - [ ] Verify filtering works efficiently

2. **AI Response Time**
   - [ ] Enhance an idea with short content
   - [ ] Enhance an idea with long content
   - [ ] Verify response times are reasonable (< 10s)

3. **Real-Time Sync Performance**
   - [ ] Have 3+ users in the same idea
   - [ ] Make rapid edits
   - [ ] Verify all updates sync correctly
   - [ ] Verify no lag or race conditions

## Security Tests

1. **Authentication**
   - [ ] Try accessing /idea/:id without login
   - [ ] Verify redirect to login page
   - [ ] Try accessing API endpoints without token
   - [ ] Verify 401 Unauthorized response

2. **Authorization**
   - [ ] Try to edit someone else's idea (not shared)
   - [ ] Verify access denied
   - [ ] Try to delete shared idea
   - [ ] Verify only owner can delete

3. **Input Validation**
   - [ ] Try SQL injection in input fields
   - [ ] Try XSS attacks in content
   - [ ] Verify proper sanitization

## Edge Cases

1. **Network Issues**
   - [ ] Disconnect internet while editing
   - [ ] Reconnect
   - [ ] Verify WebSocket reconnects
   - [ ] Verify no data loss

2. **Concurrent Edits**
   - [ ] Two users edit the same field simultaneously
   - [ ] Verify last save wins
   - [ ] Verify no data corruption

3. **Long Content**
   - [ ] Create idea with 10,000+ characters
   - [ ] Verify saves correctly
   - [ ] Verify displays correctly
   - [ ] Enhance the long idea
   - [ ] Verify AI handles it

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Acceptance Criteria

All features must pass for MVP completion:

- ✅ User can sign up and log in securely
- ✅ User can create, view, edit, and delete ideas
- ✅ User can click "Enhance with AI" to get Gemini improvements
- ✅ User can share ideas with specific users by email/username
- ✅ User can generate public shareable links for ideas
- ✅ Recipients can view AND edit shared ideas in real-time
- ✅ All changes sync in real-time across all collaborators and devices
- ✅ Presence indicators show who's currently editing
- ✅ Notifications appear when ideas are shared
- ✅ "Shared with me" filter works on dashboard
- ✅ Clean, intuitive UI with futuristic design
- ✅ Backend and frontend both running and connected
- ✅ All features working end-to-end with Gemini free tier
- ✅ Rate limiting handled gracefully

## Test Results Template

Copy this template to document your test results:

```
# Test Results - [Date]

## Environment
- OS: 
- Browser: 
- Node Version: 
- PostgreSQL Version: 

## Test Summary
- Total Tests: 
- Passed: ✅
- Failed: ❌
- Skipped: ⏭️

## Failed Tests
1. [Test Name]
   - Expected: 
   - Actual: 
   - Steps to Reproduce: 

## Notes
- 
```

---

Happy testing! 🧪

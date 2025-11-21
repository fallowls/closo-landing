# Campaign Community Two-Way Communication - Test Plan

## Feature Overview
Campaign Community has been converted from a one-way notes/documents system to a two-way communication channel between users and administrators.

## System Architecture

### User Interface
- **Location**: `/dashboard` (Campaign Community tab)
- **Component**: `client/src/components/campaign-community.tsx`
- **API Endpoints**:
  - `GET /api/user/conversation` - Get or create conversation
  - `GET /api/user/messages` - Fetch messages (polls every 5 seconds)
  - `POST /api/user/messages` - Send message
  - `PATCH /api/user/messages/mark-read` - Mark admin messages as read

### Admin Interface
- **Location**: `/admin/users/:userId/chat`
- **Component**: `client/src/pages/admin/UserChat.tsx`
- **API Endpoints**:
  - `GET /api/admin/conversations/:userId` - Get or create conversation
  - `GET /api/admin/conversations/:conversationId/messages` - Fetch messages
  - `POST /api/admin/conversations/:conversationId/messages` - Send message

### Database Schema
- **Table**: `adminUserConversations` - Stores conversation metadata
- **Table**: `adminUserMessages` - Stores messages with `senderType: 'user' | 'admin'`

## Manual Test Procedure

### Prerequisites
1. Application running on `npm run dev`
2. Database properly configured
3. Valid user account
4. Admin access enabled

### Test Steps

#### Step 1: User Sends Initial Message
1. Log in as a regular user
2. Navigate to Dashboard → Campaign Community
3. Verify chat interface loads without errors
4. Type a test message (e.g., "Hello, I need help with my campaign")
5. Send the message
6. **Expected Results**:
   - Message appears in the chat with blue/purple gradient background
   - Message is aligned to the right
   - User avatar (U icon) displays next to message
   - Timestamp shows correctly
   - No errors in browser console

#### Step 2: Admin Views User Message
1. Log in as admin (separate browser/incognito window)
2. Navigate to Admin → User Chats → Select the test user
3. **Expected Results**:
   - Conversation shows in admin interface
   - User's message "Hello, I need help with my campaign" is visible
   - Message has `senderType: 'user'`
   - Unread count badge shows on admin side
   - Timestamp matches user's message

#### Step 3: Admin Sends Reply
1. In admin interface, type a reply (e.g., "Hi! I'm here to help. What do you need assistance with?")
2. Send the message
3. **Expected Results**:
   - Admin message appears with white background and border
   - Message is aligned to the left
   - Admin avatar (shield icon) displays
   - No errors in console

#### Step 4: User Receives Admin Reply
1. Switch back to user interface
2. Wait up to 5 seconds for polling to fetch new messages
3. **Expected Results**:
   - Admin's reply appears in the chat
   - Message shows on the left side with white background
   - Shield icon displays for admin
   - Unread badge shows if user wasn't viewing the chat
   - Message is automatically marked as read when viewed
   - "Read" indicator may show on admin side

#### Step 5: Continued Two-Way Communication
1. Send 2-3 more messages from each side
2. Verify all messages appear correctly
3. Check that conversation history persists after page refresh
4. **Expected Results**:
   - All messages display in chronological order
   - User and admin messages are visually distinct
   - Scroll behavior works correctly
   - No duplicate messages
   - Timestamps are accurate

### Error Handling Tests

#### Test 1: Network Error
1. Disable network connection
2. Try to send a message
3. **Expected**: Error toast notification

#### Test 2: Session Timeout
1. Clear session cookie
2. Refresh page
3. **Expected**: Redirect to login or error message

#### Test 3: Conversation Load Failure
1. (Requires backend manipulation) Simulate conversation fetch error
2. **Expected**: 
   - Red error banner displays
   - Input is disabled
   - Clear error message shown

## Known Limitations
1. **No WebSocket Support**: Messages use 5-second polling instead of real-time WebSocket updates
2. **Typing Indicators**: Not implemented (requires WebSocket)
3. **Read Receipts**: One-way only (user can see if admin read their messages)

## Success Criteria
- ✅ User can send messages to admin
- ✅ Admin can view user messages
- ✅ Admin can reply to users
- ✅ User can view admin replies
- ✅ Message history persists
- ✅ Proper error handling
- ✅ Loading states function correctly
- ✅ UI clearly differentiates user vs admin messages
- ✅ No console errors during normal operation

## Test Status
**Status**: Ready for Manual Testing
**Last Updated**: November 21, 2025
**Implemented By**: Replit Agent

## Notes
- The feature uses existing backend infrastructure (`adminUserConversations`, `adminUserMessages` tables)
- Both user and admin interfaces query the same database tables
- Messages are properly attributed via `senderType` field
- Future enhancement: Add WebSocket support for real-time updates

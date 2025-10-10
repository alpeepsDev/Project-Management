# 🔄 Refresh Token Implementation Guide

## What is a Refresh Token?

A **refresh token** is a special token used to obtain new access tokens without requiring the user to log in again. This provides both security and user experience benefits.

## How It Works

### 1. **Login Process**

```
User Login → Server responds with:
├── Access Token (short-lived: 15 minutes)
├── Refresh Token (long-lived: 7 days)
└── User Data
```

### 2. **API Request Flow**

```
Client API Request →
├── ✅ Access Token Valid → API Response
└── ❌ Access Token Expired →
    ├── Auto-refresh using Refresh Token
    ├── Get New Access Token
    └── Retry Original Request
```

### 3. **Security Benefits**

- **Short Access Token Lifespan**: Limits damage if compromised (15 min vs 7 days)
- **Automatic Refresh**: Seamless user experience
- **Revocation Control**: Refresh tokens can be invalidated server-side
- **Reduced Login Frequency**: Users stay logged in longer

## Implementation Details

### Server Changes Made:

1. **Updated Login Response** (`/api/v1/users/login`):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...", // 15 minutes
    "refreshToken": "eyJ...", // 7 days
    "user": { ... }
  }
}
```

2. **New Refresh Endpoint** (`/api/v1/users/refresh`):

```json
POST /api/v1/users/refresh
{
  "refreshToken": "eyJ..."
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJ...", // New 15-minute token
    "user": { ... }
  }
}
```

### Client Changes Made:

1. **Token Storage**:
   - `accessToken` + `refreshToken` stored separately
   - Respects "Remember Me" setting (localStorage vs sessionStorage)

2. **Automatic Refresh**:
   - Axios interceptor catches 401 errors
   - Automatically refreshes access token
   - Retries failed requests with new token
   - Queues multiple failed requests during refresh

3. **Error Handling**:
   - If refresh fails → Clear all tokens → Redirect to login
   - Prevents infinite refresh loops

## Token Lifespans

| Token Type    | Lifespan   | Purpose                    |
| ------------- | ---------- | -------------------------- |
| Access Token  | 15 minutes | API authentication         |
| Refresh Token | 7 days     | Generate new access tokens |

## Security Features

1. **JWT Verification**: Both tokens are properly signed and verified
2. **Type Checking**: Refresh tokens have a specific type field
3. **Automatic Cleanup**: Failed refresh clears all stored tokens
4. **Request Queuing**: Multiple requests during refresh are handled gracefully

## Usage Example

```javascript
// Login (nothing changes for frontend developers)
await authService.login({ username, password, rememberMe: true });

// API calls work automatically - no changes needed
const response = await api.get("/users/profile");

// Behind the scenes:
// 1. Request sent with access token
// 2. If token expired (401) → Auto-refresh → Retry request
// 3. User never sees the token refresh happening
```

## Benefits for Your App

✅ **Security**: Short-lived access tokens minimize risk
✅ **UX**: Users stay logged in for 7 days (with "Remember Me")
✅ **Automatic**: No code changes needed for existing API calls
✅ **Resilient**: Handles token expiration gracefully
✅ **Production Ready**: Proper error handling and cleanup

The refresh token system is now fully implemented and working behind the scenes!

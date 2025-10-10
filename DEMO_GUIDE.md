# TaskForge - Demo Mode Guide

## 🧪 Mock Authentication System

The application is currently running in **Demo Mode** with mock authentication and data. This allows you to test all features without needing a real backend server.

## 🔐 Test User Accounts

Use these credentials to test different user roles:

### 👤 USER Role

- **Email:** `user@test.com`
- **Password:** `password123`
- **Features:** Personal task management, Kanban board, task exchanges

### 👨‍💼 MANAGER Role

- **Email:** `manager@test.com`
- **Password:** `password123`
- **Features:** Project management, team oversight, task assignment, all user features

### 🛡️ MODERATOR Role

- **Email:** `moderator@test.com`
- **Password:** `password123`
- **Features:** Content moderation, system monitoring, conflict resolution, all manager features

### 🧑‍💻 ADMIN Role

- **Email:** `admin@test.com`
- **Password:** `password123`
- **Features:** Full system control, user management, platform administration, all moderator features

## 🎯 Available Features

### For All Users

- ✅ **Kanban Board** - Drag and drop task management
- ✅ **Task Exchange** - Request help and collaborate
- ✅ **Profile Management** - View user information
- ✅ **Role-based Navigation** - Adaptive sidebar and menus

### For Managers+

- ✅ **Project Management** - Create and manage projects
- ✅ **Team Management** - Add/remove team members
- ✅ **Task Assignment** - Assign tasks to team members
- ✅ **Project Overview** - Monitor project progress

### For Moderators+

- ✅ **Content Moderation** - Review flagged content
- ✅ **System Monitoring** - Track platform activity
- ✅ **User Reports** - Handle user conflicts
- ✅ **Analytics Dashboard** - View platform statistics

### For Admins

- ✅ **User Management** - Create, edit, deactivate users
- ✅ **Role Management** - Change user roles
- ✅ **System Administration** - Full platform control
- ✅ **Advanced Analytics** - Comprehensive reports

## 🔄 How Mock Data Works

1. **Authentication**: Mock users are predefined with different roles
2. **Data Persistence**: Uses localStorage/sessionStorage for session management
3. **API Simulation**: All hooks simulate real API calls with delays
4. **Role-based Access**: Different dashboards and features based on user role

## 🚀 Testing Instructions

1. **Login** with any of the test accounts above
2. **Explore Role-specific Features** - Each role has different capabilities
3. **Test Kanban Board** - Drag tasks between columns
4. **Try Task Exchange** - Request help from other users
5. **Test Remember Me** - Check persistence across browser sessions
6. **Switch Roles** - Logout and login with different roles to compare features

## 🛠️ Technical Details

### Mock Mode Configuration

```javascript
// In src/api/auth.js
const USE_MOCK_AUTH = true; // Set to false to use real API
```

### Mock Data Sources

- `src/api/auth.js` - User authentication and profiles
- `src/hooks/useTasks.js` - Task management data
- `src/hooks/useProjects.js` - Project management data
- `src/hooks/useUsers.js` - User management data
- `src/hooks/useTaskExchanges.js` - Task exchange data

### Switching to Real API

To connect to a real backend:

1. Set `USE_MOCK_AUTH = false` in `src/api/auth.js`
2. Ensure your backend server is running
3. Update API endpoints in `src/api/index.js`
4. Replace mock data hooks with real API calls

## 📝 Notes

- Mock data resets on page refresh
- New registrations are temporarily stored (not persistent)
- All features are fully functional with mock data
- UI components are production-ready and can work with real APIs

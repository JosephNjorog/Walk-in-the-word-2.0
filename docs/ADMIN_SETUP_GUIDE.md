# 🚀 Admin Dashboard Setup Guide

## Quick Start

### Step 1: Register Your Admin Account

1. Go to your app at `http://localhost:3000/register`
2. Register with these credentials:
   - **Email**: `mwangijoenjoroge@gmail.com`
   - **Password**: `Sirintai83#`
   - **Name**: Your name
3. Complete the registration process

### Step 2: Grant Admin Role

Open your terminal and run:

```bash
npm run setup:admin
```

You should see:
```
🔧 Setting up Super Admin...

✅ Found user: [Your Name] (mwangijoenjoroge@gmail.com)

🎉 SUCCESS! Super Admin has been set up.

📋 Admin Details:
   Name: [Your Name]
   Email: mwangijoenjoroge@gmail.com
   Role: admin
   Verified: true

🔐 You can now access the admin dashboard at: /admin
```

### Step 3: Access Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. If not logged in, you'll be redirected to login
3. Login with:
   - **Email**: `mwangijoenjoroge@gmail.com`
   - **Password**: `Sirintai83#`
4. You'll be redirected to the admin dashboard

---

## What You Get

### ✅ Working Features

1. **Dashboard Overview** (`/admin`)
   - Live statistics
   - User metrics
   - Engagement rates
   - Quick actions
   - System status

2. **Analytics** (`/admin/analytics`)
   - User growth trends
   - Reading statistics
   - Most read books
   - Level distribution
   - Community metrics

3. **User Management** (`/admin/users`)
   - View all users (paginated)
   - Search and filter
   - User details
   - Role management
   - Export capability

4. **Testimonies** (`/admin/testimonies`)
   - Pending testimonies queue
   - Approve/reject system
   - Featured testimonies
   - Content moderation

5. **Settings** (`/admin/settings`)
   - General settings
   - Security config
   - Feature flags
   - API keys management
   - Database settings

### 🚧 Coming Soon

Additional sections linked in the sidebar (will be implemented next):
- Bible content management
- Reading plans
- Memory verses
- Small groups
- Forums
- Achievements & levels
- Payments & revenue
- Notifications
- Churches
- Security & moderation
- Support

---

## Admin Panel Navigation

```
Admin Dashboard
├── 📊 Dashboard (Main overview)
├── 📈 Analytics (Detailed metrics)
│
├── User Management
│   ├── 👥 All Users
│   └── 💰 Subscriptions
│
├── Content
│   ├── 📖 Bible Content
│   ├── 📋 Reading Plans
│   └── 🏅 Memory Verses
│
├── Community
│   ├── 👥 Small Groups
│   ├── 💬 Forums
│   └── 📣 Testimonies
│
├── Gamification
│   ├── 🏆 Achievements
│   └── ⬆️ Levels & XP
│
├── Financial
│   ├── 💳 Payments
│   └── 📊 Revenue Reports
│
├── Communication
│   ├── 🔔 Notifications
│   └── 📢 Announcements
│
├── Ministry
│   └── ⛪ Church Accounts
│
└── System
    ├── 🛡️ Security
    ├── 🔒 Moderation
    ├── ❓ Support
    ├── 💾 Database
    └── ⚙️ Settings
```

---

## Security Features

### Role-Based Access Control
- Only users with `role: 'admin'` can access `/admin`
- All admin API routes check for admin role
- Non-admins are redirected to `/dashboard`

### Protected Routes
```typescript
// Layout checks authentication
const session = await auth.api.getSession(...);
if (!session?.user) redirect('/login');

// Checks admin role
const userData = await db.query.user.findFirst(...);
if (userData?.role !== 'admin') redirect('/dashboard');
```

### API Protection
```typescript
// Every admin API route
const userData = await db.query.user.findFirst(...);
if (userData?.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## Database Schema

### User Roles
```typescript
user.role: 'member' | 'pastor' | 'admin'
```

- **member**: Regular users (default)
- **pastor**: Church leaders (verified badge)
- **admin**: Platform administrators (you)

### Admin Setup
The setup script modifies:
```typescript
{
  role: 'admin',          // Grant admin privileges
  isVerified: true        // Auto-verify account
}
```

---

## API Endpoints

### Setup & Authentication
```
POST /api/admin/setup              # Grant admin role
GET  /api/admin/setup              # List all admins
```

### User Management
```
GET    /api/admin/users            # List users (paginated, filtered)
PATCH  /api/admin/users            # Update user / admin actions
DELETE /api/admin/users?userId={id}# Delete user
```

### Actions Available
```typescript
// PATCH /api/admin/users
{
  userId: string,
  action: 'verify' | 'unverify' | 'promote_admin' | 
          'promote_pastor' | 'demote'
}
```

---

## Troubleshooting

### Can't Access Admin Dashboard?

**Problem**: Redirected to /dashboard when visiting /admin

**Solution**:
1. Make sure you ran `npm run setup:admin`
2. Check database - user role should be 'admin'
3. Try logging out and back in
4. Run setup script again:
   ```bash
   npm run setup:admin
   ```

### Script Shows "User not found"?

**Problem**: `npm run setup:admin` says user doesn't exist

**Solution**:
1. Register first at `/register` with the email
2. Then run the setup script
3. Order matters: Register → Setup → Login → Access Admin

### Auth Errors?

**Problem**: Authentication issues in admin panel

**Solution**:
1. Clear browser cookies
2. Restart dev server: `npm run dev`
3. Try incognito/private browser window
4. Check `.env` for proper Better Auth config

### Database Connection Issues?

**Problem**: Can't connect to database

**Solution**:
1. Check `DATABASE_URL` in `.env`
2. Run migrations: `npm run db:push`
3. Check database is running
4. Verify connection string format

---

## Development Tips

### Testing Admin Features
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Watch database
npm run db:studio

# Terminal 3: Check logs
# (dev server shows logs)
```

### Adding New Admin Sections
1. Create page in `src/app/admin/[section]/page.tsx`
2. Add route to layout sidebar navigation
3. Create API route if needed in `src/app/api/admin/[section]/route.ts`
4. Add authentication checks
5. Update documentation

### Extending API Routes
```typescript
// src/app/api/admin/new-feature/route.ts
import { auth } from '@/lib/auth-client';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  // 1. Check authentication
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers()),
  });
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Check admin role
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (userData?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Your admin logic here
  // ...
}
```

---

## Next Steps

1. ✅ **Setup Complete** - You now have admin access
2. 🔍 **Explore Dashboard** - Familiarize yourself with available features
3. 👥 **Test User Management** - Try viewing and managing users
4. 📊 **Check Analytics** - Review the metrics and statistics
5. ⚙️ **Configure Settings** - Adjust app settings as needed
6. 📋 **Review Roadmap** - See what features are coming next in `ADMIN_DASHBOARD.md`

---

## Support

For any issues:
1. Check this guide first
2. Review `docs/ADMIN_DASHBOARD.md` for full documentation
3. Check error logs in browser console
4. Verify database connection
5. Ensure all dependencies are installed: `npm install`

---

## Security Reminders

🔒 **Important Security Notes**:

1. **Change Default Password**
   - Update `Sirintai83#` after first login
   - Use strong, unique password

2. **Environment Variables**
   - Keep `.env` secure
   - Never commit sensitive keys to git
   - Use different keys for production

3. **Admin Actions**
   - All admin actions should be logged (coming soon)
   - Be careful with user deletion (irreversible)
   - Test changes in development first

4. **Production Deployment**
   - Change `ADMIN_SETUP_SECRET` in production
   - Use HTTPS only
   - Enable rate limiting
   - Set up proper monitoring

---

**Version**: 1.0.0  
**Last Updated**: January 8, 2026  
**Status**: Ready for use ✅

# 🛡️ Walk in the Word - Admin Dashboard

## Super Admin Access

### Login Credentials
- **Email**: `mwangijoenjoroge@gmail.com`
- **Password**: `Sirintai83#`
- **Role**: Super Admin
- **Access Level**: Full platform control

### Initial Setup

1. **Register the Admin User** (if not already registered):
   - Go to `/register`
   - Create account with the email above
   - Complete registration

2. **Grant Admin Role**:
   ```bash
   npm run setup:admin
   ```
   This script will:
   - Find your user account
   - Set role to `admin`
   - Verify your account
   - Grant full admin access

3. **Access Admin Dashboard**:
   - Go to `/admin`
   - You'll be automatically redirected to login if not authenticated
   - After login, you'll have access to all admin features

---

## Dashboard Overview

### Main Sections

#### 📊 **Dashboard** (`/admin`)
- Real-time statistics
- User metrics (total, active, new)
- Engagement metrics
- Community activity
- Revenue overview
- System status
- Quick actions
- Pending moderation queue

#### 📈 **Analytics** (`/admin/analytics`)
- User growth trends
- Engagement rates
- Reading statistics
- Most read books
- User level distribution
- Community metrics
- Custom date ranges
- Export reports

#### 👥 **User Management** (`/admin/users`)
- View all users (paginated)
- Search & filter users
- User details & activity
- Role management (admin/pastor/member)
- Verify users
- Suspend/ban users
- Manual XP adjustments
- Edit user profiles
- Delete accounts
- Export user data

#### 🏅 **Testimonies** (`/admin/testimonies`)
- Approve/reject testimonies
- Feature testimonies
- Moderate content
- Category management
- View submissions
- Edit testimonies
- Delete inappropriate content

#### ⚙️ **Settings** (`/admin/settings`)
- General app settings
- Security configuration
- Notification settings
- Database management
- Feature flags
- API keys & integrations
- Appearance customization
- Environment variables

---

## Planned Admin Features

### Content Management
- **Bible Content** (`/admin/bible`)
  - Manage translations
  - Add/edit commentaries
  - Cross-references
  - Strong's concordance

- **Reading Plans** (`/admin/reading-plans`)
  - Create custom plans
  - Edit existing plans
  - Track enrollments
  - Completion analytics

- **Memory Verses** (`/admin/memory-verses`)
  - Add verses
  - Categorize verses
  - Track mastery rates

### Community Management
- **Small Groups** (`/admin/groups`)
  - View all groups
  - Moderate content
  - Manage leaders
  - View chat logs
  - Archive groups

- **Forums** (`/admin/forums`)
  - Category management
  - Topic moderation
  - Reply management
  - Flag review
  - Ban management

### Gamification
- **Achievements** (`/admin/achievements`)
  - Create badges
  - Set unlock criteria
  - Award manually
  - Track statistics

- **Levels & XP** (`/admin/levels`)
  - Configure level system
  - Set XP rules
  - Level rewards
  - Progression tracking

### Financial
- **Payments** (`/admin/payments`)
  - Transaction logs
  - Subscription management
  - Failed payments
  - Refunds
  - Paystack integration

- **Revenue Reports** (`/admin/revenue`)
  - Daily/monthly revenue
  - Conversion rates
  - Churn analysis
  - Export reports

### Communication
- **Notifications** (`/admin/notifications`)
  - Send push notifications
  - Email campaigns
  - Bulk messaging
  - Segmented targeting
  - Templates

- **Announcements** (`/admin/announcements`)
  - App announcements
  - Feature updates
  - Maintenance notices
  - Scheduled posts

### Security & Moderation
- **Security** (`/admin/security`)
  - Login attempts
  - Suspicious activity
  - IP blocking
  - Session management
  - Audit logs

- **Moderation** (`/admin/moderation`)
  - Flagged content queue
  - User reports
  - Auto-moderation rules
  - Ban management
  - Content filtering

### System Administration
- **Database** (`/admin/database`)
  - Storage usage
  - Backup & restore
  - Query performance
  - Data migration

- **Support** (`/admin/support`)
  - Support tickets
  - Live chat
  - Help center
  - FAQs

- **Churches** (`/admin/churches`)
  - Approve registrations
  - Manage church accounts
  - White-label settings
  - Subscription tiers

---

## API Routes

### Admin Setup
```
POST /api/admin/setup
```
Set user as super admin (requires secret key)

### User Management
```
GET    /api/admin/users              # List users with filters
PATCH  /api/admin/users              # Update user
DELETE /api/admin/users?userId={id}  # Delete user
```

### Admin Authentication
```
GET /api/admin/setup                 # List all admins
```

---

## Role-Based Access Control

### Roles Hierarchy
1. **Super Admin** (You)
   - Full platform access
   - Can manage other admins
   - System configuration
   - Irreversible actions

2. **Admin**
   - User management
   - Content moderation
   - Analytics access
   - No system config

3. **Moderator**
   - Content moderation only
   - Forum/group management
   - Testimony approval
   - Limited user actions

4. **Pastor**
   - Church management
   - Group leadership
   - Verified badge
   - No admin access

5. **Member**
   - Standard user
   - No admin features

---

## Security Features

### Authentication
- Session-based auth (Better Auth)
- Role verification on every request
- Protected API routes
- Auto-redirect non-admins

### Authorization Checks
```typescript
// Layout-level protection
const session = await auth();
if (userData?.role !== 'admin') {
  redirect('/dashboard');
}

// API-level protection
if (adminUser?.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Audit Trail
- Admin action logs (coming soon)
- User modification history
- Database change tracking
- Login attempt monitoring

---

## Development Roadmap

### Phase 1: Core Admin ✅
- [x] Dashboard layout
- [x] User management
- [x] Analytics page
- [x] Testimonies moderation
- [x] Settings page
- [x] Admin API routes
- [x] Setup script

### Phase 2: Content Management 🚧
- [ ] Bible content admin
- [ ] Reading plans CRUD
- [ ] Memory verses management
- [ ] Commentaries upload

### Phase 3: Community Tools 📋
- [ ] Groups management
- [ ] Forums moderation
- [ ] Moderation queue
- [ ] Auto-moderation rules

### Phase 4: Gamification 📋
- [ ] Achievements editor
- [ ] Level system config
- [ ] XP rules management
- [ ] Badge designer

### Phase 5: Financial 📋
- [ ] Payment dashboard
- [ ] Revenue analytics
- [ ] Subscription management
- [ ] Refund processing

### Phase 6: Communication 📋
- [ ] Push notification sender
- [ ] Email campaign builder
- [ ] Announcement system
- [ ] Template editor

### Phase 7: Advanced 📋
- [ ] Church account management
- [ ] Support ticket system
- [ ] Live chat integration
- [ ] Advanced analytics
- [ ] Chart visualizations
- [ ] Export functionality

---

## Quick Commands

```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production
npm run start               # Start production server

# Database
npm run db:push             # Push schema changes
npm run db:generate         # Generate migrations
npm run db:migrate          # Run migrations
npm run db:studio           # Open Drizzle Studio

# Admin
npm run setup:admin         # Set super admin role
```

---

## Environment Variables

Required for admin features:

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Payments
PAYSTACK_SECRET_KEY=sk_test_...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Email
RESEND_API_KEY=re_...

# Admin Setup (optional)
ADMIN_SETUP_SECRET=change-me-in-production
```

---

## Support & Documentation

For issues or feature requests:
1. Check existing documentation
2. Review error logs (`/admin/database`)
3. Check system status (`/admin`)
4. Contact technical support

---

## 🎯 Current Status

✅ **Completed**:
- Admin dashboard structure
- User management interface
- Analytics page
- Testimonies moderation
- Settings configuration
- API routes for admin operations
- Role-based access control
- Super admin setup script

🚧 **In Progress**:
- Additional admin sections (see roadmap)

📋 **Planned**:
- Full feature implementation (see roadmap above)

---

**Last Updated**: January 8, 2026
**Version**: 1.0.0
**Admin Dashboard**: Operational

# 📖 Walk in the Word 2.0

> *A transformative daily Bible reading experience that guides you through the entire Scripture from Genesis to Revelation with community, accountability, and beautiful design.*

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-blue?style=flat-square&logo=postgresql)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-green?style=flat-square)](https://better-auth.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple?style=flat-square)](https://web.dev/progressive-web-apps/)

---

## 🌟 Overview

**Walk in the Word** is a modern, full-stack Progressive Web Application (PWA) designed to help believers engage with Scripture daily. The app provides a structured reading plan, progress tracking, community reflections, accountability partnerships, and a serene reading experience—all wrapped in a beautifully crafted interface built with Next.js 15 and React 19.

### ✨ Core Mission

- **Daily Reading Plan**: Journey through all 1,189 chapters of the Bible systematically
- **Community Connection**: Share reflections and insights with fellow readers
- **Accountability**: Partner with friends and family to stay consistent
- **Progress Tracking**: Visualize your spiritual growth with streaks, milestones, and achievements
- **Beautiful Experience**: Enjoy a distraction-free, serene reading interface

---

## 🚀 Key Features

### 📚 Bible Reading Experience

- **Complete Bible Access**: All 66 books, 1,189 chapters from Genesis to Revelation
- **Multiple Translations**: Support for various Bible versions via Bible API integration
  - King James Version (KJV)
  - American Standard Version (ASV)
  - World English Bible (WEB)
  - And more...
- **Reading Progress Tracker**: Automatic tracking of completed chapters
- **Daily Reading Plan**: Structured progression through Scripture
- **Distraction-Free Interface**: Clean, serene design focused on the Word
- **Verse Numbers & Formatting**: Proper Biblical text formatting for easy reference

### 👥 Social & Community Features

- **Reflections System**: Share your insights and thoughts on each chapter
  - Public/private reflection options
  - View community reflections from other readers
  - Real-time reflection feed
- **Partnership System**: Connect with accountability partners
  - Send and receive partnership invitations
  - Track partner progress
  - Mutual encouragement and accountability
- **Prayer Wall**: Community prayer request system
  - Submit prayer requests (anonymous option available)
  - Pray for others and track prayer interactions
  - Category-based prayer organization
  - Mark prayers as answered
- **User Profiles**: View reading stats and reflections from other believers
  - Public profile pages with customizable usernames
  - Display reading progress and achievements
  - Share your spiritual journey

### 📊 Progress & Gamification

- **Streak Tracking**: Monitor current and longest reading streaks
- **Chapter Progress**: Visual representation of Bible completion (X/1189 chapters)
- **Milestones**: Celebrate completion of books and Testament sections
- **Achievement System**: Unlock badges for reading consistency and milestones
- **Progress Visualization**: Beautiful progress bars and statistics
- **Reading History**: Track your reading journey over time

### 🔐 Authentication & User Management

- **Better Auth Integration**: Modern, secure authentication system
- **Email/Password Authentication**: Traditional secure login
- **Session Management**: Persistent sessions with automatic token refresh
- **Email Verification**: Secure email verification system
- **Password Reset**: Secure password recovery via email
- **User Preferences**: Customizable reading experience
  - Font size and family selection
  - Theme preferences (light/dark)
  - Daily reminder time settings
  - Notification preferences

### 📱 Progressive Web App (PWA)

- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Daily reading reminders (configurable)
- **App-Like Experience**: Full-screen standalone mode
- **Responsive Design**: Optimized for all screen sizes
- **Fast Performance**: Optimized loading and caching strategies

### 🎨 User Interface & Design

- **Modern UI Components**: Built with Radix UI primitives
- **Smooth Animations**: Framer Motion for delightful interactions
- **Tailwind CSS**: Utility-first styling with custom design system
- **Dark Mode Support**: Automatic theme switching with next-themes
- **Accessible**: WCAG compliant with keyboard navigation
- **Beautiful Typography**: Optimized fonts for readability
- **Responsive Layout**: Mobile-first design approach
- **Toast Notifications**: Real-time feedback with Sonner

### 📧 Email & Notifications

- **Email Service**: Nodemailer integration for transactional emails
- **Welcome Emails**: Automated onboarding emails for new users
- **Daily Reminders**: Customizable daily reading reminder emails
- **Partnership Invites**: Email invitations for accountability partners
- **Encouragement Messages**: Send messages to partners
- **Password Reset**: Secure password recovery emails
- **Notification Center**: In-app notification system

### 🎯 Additional Features

- **Bookmarks & Highlights**: Save favorite verses with notes and color coding
- **Search Functionality**: Find specific books, chapters, and verses
- **Reading Pace Options**: Adjust daily reading volume preferences
- **Upload System**: Profile picture and media upload support
- **Settings Management**: Comprehensive user settings panel
- **Terms & Privacy**: Complete legal documentation
- **Donation System**: Support platform development
- **Error Reporting**: Built-in error tracking and reporting
- **Performance Monitoring**: Real-time app performance tracking

---

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15.3.6**: React framework with App Router
- **React 19.2**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development
- **Turbopack**: Next-gen bundler for fast development

### UI & Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog
  - Dropdown Menu, Popover, Select, Tabs, Tooltip
  - And 20+ more components
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Beautiful icon set
- **Tabler Icons**: Additional icon library
- **next-themes**: Dark mode implementation
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Efficient class merging
- **React Syntax Highlighter**: Code highlighting support

### Database & ORM

- **PostgreSQL**: Robust relational database
- **Drizzle ORM**: Type-safe SQL ORM
- **Neon Database**: Serverless PostgreSQL (optional)
- **Drizzle Kit**: Database migrations and introspection

### Authentication

- **Better Auth 1.4**: Modern authentication solution
- **bcrypt**: Password hashing
- **Session Management**: Secure token-based sessions
- **Email Verification**: Built-in verification system

### API Integrations

- **Bible API**: Scripture content from api.bible
- **Email Service**: Nodemailer for transactional emails
- **Stripe**: Payment processing for donations

### Forms & Validation

- **React Hook Form**: Performant form management
- **Zod 4**: TypeScript-first schema validation
- **@hookform/resolvers**: Form validation integration
- **Input OTP**: One-time password input component

### Data Visualization

- **Recharts**: Beautiful chart components
- **React Number Flow**: Animated number transitions
- **React Confetti**: Celebration animations

### Additional Libraries

- **date-fns**: Modern date utility library
- **Sharp**: High-performance image processing
- **React Dropzone**: File upload with drag & drop
- **React Intersection Observer**: Lazy loading and scroll animations
- **Embla Carousel**: Touch-friendly carousel
- **React Fast Marquee**: Smooth scrolling marquees
- **cmdk**: Command palette component
- **Sonner**: Toast notification system

### 3D & Visual Effects

- **Three.js**: 3D graphics library
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for R3F
- **Cobe**: Interactive globe visualization
- **Three Globe**: Geographic data visualization
- **Simplex Noise**: Procedural noise generation
- **tsparticles**: Particle effects

### Development Tools

- **ESLint 9**: JavaScript/TypeScript linting
- **PostCSS**: CSS processing
- **Autoprefixer**: Automatic vendor prefixing

---

## 📦 Database Schema

### Core Tables

- **users**: User accounts with authentication details
- **sessions**: Active user sessions with expiry
- **accounts**: OAuth and password provider accounts
- **verification**: Email and password reset tokens

### Application Tables

- **reading_progress**: Chapter completion tracking
- **reflections**: User reflections on chapters
- **partnerships**: Accountability partnerships
- **achievements**: Unlocked milestones and badges
- **prayer_requests**: Community prayer wall
- **prayer_interactions**: Prayer activity tracking
- **bookmarks**: Saved verses with highlights and notes
- **user_preferences**: Personalized app settings

---

## 🎯 API Routes

### Authentication
- `POST /api/auth/[...all]` - Better Auth endpoints

### Bible Content
- `GET /api/bible/chapter` - Fetch chapter content
- `GET /api/bible/versions` - List available Bible translations

### User Features
- `GET /api/profile` - User profile data
- `GET /api/profile/[id]` - Public user profiles
- `POST /api/progress` - Update reading progress
- `GET /api/progress` - Fetch user progress
- `POST /api/reflections` - Create/update reflections
- `GET /api/reflections` - Fetch chapter reflections

### Partnerships
- `GET /api/partnerships` - List partnerships
- `POST /api/partnerships` - Create partnership
- `POST /api/partnerships/invite` - Send invitation
- `DELETE /api/partnerships` - Remove partnership

### Communication
- `POST /api/email` - Send transactional emails
- `POST /api/username` - Update username

### Media
- `POST /api/upload` - File upload endpoint

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm/yarn/pnpm/bun
- **PostgreSQL** database (local or hosted)
- **Bible API Key** from [api.bible](https://scripture.api.bible/)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here

# Bible API
BIBLE_API_KEY=your-bible-api-key

# Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Walk in the Word <noreply@walkintheword.com>

# Stripe (Optional)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/walk-in-the-word-2.0.git
cd walk-in-the-word-2.0
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up the database**

```bash
# Generate database migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# (Optional) Seed initial data
npm run db:seed
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🏗️ Project Structure

```
walk-in-the-word-2.0/
├── public/                 # Static assets
│   ├── icons/             # PWA icons
│   ├── uploads/           # User uploads
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── read/         # Bible reading interface
│   │   ├── profile/      # User profiles
│   │   ├── partnerships/ # Accountability features
│   │   ├── reflections/  # Reflections page
│   │   ├── progress/     # Progress tracking
│   │   └── ...           # Auth, settings, etc.
│   ├── components/        # React components
│   │   └── ui/           # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── auth.ts       # Better Auth config
│   │   ├── auth-client.ts # Auth client
│   │   ├── db.ts         # Database connection
│   │   ├── schema.ts     # Drizzle schema
│   │   ├── bible.ts      # Bible API functions
│   │   ├── bible-utils.ts # Bible utilities
│   │   ├── email.ts      # Email functions
│   │   └── utils.ts      # General utilities
│   └── visual-edits/      # Visual editing tools
├── drizzle/               # Database migrations
├── components.json        # Shadcn config
├── drizzle.config.ts      # Drizzle ORM config
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

---

## 📱 Progressive Web App (PWA) Features

- **Offline Mode**: Continue reading even without internet
- **Install Prompt**: Native install experience on all platforms
- **Background Sync**: Sync progress when connection restored
- **Service Worker**: Caching strategies for optimal performance
- **Splash Screen**: Beautiful loading experience
- **App Icons**: Multiple sizes for all devices
- **Standalone Mode**: Full-screen app experience

---

## 🎨 Design System

### Colors
- **Primary**: Indigo/Purple gradient
- **Accent**: Complementary accent colors
- **Background**: Adaptive light/dark themes
- **Text**: High-contrast readable typography

### Typography
- **Headings**: Custom font family
- **Body**: Optimized for reading Scripture
- **Sizes**: Customizable user preferences

### Components
- Consistent design language across 50+ UI components
- Accessible keyboard navigation
- Touch-optimized mobile interactions
- Smooth animations and transitions

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Security**: HTTP-only cookies with CSRF protection
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM
- **XSS Prevention**: React's built-in protection
- **Email Verification**: Required for account activation
- **Rate Limiting**: API endpoint protection
- **HTTPS Enforcement**: Secure data transmission

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility standards

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Bible API**: Scripture content provided by [api.bible](https://scripture.api.bible/)
- **Radix UI**: Accessible component primitives
- **Vercel**: Hosting and deployment platform
- **Open Source Community**: All the amazing libraries and tools

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/walk-in-the-word-2.0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/walk-in-the-word-2.0/discussions)
- **Email**: support@walkintheword.com

---

## 🗺️ Roadmap

### Coming Soon

- [ ] Audio Bible integration
- [ ] Study notes and commentary
- [ ] Multiple reading plans
- [ ] Group study features
- [ ] Mobile native apps (iOS/Android)
- [ ] Bible study tools (concordance, dictionary)
- [ ] Verse memorization system
- [ ] Social sharing enhancements
- [ ] Multi-language support
- [ ] Advanced search with filters

---

## 📊 Stats

- **1,189** Bible chapters
- **66** Books of the Bible
- **50+** UI Components
- **100%** TypeScript coverage
- **PWA** Enabled
- **Responsive** design for all devices

---

<div align="center">

**Built with ❤️ for believers around the world**

*Walk in the Word - Read. Reflect. Grow Together.*

</div>

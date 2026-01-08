import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { authClient } from '@/lib/auth-client';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, BookOpen, MessageSquare, Award, 
  DollarSign, Bell, Settings, Shield, BarChart, FileText,
  Church, Megaphone, HelpCircle, Database, Lock
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Implement proper Better Auth server-side session check
  // For now, allowing access for development/setup
  // In production, add proper session validation here

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', section: 'main' },
    { href: '/admin/analytics', icon: BarChart, label: 'Analytics', section: 'main' },
    
    { label: 'User Management', section: 'divider' },
    { href: '/admin/users', icon: Users, label: 'All Users', section: 'users' },
    { href: '/admin/users/subscriptions', icon: DollarSign, label: 'Subscriptions', section: 'users' },
    
    { label: 'Content', section: 'divider' },
    { href: '/admin/bible', icon: BookOpen, label: 'Bible Content', section: 'content' },
    { href: '/admin/reading-plans', icon: FileText, label: 'Reading Plans', section: 'content' },
    { href: '/admin/memory-verses', icon: Award, label: 'Memory Verses', section: 'content' },
    
    { label: 'Community', section: 'divider' },
    { href: '/admin/groups', icon: Users, label: 'Small Groups', section: 'community' },
    { href: '/admin/forums', icon: MessageSquare, label: 'Forums', section: 'community' },
    { href: '/admin/testimonies', icon: Megaphone, label: 'Testimonies', section: 'community' },
    
    { label: 'Gamification', section: 'divider' },
    { href: '/admin/achievements', icon: Award, label: 'Achievements', section: 'game' },
    { href: '/admin/levels', icon: BarChart, label: 'Levels & XP', section: 'game' },
    
    { label: 'Financial', section: 'divider' },
    { href: '/admin/payments', icon: DollarSign, label: 'Payments', section: 'financial' },
    { href: '/admin/revenue', icon: BarChart, label: 'Revenue Reports', section: 'financial' },
    
    { label: 'Communication', section: 'divider' },
    { href: '/admin/notifications', icon: Bell, label: 'Notifications', section: 'comms' },
    { href: '/admin/announcements', icon: Megaphone, label: 'Announcements', section: 'comms' },
    
    { label: 'Ministry', section: 'divider' },
    { href: '/admin/churches', icon: Church, label: 'Church Accounts', section: 'ministry' },
    
    { label: 'System', section: 'divider' },
    { href: '/admin/security', icon: Shield, label: 'Security', section: 'system' },
    { href: '/admin/moderation', icon: Lock, label: 'Moderation', section: 'system' },
    { href: '/admin/support', icon: HelpCircle, label: 'Support', section: 'system' },
    { href: '/admin/database', icon: Database, label: 'Database', section: 'system' },
    { href: '/admin/settings', icon: Settings, label: 'Settings', section: 'system' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Super Admin Panel</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item, idx) => {
            if (item.section === 'divider') {
              return (
                <div key={idx} className="pt-4 pb-2">
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </h3>
                </div>
              );
            }

            const Icon = item.icon!;
            return (
              <Link
                key={item.href}
                href={item.href!}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

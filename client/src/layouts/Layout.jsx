import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Toaster } from 'react-hot-toast';
import useLiveNotifications from '../hooks/useLiveNotifications';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Bell, 
  LogOut, 
  Menu,
  Briefcase,
  Inbox,
  Brain,
  Users,
  Home,
  CheckSquare,
  AlertTriangle,
  Settings,
  ArrowLeft
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const allUsers = useAppStore(state => state.users);
  const setActiveUser = useAppStore(state => state.setActiveUser);

  // Enable live notifications
  useLiveNotifications(true);

  const navItems = [
    { name: t('layout.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('layout.projects'), path: '/projects', icon: Briefcase },
    { name: t('layout.proposals'), path: '/proposals', icon: FileText },
    { name: t('layout.compensation'), path: '/compensation', icon: Inbox },
    { name: t('layout.rrFamilies'), path: '/rr', icon: Users },
    { name: t('layout.possession'), path: '/possession', icon: Home },
    { name: t('layout.gisParcels'), path: '/gis', icon: Map },
    { name: t('layout.tasksWorkflow'), path: '/workflow/tasks', icon: CheckSquare },
    { name: t('layout.alerts'), path: '/alerts', icon: AlertTriangle },
    { name: t('layout.intelligence'), path: '/intelligence', icon: Brain },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Toaster 
        position="top-right" 
        containerStyle={{
          top: 80,
          right: 24,
        }}
        toastOptions={{
          duration: 4000,
        }}
        maxToasts={1}
      />
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 glass-panel border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-32 bg-white border-b border-gray-200 shrink-0 shadow-md relative overflow-hidden">
          <img src="/logo.jpg" alt="BHUMISETU Logo" className="h-full w-full object-contain p-2 relative z-10" />
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto pt-4 pb-4">
          <div className="px-4 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">{t('layout.govOfIndia')}</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-emerald-600 font-medium truncate">{user?.role}</p>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 shadow-sm border border-emerald-100' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-110'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 shrink-0 space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
          >
            <ArrowLeft className="mr-3 h-5 w-5 flex-shrink-0" />
            {t('layout.backToLanding')}
          </Link>
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            {t('layout.secureLogout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200 shrink-0 glass-panel shadow-sm">
          <button 
            className="text-gray-500 lg:hidden hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-end items-center space-x-4">
            {/* Removed Prototype Data banner */}
            <button className="text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            
            <div className="hidden sm:flex items-center border-l pl-4 border-gray-200">
              <select
                className="text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-700 rounded focus:ring-emerald-500 focus:border-emerald-500 py-1 pl-2 pr-8 mr-4 cursor-pointer"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>

              <div className="flex flex-col mr-3 items-end">
                <span className="text-xs text-gray-500 font-medium">{t('layout.demoUserSwitcher')}</span>
                <select 
                  className="text-sm border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 py-1 pl-2 pr-8"
                  value={user?.id || ''}
                  onChange={(e) => setActiveUser(e.target.value)}
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.role} ({u.name})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto bg-gov-light p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default Layout;

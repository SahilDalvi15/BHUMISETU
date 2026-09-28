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
  Layers,
  Inbox,
  Brain,
  Users,
  Home,
  CheckSquare,
  AlertTriangle,
  Settings,
  ArrowLeft,
  FolderOpen,
  History
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
  useLiveNotifications(false);

  const navItems = [
    { name: t('layout.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('layout.projects'), path: '/projects', icon: Briefcase },
    { name: 'Land Parcels', path: '/parcels', icon: Layers },
    { name: t('layout.proposals'), path: '/proposals', icon: FileText },
    { name: t('layout.compensation'), path: '/compensation', icon: Inbox },
    { name: t('layout.rrFamilies'), path: '/rr', icon: Users },
    { name: t('layout.possession'), path: '/possession', icon: Home },
    { name: t('layout.gisParcels'), path: '/gis', icon: Map },
    { name: t('layout.tasksWorkflow'), path: '/workflow/tasks', icon: CheckSquare },
    { name: t('layout.alerts'), path: '/alerts', icon: AlertTriangle },
    { name: t('layout.documents'), path: '/documents', icon: FolderOpen },
    { name: t('layout.auditLog'), path: '/audit', icon: History },
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
        
        <div className="p-4 border-t border-gray-200 shrink-0 space-y-4">
          {/* Mobile-visible Language and User Switcher */}
          <div className="flex flex-col space-y-3 sm:hidden">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Language</label>
              <select
                className="w-full text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-700 rounded focus:ring-emerald-500 focus:border-emerald-500 py-1.5 pl-2 pr-8 cursor-pointer"
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  setSidebarOpen(false);
                }}
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">{t('layout.demoUserSwitcher')}</label>
              <select 
                className="w-full text-sm border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 py-1.5 pl-2 pr-8"
                value={user?.id || ''}
                onChange={(e) => {
                  setActiveUser(e.target.value);
                  setSidebarOpen(false);
                }}
              >
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.role} ({u.name})</option>
                ))}
              </select>
            </div>
          </div>
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
          
          <div className="flex-1 px-4 flex justify-end items-center space-x-2 sm:space-x-4">
            <button className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white shadow-sm"></span>
            </button>
            
            <div className="hidden sm:flex items-center border-l pl-4 sm:pl-6 border-gray-200 space-x-3 sm:space-x-4">
              {/* Language Switcher */}
              <div className="relative group">
                <select
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 py-1.5 pl-4 pr-8 cursor-pointer transition-all shadow-sm"
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                  <option value="mr">MR</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 group-hover:text-gray-600">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* User Switcher */}
              <div className="relative group flex items-center">
                <div className="hidden md:flex h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center font-bold text-xs mr-2 shadow-sm border border-emerald-200">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 py-1.5 pl-3 sm:pl-4 pr-8 max-w-[140px] md:max-w-[220px] truncate cursor-pointer transition-all shadow-sm"
                    value={user?.id || ''}
                    onChange={(e) => setActiveUser(e.target.value)}
                  >
                    {allUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.role} ({u.name})</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 group-hover:text-gray-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
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

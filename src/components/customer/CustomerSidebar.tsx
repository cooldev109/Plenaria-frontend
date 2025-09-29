import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const content = {
    pt: {
      dashboard: "Painel",
      projects: "Projetos",
      consultations: "Consultas",
      courses: "Cursos",
      profile: "Perfil",
      settings: "Configurações",
      logout: "Sair",
      customer: "Cliente"
    },
    en: {
      dashboard: "Dashboard",
      projects: "Projects",
      consultations: "Consultations",
      courses: "Courses",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      customer: "Customer"
    }
  };

  const contentData = content[language];

  const navigation = [
    { name: contentData.dashboard, href: '/customer/dashboard', icon: LayoutDashboard },
    { name: contentData.projects, href: '/customer/projects', icon: FileText },
    { name: contentData.consultations, href: '/customer/consultations', icon: MessageSquare },
    { name: contentData.courses, href: '/customer/courses', icon: BookOpen },
    { name: contentData.profile, href: '/customer/profile', icon: User },
    { name: contentData.settings, href: '/customer/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 bottom-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:top-0 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500">{contentData.customer}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>{contentData.logout}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSidebar;

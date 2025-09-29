import React, { useState } from 'react';
import CustomerSidebar from './CustomerSidebar';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Menu className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Menu</span>
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        {/* Sidebar */}
        <CustomerSidebar 
          isOpen={true} 
          onClose={() => {}} 
        />
        
        {/* Main content */}
        <div className="flex-1">
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Sidebar */}
        <CustomerSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main content */}
        <main className="py-6 px-4 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;


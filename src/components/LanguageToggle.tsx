import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'en' ? 'EN' : 'PT'}
      </span>
    </Button>
  );
};

export default LanguageToggle;


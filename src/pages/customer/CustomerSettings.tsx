import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Settings, Bell, Globe, Shield, Palette, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';

const CustomerSettings: React.FC = () => {
  const { language, t, setLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: 'pt',
    timezone: 'America/Sao_Paulo',
    theme: 'light'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const content = {
    pt: {
      title: "Configurações",
      notifications: "Notificações",
      language: "Idioma",
      privacy: "Privacidade",
      appearance: "Aparência",
      emailNotifications: "Notificações por Email",
      smsNotifications: "Notificações por SMS",
      pushNotifications: "Notificações Push",
      timezone: "Fuso Horário",
      theme: "Tema",
      save: "Salvar",
      loading: "Salvando...",
      success: "Configurações salvas com sucesso!",
      portuguese: "Português",
      english: "English",
      light: "Claro",
      dark: "Escuro",
      system: "Sistema"
    },
    en: {
      title: "Settings",
      notifications: "Notifications",
      language: "Language",
      privacy: "Privacy",
      appearance: "Appearance",
      emailNotifications: "Email Notifications",
      smsNotifications: "SMS Notifications",
      pushNotifications: "Push Notifications",
      timezone: "Timezone",
      theme: "Theme",
      save: "Save",
      loading: "Saving...",
      success: "Settings saved successfully!",
      portuguese: "Português",
      english: "English",
      light: "Light",
      dark: "Dark",
      system: "System"
    }
  };

  const contentData = content[language];

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('customerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'pt' | 'en');
    setSettings(prev => ({
      ...prev,
      language: newLanguage
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('customerSettings', JSON.stringify(settings));
      
      // Here you would typically save to the backend
      // await fetch('/api/customer/settings', { method: 'POST', body: JSON.stringify(settings) });
      
      setSuccess(contentData.success);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{contentData.title}</h1>
        <p className="text-gray-600 mt-1">
          {language === 'pt' 
            ? 'Personalize sua experiência e configurações'
            : 'Customize your experience and settings'
          }
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">{contentData.notifications}</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{contentData.emailNotifications}</h3>
                <p className="text-sm text-gray-500">
                  {language === 'pt' ? 'Receba notificações por email' : 'Receive email notifications'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{contentData.smsNotifications}</h3>
                <p className="text-sm text-gray-500">
                  {language === 'pt' ? 'Receba notificações por SMS' : 'Receive SMS notifications'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{contentData.pushNotifications}</h3>
                <p className="text-sm text-gray-500">
                  {language === 'pt' ? 'Receba notificações push' : 'Receive push notifications'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Language & Appearance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">{contentData.language}</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {contentData.language}
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pt">{contentData.portuguese}</option>
                <option value="en">{contentData.english}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {contentData.timezone}
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                <option value="America/New_York">New York (GMT-5)</option>
                <option value="Europe/London">London (GMT+0)</option>
                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {contentData.theme}
              </label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">{contentData.light}</option>
                <option value="dark">{contentData.dark}</option>
                <option value="system">{contentData.system}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? contentData.loading : contentData.save}
        </Button>
      </div>
    </div>
  );
};

export default CustomerSettings;


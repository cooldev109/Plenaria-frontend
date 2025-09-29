import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const LawyerDrafts: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const content = {
    pt: {
      title: "Rascunhos Jurídicos",
      subtitle: "Gerencie seus rascunhos e documentos",
      comingSoon: "Em breve"
    },
    en: {
      title: "Legal Drafts",
      subtitle: "Manage your drafts and documents",
      comingSoon: "Coming Soon"
    }
  };

  const contentData = content[language];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{contentData.title}</h1>
      <p className="text-gray-500 text-center max-w-md mb-4">{contentData.subtitle}</p>
      <div className="mt-6 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
        {contentData.comingSoon}
      </div>
    </div>
  );
};

export default LawyerDrafts;



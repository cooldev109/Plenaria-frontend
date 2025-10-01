import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { customerLawyerService } from '../../services/customer';
import { Search, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
// Note: Select components removed as specialization filter is not available

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  role: string;
  lawyerStatus: string;
  isActive: boolean;
  createdAt: string;
}

interface LawyerSelectorProps {
  selectedLawyerId: string | null;
  onLawyerSelect: (lawyerId: string | null, lawyerName?: string | null) => void;
  onClose: () => void;
}

const LawyerSelector: React.FC<LawyerSelectorProps> = ({
  selectedLawyerId,
  onLawyerSelect,
  onClose
}) => {
  const { language } = useLanguage();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const content = {
    pt: {
      title: "Escolher Advogado",
      subtitle: "Selecione um advogado para sua consulta ou deixe em branco para qualquer advogado disponível",
      searchPlaceholder: "Buscar advogados...",
      selectLawyer: "Selecionar Advogado",
      anyLawyer: "Qualquer Advogado Disponível",
      confirm: "Confirmar",
      cancel: "Cancelar",
      noLawyers: "Nenhum advogado encontrado",
      loading: "Carregando advogados...",
      error: "Erro ao carregar advogados"
    },
    en: {
      title: "Choose Lawyer",
      subtitle: "Select a lawyer for your consultation or leave blank for any available lawyer",
      searchPlaceholder: "Search lawyers...",
      selectLawyer: "Select Lawyer",
      anyLawyer: "Any Available Lawyer",
      confirm: "Confirm",
      cancel: "Cancel",
      noLawyers: "No lawyers found",
      loading: "Loading lawyers...",
      error: "Error loading lawyers"
    }
  };

  const contentData = content[language];

  // Note: Specializations removed as they don't exist in the current User model

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const data = await customerLawyerService.getLawyers({
        search: searchTerm || undefined
      });
      setLawyers(data.data.lawyers || []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [searchTerm]);

  const handleLawyerSelect = (lawyerId: string | null, lawyerName?: string | null) => {
    onLawyerSelect(lawyerId, lawyerName);
  };

  const handleConfirm = () => {
    onClose();
  };

  // Note: renderStars function removed as rating field doesn't exist in User model

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{contentData.title}</h3>
        <p className="text-sm text-gray-600">{contentData.subtitle}</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={contentData.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Specialization filter removed as specialization field doesn't exist in User model */}
      </div>

      {/* Any Available Lawyer Option */}
      <Card 
        className={`cursor-pointer transition-colors ${
          selectedLawyerId === null ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleLawyerSelect(null, null)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{contentData.anyLawyer}</h4>
              <p className="text-sm text-gray-500">
                {language === 'pt' 
                  ? 'O primeiro advogado disponível responderá sua consulta'
                  : 'The first available lawyer will respond to your consultation'
                }
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                checked={selectedLawyerId === null}
                onChange={() => handleLawyerSelect(null, null)}
                className="h-4 w-4 text-blue-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lawyers List */}
      <div className="max-h-96 overflow-y-auto space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">{contentData.loading}</p>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{contentData.noLawyers}</p>
          </div>
        ) : (
          lawyers.map((lawyer) => (
            <Card
              key={lawyer._id}
              className={`cursor-pointer transition-colors ${
                selectedLawyerId === lawyer._id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleLawyerSelect(lawyer._id, lawyer.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {lawyer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{lawyer.name}</h4>
                    <p className="text-sm text-gray-500">{lawyer.email}</p>
                    
                    {/* Lawyer Status */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        variant={lawyer.lawyerStatus === 'approved' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {lawyer.lawyerStatus === 'approved' ? 'Verified' : lawyer.lawyerStatus}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {language === 'pt' ? 'Advogado' : 'Lawyer'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedLawyerId === lawyer._id}
                      onChange={() => handleLawyerSelect(lawyer._id, lawyer.name)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          {contentData.cancel}
        </Button>
        <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
          {contentData.confirm}
        </Button>
      </div>
    </div>
  );
};

export default LawyerSelector;

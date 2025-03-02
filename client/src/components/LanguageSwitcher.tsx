import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'no' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="fixed top-4 right-4"
    >
      {i18n.language === 'en' ? '🇳🇴 Norsk' : '🇬🇧 English'}
    </Button>
  );
}

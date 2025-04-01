
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { id: Language; name: string; flag: string }[] = [
    { id: 'pt', name: 'Português', flag: '🇧🇷' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2" aria-label="Select language">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            className={`cursor-pointer flex items-center gap-2 ${lang.id === language ? 'font-medium bg-accent text-accent-foreground' : ''}`}
            onClick={() => setLanguage(lang.id)}
          >
            <span className="text-base mr-1">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

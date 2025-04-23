
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Languages, Settings, Sun, Moon } from "lucide-react"; // Changed 'Language' to 'Languages'
import { Switch } from "@/components/ui/switch";

const currencies = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real" },
];

export default function PreferencesSettings() {
  const { language, setLanguage } = useLanguage();
  const [currency, setCurrency] = useState("USD");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Language</Label>
            <div className="flex items-center space-x-4">
              <Languages className="w-4 h-4 text-muted-foreground" /> {/* Changed from 'Language' */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Currency</Label>
            <div className="flex items-center space-x-4">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Theme</Label>
            <div className="flex items-center space-x-4">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
              <div className="flex items-center space-x-2">
                <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                <span className="text-sm text-muted-foreground">
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from './SearchBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ } from "lucide-react"

interface CardLibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSet: string | null;
  onSetChange: (value: string | null) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  availableSets: { id: string; name: string }[];
  sortBy?: string;
  onSortChange: (value: string) => void;
}

const CardLibraryHeader = ({
  searchQuery,
  onSearchChange,
  selectedSet,
  onSetChange,
  viewMode,
  onViewModeChange,
  availableSets,
  sortBy = 'card_number',
  onSortChange,
}: CardLibraryHeaderProps) => {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'card_number', label: t('cardNumber') },
    { value: 'name', label: t('name') },
    { value: 'cost', label: t('cost') },
    { value: 'power', label: t('power') },
    { value: 'life', label: t('life') },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowDownAZ className="mr-2 h-4 w-4" />
            {sortOptions.find(option => option.value === sortBy)?.label || t('sort')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {sortOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Select
        value={selectedSet || "all"}
        onValueChange={(value) => onSetChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t('selectSet')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allSets')}</SelectItem>
          {availableSets.map(({ id, name }) => (
            <SelectItem key={id} value={id}>{`${id} - ${name}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Tabs defaultValue={viewMode} className="w-fit">
        <TabsList>
          <TabsTrigger value="grid" onClick={() => onViewModeChange('grid')}>
            {t('grid')}
          </TabsTrigger>
          <TabsTrigger value="list" onClick={() => onViewModeChange('list')}>
            {t('list')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CardLibraryHeader;

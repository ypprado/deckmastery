
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from './SearchBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CardLibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSet: string | null;
  onSetChange: (value: string | null) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  availableSets: { id: string; name: string }[];
}

const CardLibraryHeader = ({
  searchQuery,
  onSearchChange,
  selectedSet,
  onSetChange,
  viewMode,
  onViewModeChange,
  availableSets,
}: CardLibraryHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>
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

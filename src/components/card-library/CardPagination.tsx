
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CardPagination = ({ currentPage, totalPages, onPageChange }: CardPaginationProps) => {
  const { t } = useLanguage();

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={goToPrevPage} 
            className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        
        <div className="hidden md:flex">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            if (totalPages <= 5) {
              return (
                <PaginationItem key={i + 1}>
                  <Button 
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="icon"
                    className="w-10 h-10"
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                </PaginationItem>
              );
            }
            
            let pageNum;
            if (currentPage <= 3) {
              if (i < 4) {
                pageNum = i + 1;
              } else {
                pageNum = totalPages;
              }
            } else if (currentPage > totalPages - 3) {
              if (i === 0) {
                pageNum = 1;
              } else {
                pageNum = totalPages - 4 + i;
              }
            } else {
              if (i === 0) {
                pageNum = 1;
              } else if (i === 4) {
                pageNum = totalPages;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }
            
            return (
              <PaginationItem key={pageNum}>
                <Button 
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  className="w-10 h-10"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              </PaginationItem>
            );
          })}
        </div>
        
        <PaginationItem>
          <PaginationNext 
            onClick={goToNextPage} 
            className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CardPagination;

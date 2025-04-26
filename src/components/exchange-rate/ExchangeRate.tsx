
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

export const ExchangeRate = () => {
  const { toast } = useToast();

  const { data, isError } = useExchangeRate();

  if (isError || !data?.rate) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center text-sm text-muted-foreground">
      <DollarSign className="h-4 w-4 mr-1" />
      <span>1 USD = {Number(data.rate).toFixed(2)} BRL</span>
    </div>
  );
};

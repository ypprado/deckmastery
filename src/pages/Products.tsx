
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, Package, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Products = () => {
  const { t } = useLanguage();
  
  const products = [
    {
      title: t('basicMembership'),
      description: t('basicMembershipDescription'),
      price: "Free",
      icon: Box,
    },
    {
      title: t('proMembership'),
      description: t('proMembershipDescription'),
      price: "$9.99/month",
      icon: Package,
    },
    {
      title: t('teamPackage'),
      description: t('teamPackageDescription'),
      price: "$29.99/month",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">{t('ourProducts')}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.title} className="flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <product.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{product.title}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold text-primary">{product.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{t('getStartedProducts')}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;


import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Legal = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
      {/* Terms of Use */}
      <section>
        <h1 className="text-3xl font-bold mb-6">{t('termsOfUse')}</h1>
        <Card className="p-6 space-y-4">
          <p>{t('termsDescription')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 13 years old to use this service</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>Your content must not violate any laws or rights</li>
            <li>We may terminate accounts that violate our terms</li>
            <li>We are not responsible for any losses related to service use</li>
          </ul>
        </Card>
      </section>

      {/* Privacy Policy */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t('privacyPolicy')}</h2>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('dataCollection')}</h3>
            <p className="text-muted-foreground">{t('dataCollectionList')}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t('userRights')}</h3>
            <p className="text-muted-foreground">{t('userRightsList')}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t('dataUsage')}</h3>
            <p className="text-muted-foreground">
              {t('dataUsageDescription')}
            </p>
          </div>
        </Card>
      </section>

      {/* Cookie Policy */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t('cookiePolicy')}</h2>
        <Card className="p-6 space-y-4">
          <p className="text-muted-foreground">
            {t('cookieDescription')}
          </p>
          <p className="text-muted-foreground">
            {t('cookieTypes')}
          </p>
        </Card>
      </section>
    </div>
  );
};

export default Legal;


import { Card } from "@/components/ui/card";

const Legal = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
      {/* Terms of Use */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <Card className="p-6 space-y-4">
          <p>By using DeckMastery, you agree to these terms:</p>
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
        <h2 className="text-2xl font-bold mb-6">Privacy Policy (LGPD Compliant)</h2>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Collection</h3>
            <p className="text-muted-foreground">We collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Account information (name, email)</li>
              <li>Usage data (deck builds, card collections)</li>
              <li>Device information (browser type, IP address)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Your Rights (LGPD)</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Right to access your personal data</li>
              <li>Right to correct incomplete or inaccurate data</li>
              <li>Right to delete your personal data</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Data Usage</h3>
            <p className="text-muted-foreground">
              We use your data to provide and improve our services, communicate with you,
              and ensure platform security. We do not sell your personal information to third parties.
            </p>
          </div>
        </Card>
      </section>

      {/* Cookie Policy */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Cookie Policy</h2>
        <Card className="p-6 space-y-4">
          <p className="text-muted-foreground">
            We use cookies and similar technologies for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Essential functions (authentication, preferences)</li>
            <li>Analytics (understanding user behavior)</li>
            <li>Performance optimization</li>
            <li>Marketing (when consent is provided)</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            You can control cookie preferences through your browser settings.
          </p>
        </Card>
      </section>
    </div>
  );
};

export default Legal;

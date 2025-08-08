
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          <Card className="border-orange-100">
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using KannadaMatch, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. User Eligibility</h2>
                <p className="text-gray-600">
                  You must be at least 18 years old to use this service. By using KannadaMatch, 
                  you represent and warrant that you are at least 18 years of age.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Profile Information</h2>
                <p className="text-gray-600">
                  You agree to provide accurate, current, and complete information about yourself. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Prohibited Activities</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Creating fake or misleading profiles</li>
                  <li>Harassing or threatening other users</li>
                  <li>Sharing inappropriate content</li>
                  <li>Commercial solicitation</li>
                  <li>Violating any applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Privacy</h2>
                <p className="text-gray-600">
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Termination</h2>
                <p className="text-gray-600">
                  We reserve the right to terminate or suspend your account at our sole discretion, 
                  without notice, for conduct that we believe violates these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at 
                  support@kannadamatch.com
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;

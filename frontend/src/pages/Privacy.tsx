
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          <Card className="border-yellow-200">
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
                <p className="text-gray-600 mb-3">We collect information you provide directly to us, such as:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Personal details (name, age, location)</li>
                  <li>Contact information (email, phone number)</li>
                  <li>Profile information and photos</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>To provide and maintain our services</li>
                  <li>To match you with compatible profiles</li>
                  <li>To communicate with you about our services</li>
                  <li>To improve our platform and user experience</li>
                  <li>To ensure safety and security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Information Sharing</h2>
                <p className="text-gray-600">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We only share information as necessary to provide our services or as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Rights</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Access your personal information</li>
                  <li>Update or correct your information</li>
                  <li>Delete your account and data</li>
                  <li>Control communication preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy, please contact us at 
                  privacy@publicmatrimony.com
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

export default Privacy;

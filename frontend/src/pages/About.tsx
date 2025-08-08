
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Public Matrimony</h1>
            <p className="text-lg text-gray-600">
              India's most trusted matrimonial platform for finding your perfect life partner
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To help individuals find their perfect life partner while preserving 
                  cultural values and traditions. We believe every person deserves to find love and 
                  companionship in a safe, respectful environment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Community</h3>
                <p className="text-gray-600">
                  With over 10 lakh verified profiles from across India and worldwide, 
                  we've helped thousands of couples find their soulmates. Our community spans 
                  all professions, backgrounds, and locations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy & Safety</h3>
                <p className="text-gray-600">
                  Your privacy is our priority. We use advanced security measures to protect 
                  your personal information and ensure all profiles are manually verified 
                  before being published.
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Success Stories</h3>
                <p className="text-gray-600">
                  Over 50,000 happy couples have found their life partners through Public Matrimony. 
                  Their success stories inspire us to continue connecting hearts and building 
                  beautiful relationships.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of singles who have found love through our platform
            </p>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 px-8 py-3 text-lg">
                Join Free Today
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

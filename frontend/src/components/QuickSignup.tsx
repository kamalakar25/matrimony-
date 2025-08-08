
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const QuickSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    lookingFor: "",
    religion: "",
    community: "",
    mobile: ""
  });

  const appVersion = "v2.1.3"; // App version

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="text-yellow-500 mr-2" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Start Your Journey Today
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Quick registration - Find your perfect match in minutes
            </p>
            <div className="text-xs text-gray-500 mt-2">App Version: {appVersion}</div>
          </div>

          <Card className="border-yellow-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-t-lg">
              <CardTitle className="text-center text-2xl flex items-center justify-center">
                <User className="mr-2" size={24} />
                Register Now - It's Free!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <div>
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-yellow-200 focus:border-yellow-400"
                  />
                </div>
                
                <div>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={formData.lookingFor} onValueChange={(value) => handleInputChange('lookingFor', value)}>
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                      <SelectValue placeholder="Looking For" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                      <SelectValue placeholder="Religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                      <SelectItem value="buddhist">Buddhist</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={formData.community} onValueChange={(value) => handleInputChange('community', value)}>
                    <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                      <SelectValue placeholder="Community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lingayat">Lingayat</SelectItem>
                      <SelectItem value="brahmin">Brahmin</SelectItem>
                      <SelectItem value="vokkaliga">Vokkaliga</SelectItem>
                      <SelectItem value="kuruba">Kuruba</SelectItem>
                      <SelectItem value="devanga">Devanga</SelectItem>
                      <SelectItem value="naidu">Naidu</SelectItem>
                      <SelectItem value="reddy">Reddy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="border-yellow-200 focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="text-center">
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-lg px-12 py-6 font-semibold">
                    Register Now
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-3">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickSignup;

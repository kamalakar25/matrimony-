import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "", // Added mobile field
    gender: "",
    lookingFor: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    religion: "",
    community: "",
    motherTongue: "",
    maritalStatus: "",
    height: "",
    education: "",
    occupation: "",
    income: "",
    city: "",
    state: "",
    otp: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Added for success message

  const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Hospet"
  ];

  const appVersion = "v2.1.3";

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'city') {
      if (value.length > 0) {
        const filtered = indianCities.filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10);
        setFilteredCities(filtered);
        setShowCityDropdown(true);
      } else {
        setShowCityDropdown(false);
      }
    }
  };

  const selectCity = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setShowCityDropdown(false);
  };

  const sendOTP = async (retries = 3, delay = 2000) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(formData.email)) {
      setIsLoading(true);
      setError(null);
      console.log('Sending OTP request for email:', formData.email);
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch(`${BASE_URL}/api/send-email-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
          });
          
          console.log(`OTP request attempt ${attempt} status:`, response.status, 'Status Text:', response.statusText);
          const data = await response.json();
          console.log('OTP response data:', data);
          if (response.ok) {
            setOtpSent(true);
            setOtpButtonDisabled(true);
            setIsLoading(false);
            alert(`${data.message}\nCheck backend console for OTP (development only).`);
            return;
          } else {
            setError(data.error || 'Failed to send OTP');
            console.error('OTP send error:', data.error);
          }
        } catch (error) {
          console.error(`Frontend error sending OTP (attempt ${attempt}):`, error.message, error);
          if (attempt === retries) {
            setError('Failed to connect to server. Please ensure the backend server is running on http://localhost:5000 and check your network.');
          } else {
            console.log(`Retrying OTP request in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      setIsLoading(false);
    } else {
      setError('Please enter a valid email address');
      console.warn('Invalid email:', formData.email);
    }
  };

  const verifyOTP = async () => {
    if (formData.otp.length === 6 && /^\d{6}$/.test(formData.otp)) {
      setIsLoading(true);
      setError(null);
      console.log('Verifying OTP for email:', formData.email, 'OTP:', formData.otp);
      try {
        const response = await fetch(`${BASE_URL}/api/verify-email-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        });
        
        console.log('OTP verification status:', response.status, 'Status Text:', response.statusText);
        const data = await response.json();
        console.log('OTP verification response:', data);
        if (response.ok) {
          console.log('OTP verified successfully:', data);
          return true;
        } else {
          setError(data.error || 'Invalid OTP');
          console.error('OTP verification error:', data.error);
          return false;
        }
      } catch (error) {
        console.error('Frontend error verifying OTP:', error.message, error);
        setError('Failed to verify OTP. Please ensure the backend server is running and check your network.');
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please enter a valid 6-digit OTP');
      console.warn('Invalid OTP:', formData.otp);
      return false;
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.name &&
          formData.email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          formData.mobile &&
          /^[\d+\-\s]{10,15}$/.test(formData.mobile) &&
          formData.gender &&
          formData.lookingFor
        );
      case 2:
        return formData.birthDay && formData.birthMonth && formData.birthYear && formData.height && formData.maritalStatus;
      case 3:
        return formData.religion && formData.community && formData.motherTongue;
      case 4:
        return formData.education && formData.occupation && formData.income && formData.city && formData.state;
      case 5:
        return (
          formData.email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          (otpSent ? formData.otp.length === 6 && /^\d{6}$/.test(formData.otp) : true) &&
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (isStepValid()) {
      setIsLoading(true);
      setError(null);
      try {
        if (otpSent) {
          const isOtpValid = await verifyOTP();
          if (!isOtpValid) {
            setIsLoading(false);
            return;
          }
        }

        const submitButton = document.querySelector('[data-submit-btn]');
        if (submitButton) {
          submitButton.textContent = 'Creating Profile...';
        }

        const profileData = {
          personalInfo: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            gender: formData.gender,
            lookingFor: formData.lookingFor,
          },
          demographics: {
            dateOfBirth: `${formData.birthDay}-${formData.birthMonth}-${formData.birthYear}`,
            height: formData.height,
            maritalStatus: formData.maritalStatus,
            religion: formData.religion,
            community: formData.community,
            motherTongue: formData.motherTongue,
          },
          professionalInfo: {
            education: formData.education,
            occupation: formData.occupation,
            income: formData.income,
          },
          location: {
            city: formData.city,
            state: formData.state,
          },
          credentials: {
            password: formData.password,
            rememberMe: formData.rememberMe,
          },
          subscription: 'free',
          profileCreatedAt: new Date().toISOString(),
          appVersion: appVersion,
        };

        console.log('Submitting profile data:', profileData);

        const response = await fetch(`${BASE_URL}/api/create-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        const data = await response.json();
        
        if (response.ok) {
          setSuccess(`🎉 Congratulations ${formData.name}! Your profile has been created successfully! You can now log in.`);
          console.log('Profile created successfully:', data);
          // Reset form after success
          setFormData({
            name: "",
            email: "",
            mobile: "",
            gender: "",
            lookingFor: "",
            birthDay: "",
            birthMonth: "",
            birthYear: "",
            religion: "",
            community: "",
            motherTongue: "",
            maritalStatus: "",
            height: "",
            education: "",
            occupation: "",
            income: "",
            city: "",
            state: "",
            otp: "",
            password: "",
            confirmPassword: "",
            rememberMe: false,
          });
          setStep(1);
          setOtpSent(false);
          setOtpButtonDisabled(false);
        } else {
          throw new Error(data.error || 'Failed to create profile');
        }
      } catch (error) {
        console.error('Frontend error creating profile:', error.message, error);
        setError(error.message || 'Failed to create profile. Please ensure the backend server is running and try again.');
      } finally {
        const submitButton = document.querySelector('[data-submit-btn]');
        if (submitButton) {
          submitButton.textContent = 'Submit ✅';
        }
        setIsLoading(false);
      }
    } else {
      setError('Please fill in all required fields correctly.');
      console.warn('Form validation failed:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-orange-100 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Public Matrimony</CardTitle>
              <CardDescription>Step {step} of 5 - Create your profile</CardDescription>
              <div className="text-xs text-gray-500 mb-2">App Version: {appVersion}</div>
              <div className="flex items-center justify-center mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      i <= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {i}
                    </div>
                    {i < 5 && <div className={`w-6 h-0.5 ${i < step ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="Enter your mobile number"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lookingFor">Looking For</Label>
                    <Select value={formData.lookingFor} onValueChange={(value) => handleInputChange('lookingFor', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Looking for" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Date of Birth</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={formData.birthDay} onValueChange={(value) => handleInputChange('birthDay', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.birthMonth} onValueChange={(value) => handleInputChange('birthMonth', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                            <SelectItem key={month} value={String(i + 1).padStart(2, '0')}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.birthYear} onValueChange={(value) => handleInputChange('birthYear', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 50 }, (_, i) => (
                            <SelectItem key={2005 - i} value={String(2005 - i)}>
                              {2005 - i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Select value={formData.height} onValueChange={(value) => handleInputChange('height', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4.6-4.8">4'6" - 4'8"</SelectItem>
                        <SelectItem value="4.9-4.11">4'9" - 4'11"</SelectItem>
                        <SelectItem value="5.0-5.2">5'0" - 5'2"</SelectItem>
                        <SelectItem value="5.3-5.5">5'3" - 5'5"</SelectItem>
                        <SelectItem value="5.6-5.8">5'6" - 5'8"</SelectItem>
                        <SelectItem value="5.9-5.11">5'9" - 5'11"</SelectItem>
                        <SelectItem value="6.0-6.2">6'0" - 6'2"</SelectItem>
                        <SelectItem value="6.3+">6'3" and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never-married">Never Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="religion">Religion</Label>
                    <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select religion" />
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
                    <Label htmlFor="community">Community</Label>
                    <Select value={formData.community} onValueChange={(value) => handleInputChange('community', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select community" />
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
                    <Label htmlFor="motherTongue">Mother Tongue</Label>
                    <Select value={formData.motherTongue} onValueChange={(value) => handleInputChange('motherTongue', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select mother tongue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kannada">Kannada</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="malayalam">Malayalam</SelectItem>
                        <SelectItem value="marathi">Marathi</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="professional">Professional Degree</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Select value={formData.occupation} onValueChange={(value) => handleInputChange('occupation', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software-engineer">Software Engineer</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="government">Government Service</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="income">Annual Income</Label>
                    <Select value={formData.income} onValueChange={(value) => handleInputChange('income', value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-5">₹2-5 Lakhs</SelectItem>
                        <SelectItem value="5-10">₹5-10 Lakhs</SelectItem>
                        <SelectItem value="10-15">₹10-15 Lakhs</SelectItem>
                        <SelectItem value="15-25">₹15-25 Lakhs</SelectItem>
                        <SelectItem value="25-50">₹25-50 Lakhs</SelectItem>
                        <SelectItem value="50+">₹50+ Lakhs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        className="border-orange-200 focus:border-orange-400"
                        onFocus={() => {
                          if (formData.city.length > 0) {
                            const filtered = indianCities.filter(city => 
                              city.toLowerCase().includes(formData.city.toLowerCase())
                            ).slice(0, 10);
                            setFilteredCities(filtered);
                            setShowCityDropdown(true);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowCityDropdown(false), 200);
                        }}
                      />
                      {showCityDropdown && filteredCities.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredCities.map((city, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm"
                              onClick={() => selectCity(city)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className="border-orange-200 focus:border-orange-400">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className="border-orange-200 focus:border-orange-400"
                      disabled={otpSent || isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      🔒 Your email stays secure and private
                    </p>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => sendOTP()}
                      disabled={otpButtonDisabled || isLoading || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
                    >
                      {isLoading ? 'Sending...' : 'Verify Your Email'}
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      We'll send an OTP to verify your email
                    </p>
                  </div>

                  {otpSent && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <Input
                            id="otp"
                            value={formData.otp}
                            onChange={(e) => handleInputChange('otp', e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="border-orange-200 focus:border-orange-400 text-center font-mono text-lg"
                            maxLength={6}
                            disabled={isLoading}
                          />
                        </div>
                        <Button 
                          onClick={verifyOTP}
                          variant="outline" 
                          className="h-10"
                          disabled={isLoading || formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)}
                        >
                          {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                      </div>

                      <p className="text-xs text-center text-gray-500">
                        Didn't receive OTP? <button className="text-orange-600 hover:underline" onClick={() => {setOtpButtonDisabled(false); sendOTP();}} disabled={isLoading}>Resend</button>
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="password">Create Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Create password"
                      className="border-orange-200 focus:border-orange-400"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Re-enter Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Re-enter password"
                      className="border-orange-200 focus:border-orange-400"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                      className="accent-orange-500 w-4 h-4"
                      disabled={isLoading}
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-gray-700">
                      Remember me
                    </Label>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep} disabled={isLoading}>
                    ⬅ Back
                  </Button>
                )}
                {step < 5 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid() || isLoading}
                    className={`ml-auto bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC300] hover:to-[#FF8C00] text-white font-semibold rounded-md px-6 py-2 transition duration-300 ${
                      !isStepValid() || isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Continue ➡
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    data-submit-btn
                    className="ml-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-md px-6 py-2"
                    disabled={!isStepValid() || isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Submit ✅'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
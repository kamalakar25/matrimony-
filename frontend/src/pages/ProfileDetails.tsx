import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Camera, LogOut, Pencil, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ProfileDetails() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editableSections, setEditableSections] = useState({
    basic: false,
    religion: false,
    professional: false,
    family: false,
    hobbies: false,
    horoscope: false,
  });
  const [horoscopeGenerated, setHoroscopeGenerated] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);
  const [familyTree, setFamilyTree] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    details: '',
  });
  const [addingMember, setAddingMember] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication and load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser?.profileId) {
          throw new Error('Please log in to view your profile');
        }

        // Transform backend data to match frontend profile structure
        const transformedProfile = {
          profileId: loggedInUser.profileId || 'KM' + Date.now(),
          name:
            loggedInUser.name || loggedInUser.personalInfo?.name || 'Unknown',
          age: loggedInUser.dateOfBirth
            ? calculateAge(loggedInUser.dateOfBirth)
            : 'Not specified',
          height:
            loggedInUser.height ||
            loggedInUser.demographics?.height ||
            'Not specified',
          location:
            loggedInUser.city && loggedInUser.state
              ? `${loggedInUser.city}, ${loggedInUser.state}`
              : loggedInUser.location?.city && loggedInUser.location?.state
              ? `${loggedInUser.location.city}, ${loggedInUser.location.state}`
              : 'Not specified',
          profession:
            loggedInUser.occupation ||
            loggedInUser.professionalInfo?.occupation ||
            'Not specified',
          religion:
            loggedInUser.religion ||
            loggedInUser.demographics?.religion ||
            'Not specified',
          caste:
            loggedInUser.community ||
            loggedInUser.demographics?.community ||
            'Not specified',
          education:
            loggedInUser.education ||
            loggedInUser.professionalInfo?.education ||
            'Not specified',
          family: loggedInUser.family ||
            loggedInUser.familyInfo || {
              father: 'Not specified',
              mother: 'Not specified',
            },
          hobbies:
            loggedInUser.hobbies ||
            loggedInUser.personalInfo?.hobbies ||
            'Not specified',
          dob: loggedInUser.dateOfBirth
            ? formatDate(loggedInUser.dateOfBirth)
            : 'Not specified',
          tob:
            loggedInUser.timeOfBirth ||
            loggedInUser.demographics?.timeOfBirth ||
            'Not specified',
          pob:
            loggedInUser.placeOfBirth ||
            loggedInUser.demographics?.placeOfBirth ||
            loggedInUser.city ||
            'Not specified',
          language:
            loggedInUser.motherTongue ||
            loggedInUser.demographics?.motherTongue ||
            'Not specified',
          chartStyle:
            loggedInUser.chartStyle ||
            loggedInUser.demographics?.chartStyle ||
            'South Indian',
          email:
            loggedInUser.email ||
            loggedInUser.personalInfo?.email ||
            'Not specified',
          mobile:
            loggedInUser.mobile ||
            loggedInUser.personalInfo?.mobile ||
            'Not specified',
          gender:
            loggedInUser.gender ||
            loggedInUser.personalInfo?.gender ||
            'Not specified',
          lookingFor:
            loggedInUser.lookingFor ||
            loggedInUser.personalInfo?.lookingFor ||
            'Not specified',
          maritalStatus:
            loggedInUser.maritalStatus ||
            loggedInUser.demographics?.maritalStatus ||
            'Not specified',
          income:
            loggedInUser.income ||
            loggedInUser.professionalInfo?.income ||
            'Not specified',
          subscription: loggedInUser.subscription || { current: 'free' },
        };

        setProfile(transformedProfile);
        setFamilyTree([
          {
            name: 'Father',
            relation: 'Father',
            details: transformedProfile.family.father,
          },
          {
            name: 'Mother',
            relation: 'Mother',
            details: transformedProfile.family.mother,
          },
          ...(loggedInUser.familyTree || []),
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err.message || 'Failed to load user data');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const calculateAge = (dateOfBirth) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    } catch (e) {
      return 'Not specified';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch (e) {
      return 'Not specified';
    }
  };

  const generateHoroscope = () => {
    setHoroscopeLoading(true);
    setTimeout(() => {
      const mockResponse = {
        compatibility: '85%',
        luckyNumbers: [3, 7, 21, 33],
        luckyColors: ['Blue', 'Green', 'Yellow'],
        favorableTime: 'Morning 6–8 AM',
        message:
          'This is a favorable time for new beginnings and relationships.',
      };
      setHoroscopeData(mockResponse);
      setHoroscopeGenerated(true);
      setHoroscopeLoading(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleFamilyChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      family: { ...prev.family, [field]: value },
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setUpdating(true);
    try {
      // Transform frontend profile data to match backend userSchema
      const updatedData = {
        personalInfo: {
          name: profile.name,
          email: profile.email,
          mobile: profile.mobile,
          gender: profile.gender,
          lookingFor: profile.lookingFor,
        },
        demographics: {
          dateOfBirth: profile.dob.includes('/')
            ? new Date(profile.dob.split('/').reverse().join('-')).toISOString()
            : profile.dob,
          height: profile.height,
          maritalStatus: profile.maritalStatus,
          religion: profile.religion,
          community: profile.caste,
          motherTongue: profile.language,
          timeOfBirth: profile.tob,
          placeOfBirth: profile.pob,
          chartStyle: profile.chartStyle,
        },
        professionalInfo: {
          education: profile.education,
          occupation: profile.profession,
          income: profile.income,
        },
        location: {
          city: profile.location.split(', ')[0] || profile.pob,
          state: profile.location.split(', ')[1] || 'Not specified',
        },
        family: profile.family,
        hobbies: profile.hobbies,
      };

      const response = await axios.put(
        `${BASE_URL}/api/update-profile`,
        {
          profileId: profile.profileId,
          updatedData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );

      if (response.status === 200) {
        // Update localStorage with new data
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('loggedInUser') || '{}'),
          ...updatedData.personalInfo,
          ...updatedData.demographics,
          ...updatedData.professionalInfo,
          location: updatedData.location,
          family: updatedData.family,
          hobbies: updatedData.hobbies,
          subscription: profile.subscription, // Preserve subscription object
        };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        toast({
          title: 'Profile Saved',
          description: 'Your profile has been updated successfully!',
        });
        setEditableSections({
          basic: false,
          religion: false,
          professional: false,
          family: false,
          hobbies: false,
          horoscope: false,
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to save profile. Please check your network or try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    const possibleKeys = [
      'userData',
      'user',
      'currentUser',
      'loggedInUser',
      'userToken',
      'token',
    ];
    possibleKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className='max-w-5xl mx-auto px-4 py-10 bg-[#fffdeb] min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-5xl mx-auto px-4 py-10 bg-[#fffdeb] min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <User className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-700 mb-2'>
            Profile Not Found
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <div className='space-y-2'>
            <Button
              onClick={() => navigate('/login')}
              className='bg-blue-600 hover:bg-blue-700 mr-2'
            >
              Go to Login
            </Button>
            <Button onClick={() => window.location.reload()} variant='outline'>
              Refresh Page
            </Button>
          </div>
          <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left text-sm'>
            <p className='font-semibold text-yellow-800 mb-2'>Debug Info:</p>
            <p className='text-yellow-700'>
              localStorage userData:{' '}
              {localStorage.getItem('loggedInUser') ? '✓ Found' : '✗ Not found'}
            </p>
            <p className='text-yellow-700'>
              sessionStorage userData:{' '}
              {sessionStorage.getItem('loggedInUser')
                ? '✓ Found'
                : '✗ Not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className='max-w-5xl mx-auto px-4 py-10 space-y-6 min-h-screen'>
        <div className='flex justify-between items-center'>
          <div className='text-center flex-1'>
            <h1 className='text-2xl font-bold mb-1'>My Profile</h1>
            <p className='text-muted-foreground'>
              Manage your profile information and preferences
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant='outline'
            className='flex items-center gap-2 hover:bg-red-50 hover:border-red-300'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>

        {/* Basic Info */}
        <Card className='shadow-md rounded-2xl'>
          <CardContent className='p-6 flex items-center gap-6'>
            <div className='relative w-20 h-20'>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=6366f1&color=fff&size=80`}
                alt='Profile'
                className='w-20 h-20 rounded-full object-cover'
              />
              <label
                htmlFor='profilePhoto'
                className='absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 cursor-pointer'
              >
                <Camera className='w-4 h-4 text-gray-600' />
                <input
                  id='profilePhoto'
                  type='file'
                  accept='image/*'
                  className='hidden'
                />
              </label>
            </div>
            <div className='flex-1 space-y-1'>
              <div className='flex items-center justify-between'>
                {editableSections.basic ? (
                  <div className='space-y-2 flex-1 mr-4'>
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder='Full Name'
                    />
                    <Input
                      value={profile.height}
                      onChange={(e) =>
                        handleInputChange('height', e.target.value)
                      }
                      placeholder='Height'
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className='text-xl font-semibold'>{profile.name}</h2>
                    <p className='text-sm text-gray-600'>
                      Profile ID: {profile.profileId}
                    </p>
                  </div>
                )}
                <Pencil
                  className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700'
                  onClick={() =>
                    setEditableSections((prev) => ({
                      ...prev,
                      basic: !prev.basic,
                    }))
                  }
                />
              </div>
              <p>
                {profile.age} Years, {profile.height}
              </p>
              <p>{profile.location}</p>
              <p>{profile.profession}</p>
              <p className='text-sm text-blue-600 font-medium'>
                {profile.subscription?.current?.toUpperCase() || 'FREE'} Member
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='font-medium text-gray-700'>Email:</span>{' '}
              {profile.email}
            </div>
            <div>
              <span className='font-medium text-gray-700'>Mobile:</span>{' '}
              {profile.mobile}
            </div>
            <div>
              <span className='font-medium text-gray-700'>Gender:</span>{' '}
              {profile.gender}
            </div>
            <div>
              <span className='font-medium text-gray-700'>Looking For:</span>{' '}
              {profile.lookingFor}
            </div>
            <div>
              <span className='font-medium text-gray-700'>Marital Status:</span>{' '}
              {profile.maritalStatus}
            </div>
            <div>
              <span className='font-medium text-gray-700'>Income:</span> ₹
              {profile.income}
            </div>
          </CardContent>
        </Card>

        {/* Religion Info */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>Religion Information</CardTitle>
            <Pencil
              className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700'
              onClick={() =>
                setEditableSections((prev) => ({
                  ...prev,
                  religion: !prev.religion,
                }))
              }
            />
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            {editableSections.religion ? (
              <>
                <div>
                  <label className='block text-gray-700 font-medium mb-1'>
                    Religion:
                  </label>
                  <Input
                    value={profile.religion}
                    onChange={(e) =>
                      handleInputChange('religion', e.target.value)
                    }
                    placeholder='Religion'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-medium mb-1'>
                    Community:
                  </label>
                  <Input
                    value={profile.caste}
                    onChange={(e) => handleInputChange('caste', e.target.value)}
                    placeholder='Community/Caste'
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className='font-medium text-gray-700'>Religion:</span>{' '}
                  {profile.religion}
                </div>
                <div>
                  <span className='font-medium text-gray-700'>Community:</span>{' '}
                  {profile.caste}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>Professional Information</CardTitle>
            <Pencil
              className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700'
              onClick={() =>
                setEditableSections((prev) => ({
                  ...prev,
                  professional: !prev.professional,
                }))
              }
            />
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            {editableSections.professional ? (
              <>
                <div>
                  <label className='block text-gray-700 font-medium mb-1'>
                    Education:
                  </label>
                  <Input
                    value={profile.education}
                    onChange={(e) =>
                      handleInputChange('education', e.target.value)
                    }
                    placeholder='Education'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-medium mb-1'>
                    Profession:
                  </label>
                  <Input
                    value={profile.profession}
                    onChange={(e) =>
                      handleInputChange('profession', e.target.value)
                    }
                    placeholder='Profession'
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className='font-medium text-gray-700'>Education:</span>{' '}
                  {profile.education}
                </div>
                <div>
                  <span className='font-medium text-gray-700'>Profession:</span>{' '}
                  {profile.profession}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Family Details */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>Family Details</CardTitle>
            <Pencil
              className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700'
              onClick={() =>
                setEditableSections((prev) => ({
                  ...prev,
                  family: !prev.family,
                }))
              }
            />
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            {editableSections.family ? (
              <>
                <div>
                  <label className='block text-gray-700 font-medium mb-1'>
                    Father's Occupation:
                  </label>
                  <Input
                    value={profile.family.father}
                    onChange={(e) =>
                      handleFamilyChange('father', e.target.value)
                    }
                    placeholder="Father's Occupation"
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-medium mb-1'>
                    Mother's Occupation:
                  </label>
                  <Input
                    value={profile.family.mother}
                    onChange={(e) =>
                      handleFamilyChange('mother', e.target.value)
                    }
                    placeholder="Mother's Occupation"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className='font-medium text-gray-700'>
                    Father's Occupation:
                  </span>{' '}
                  {profile.family.father}
                </div>
                <div>
                  <span className='font-medium text-gray-700'>
                    Mother's Occupation:
                  </span>{' '}
                  {profile.family.mother}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Horoscope */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle>Horoscope</CardTitle>
            <Pencil
              className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700'
              onClick={() =>
                setEditableSections((prev) => ({
                  ...prev,
                  horoscope: !prev.horoscope,
                }))
              }
            />
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {editableSections.horoscope ? (
                <>
                  <div>
                    <label className='block text-gray-700 font-medium mb-1'>
                      Date of Birth:
                    </label>
                    <Input
                      value={profile.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      placeholder='Date of Birth'
                    />
                  </div>
                  <div>
                    <label className='block text-gray-700 font-medium mb-1'>
                      Time of Birth:
                    </label>
                    <Input
                      value={profile.tob}
                      onChange={(e) => handleInputChange('tob', e.target.value)}
                      placeholder='Time of Birth'
                    />
                  </div>
                  <div>
                    <label className='block text-gray-700 font-medium mb-1'>
                      Birth Place:
                    </label>
                    <Input
                      value={profile.pob}
                      onChange={(e) => handleInputChange('pob', e.target.value)}
                      placeholder='Birth Place'
                    />
                  </div>
                  <div>
                    <label className='block text-gray-700 font-medium mb-1'>
                      Language:
                    </label>
                    <Input
                      value={profile.language}
                      onChange={(e) =>
                        handleInputChange('language', e.target.value)
                      }
                      placeholder='Language'
                    />
                  </div>
                  <div>
                    <label className='block text-gray-700 font-medium mb-1'>
                      Chart Style:
                    </label>
                    <Input
                      value={profile.chartStyle}
                      onChange={(e) =>
                        handleInputChange('chartStyle', e.target.value)
                      }
                      placeholder='Chart Style'
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className='font-medium text-gray-700'>
                      Date of Birth:
                    </span>{' '}
                    {profile.dob}
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>
                      Time of Birth:
                    </span>{' '}
                    {profile.tob}
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>
                      Birth Place:
                    </span>{' '}
                    {profile.pob}
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>Language:</span>{' '}
                    {profile.language}
                  </div>
                  <div>
                    <span className='font-medium text-gray-700'>
                      Chart Style:
                    </span>{' '}
                    {profile.chartStyle}
                  </div>
                </>
              )}
            </div>

            {horoscopeLoading ? (
              <div className='bg-yellow-100 text-yellow-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 text-center'>
                <div className='w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin'></div>
                <p className='text-sm font-medium'>Generating Horoscope...</p>
              </div>
            ) : !horoscopeGenerated ? (
              <div className='bg-yellow-400 text-black p-4 rounded-xl flex flex-col items-center justify-center space-y-4 text-center'>
                <span className='text-sm md:text-base'>
                  Generate your horoscope and get more responses
                </span>
                <Button
                  onClick={generateHoroscope}
                  className='bg-white text-yellow-600 font-semibold hover:bg-gray-100'
                >
                  GENERATE HOROSCOPE
                </Button>
              </div>
            ) : (
              horoscopeData && (
                <div className='bg-green-100 border border-green-300 rounded p-4 text-green-800'>
                  <p className='font-semibold'>
                    Horoscope Generated Successfully!
                  </p>
                  <p>
                    <strong>Compatibility:</strong>{' '}
                    {horoscopeData.compatibility}
                  </p>
                  <p>
                    <strong>Lucky Numbers:</strong>{' '}
                    {horoscopeData.luckyNumbers.join(', ')}
                  </p>
                  <p>
                    <strong>Lucky Colors:</strong>{' '}
                    {horoscopeData.luckyColors.join(', ')}
                  </p>
                  <p>
                    <strong>Favorable Time:</strong>{' '}
                    {horoscopeData.favorableTime}
                  </p>
                  <p>{horoscopeData.message}</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Hobbies */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle>Hobbies and Interests</CardTitle>
            <Pencil
              className='w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700'
              onClick={() =>
                setEditableSections((prev) => ({
                  ...prev,
                  hobbies: !prev.hobbies,
                }))
              }
            />
          </CardHeader>
          <CardContent className='text-sm'>
            {editableSections.hobbies ? (
              <div>
                <label className='block text-gray-700 font-medium mb-1'>
                  Hobbies:
                </label>
                <Input
                  value={profile.hobbies}
                  onChange={(e) => handleInputChange('hobbies', e.target.value)}
                  placeholder='Enter your hobbies'
                />
              </div>
            ) : (
              <div>
                <span className='font-medium text-gray-700'>Hobbies:</span>{' '}
                {profile.hobbies}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Tree */}
        <Card className='shadow-md rounded-2xl'>
          <CardHeader>
            <CardTitle>Family Tree</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <ul className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              {familyTree.map((member, idx) => (
                <li
                  key={idx}
                  className='border p-4 rounded-xl shadow-sm bg-gray-50'
                >
                  <strong>{member.name}</strong>
                  <br />
                  <span className='text-gray-600'>
                    {member.relation} – {member.details}
                  </span>
                </li>
              ))}
            </ul>

            {addingMember && (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2 pt-4 border-t'>
                <Input
                  placeholder='Name'
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
                <Input
                  placeholder='Relation'
                  value={newMember.relation}
                  onChange={(e) =>
                    setNewMember({ ...newMember, relation: e.target.value })
                  }
                />
                <Input
                  placeholder='Details'
                  value={newMember.details}
                  onChange={(e) =>
                    setNewMember({ ...newMember, details: e.target.value })
                  }
                />
                <div className='col-span-1 md:col-span-3 flex gap-2 mt-2'>
                  <Button
                    onClick={() => {
                      if (newMember.name && newMember.relation) {
                        setFamilyTree([...familyTree, newMember]);
                        setNewMember({ name: '', relation: '', details: '' });
                        setAddingMember(false);
                      }
                    }}
                    className='flex-1'
                  >
                    Add Member
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setNewMember({ name: '', relation: '', details: '' });
                      setAddingMember(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {!addingMember && (
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setAddingMember(true)}
              >
                + Add Member
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className='text-center pt-6'>
          <Button
            className='px-6 py-2 text-lg font-semibold'
            onClick={handleSaveProfile}
            disabled={updating}
          >
            {updating ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

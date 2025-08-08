import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageSquare, User, MapPin, Briefcase, Search } from "lucide-react";
import Header from "@/components/Header";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Home = () => {
  const [recentMatches, setRecentMatches] = useState([]);
  const [profileStats, setProfileStats] = useState({
    profileViews: 0,
    interestsReceived: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch profile stats
  const fetchProfileStats = async (profileId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/stats?profileId=${profileId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile stats');
      }

      const data = await response.json();
      setProfileStats({
        profileViews: data.profileViews || 0,
        interestsReceived: data.interestsReceived || 0,
        messages: data.messages || 0,
      });
    } catch (err) {
      console.error('Error fetching profile stats:', err.message);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load profile stats.",
        variant: "destructive",
      });
    }
  };

  // Fetch recent matches and initial stats
  useEffect(() => {
    const fetchRecentMatches = async () => {
      try {
        const userData = localStorage.getItem('loggedInUser');
        if (!userData) {
          throw new Error('User data not found. Please log in again.');
        }
        let user;
        try {
          user = JSON.parse(userData);
        } catch (err) {
          throw new Error('Invalid user data. Please log in again.');
        }

        const profileId = user.profileId || '';
        if (!profileId) {
          throw new Error('Profile ID not found. Please log in again.');
        }

        // Fetch profile stats
        await fetchProfileStats(profileId);

        const gender = user.gender || '';
        const response = await fetch(
          `${BASE_URL}/api/recent-matches?profileId=${encodeURIComponent(profileId)}&gender=${encodeURIComponent(gender)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch recent matches');
        }

        const data = await response.json();
        setRecentMatches(data.matches || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent matches:', err.message);
        setError(err.message);
        setLoading(false);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    fetchRecentMatches();

    // Refetch stats if coming from Search.js
    if (location.state?.fromSearch) {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        const user = JSON.parse(userData);
        const profileId = user.profileId || '';
        if (profileId) {
          fetchProfileStats(profileId);
        }
      }
    }
  }, [toast, location.state]);

  // Handle View Profile click
  const handleViewProfile = async (profileId) => {
    try {
      const userData = localStorage.getItem('loggedInUser');
      if (!userData) {
        throw new Error('User not logged in. Please log in again.');
      }
      let user;
      try {
        user = JSON.parse(userData);
      } catch (err) {
        throw new Error('Invalid user data. Please log in again.');
      }
      const userProfileId = user.profileId || '';
      if (!userProfileId) {
        throw new Error('Profile ID not found. Please log in again.');
      }

      // Call API to increment profile views
      const response = await fetch(`h${BASE_URL}/api/profiles/${profileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load profile');
      }

      console.log(`Profile view incremented for profileId=${profileId}`);

      // If viewing own profile, refetch stats to update profileViews
      if (profileId === userProfileId) {
        await fetchProfileStats(userProfileId);
      }

      // Navigate to profile page
      navigate(`/profile/${profileId}`, { state: { fromSearch: true } });
    } catch (error) {
      console.error('Error incrementing profile view:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Navigate even if API fails to ensure UX continuity
      navigate(`/profile/${profileId}`, { state: { fromSearch: true } });
    }
  };

  const notifications = [
    { type: "interest", message: "Ananya K. showed interest in your profile", time: "2 hours ago" },
    { type: "message", message: "New message from Divya N.", time: "5 hours ago" },
    { type: "match", message: "3 new matches found for you", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your matrimony journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link to="/search">
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700">
                      <Search size={18} className="mr-2" />
                      Find Matches
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="outline" className="w-full border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                      <MessageSquare size={18} className="mr-2" />
                      Messages
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                      <Heart size={18} className="mr-2" />
                      Interests
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Matches</h2>
                  <Link to="/dashboard" className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                {loading ? (
                  <p className="text-gray-600">Loading recent matches...</p>
                ) : error ? (
                  <p className="text-red-600">Error: {error}</p>
                ) : recentMatches.length === 0 ? (
                  <p className="text-gray-600">No recent matches found.</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {recentMatches.map((profile) => (
                      <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow border-yellow-100">
                        <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200">
                          <img 
                            src={profile.image || 'https://via.placeholder.com/300'} 
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-gray-800 mb-1">{profile.name}</h3>
                          <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>{profile.age !== 'N/A' ? `${profile.age} years` : 'Age not specified'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase size={12} />
                              <span>{profile.profession || 'Profession not specified'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{profile.location || 'Location not specified'}</span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleViewProfile(profile.id)}
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold text-yellow-600">{profileStats.profileViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Interests Received</span>
                    <span className="font-semibold text-yellow-600">{profileStats.interestsReceived}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Messages</span>
                    <span className="font-semibold text-yellow-600">{profileStats.messages}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-800">{notification.message}</p>
                        <p className="text-gray-500 text-xs">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                
                  <Button variant="ghost" className="w-full mt-4 text-yellow-600 hover:bg-yellow-50">
                    View All Activity
                  </Button>
               
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
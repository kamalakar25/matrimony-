import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, X, User, MapPin, Briefcase, Inbox } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    ageRange: "",
    community: "",
    location: "",
    education: "",
  });

  const [profiles, setProfiles] = useState([]);
  const [interestsSent, setInterestsSent] = useState<string[]>([]);
  const [receivedInterests, setReceivedInterests] = useState<string[]>([]);
  const [showReceived, setShowReceived] = useState(true); // Default to showing interested profiles
  const [isLoading, setIsLoading] = useState(false);

  // Fetch interested profiles on mount
  useEffect(() => {
    const fetchInterestedProfiles = async () => {
      try {
        setIsLoading(true);
        const userProfile = localStorage.getItem('loggedInUser');
        const userProfileId = userProfile ? JSON.parse(userProfile).profileId : 'anonymous';
        console.log(`Fetching interested profiles for userProfileId=${userProfileId}`);
        const response = await fetch(`${BASE_URL}/api/interested-profiles?userProfileId=${userProfileId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch interested profiles: ${errorData.error || response.statusText}`);
        }
        const data = await response.json();
        console.log(`Received interested profiles: ${JSON.stringify(data)}`);
        // Filter out logged-in user's profile
        const filteredData = data.filter(profile => profile.id.toString() !== userProfileId);
        setProfiles(filteredData);
        setInterestsSent(data.map(profile => profile.id.toString()));
        setReceivedInterests(data.map(profile => profile.id.toString()));
      } catch (error) {
        console.error('Error fetching interested profiles:', error.message);
        toast.error('Failed to load interested profiles.', { position: "top-right" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterestedProfiles();
  }, []);

  // Update displayed profiles when showReceived changes
  useEffect(() => {
    if (showReceived) {
      const fetchInterestedProfiles = async () => {
        try {
          setIsLoading(true);
          const userProfile = localStorage.getItem('loggedInUser');
          const userProfileId = userProfile ? JSON.parse(userProfile).profileId : 'anonymous';
          console.log(`Fetching interested profiles for userProfileId=${userProfileId}`);
          const response = await fetch(`${BASE_URL}/api/interested-profiles?userProfileId=${userProfileId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch interested profiles: ${errorData.error || response.statusText}`);
          }
          const data = await response.json();
          console.log(`Received interested profiles: ${JSON.stringify(data)}`);
          // Filter out logged-in user's profile
          const filteredData = data.filter(profile => profile.id.toString() !== userProfileId);
          setProfiles(filteredData);
          setReceivedInterests(data.map(profile => profile.id.toString()));
        } catch (error) {
          console.error('Error fetching interested profiles:', error.message);
          toast.error('Failed to load interested profiles.', { position: "top-right" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInterestedProfiles();
    } else {
      setProfiles([]); // Clear profiles when not in "Received Interests" view
    }
  }, [showReceived]);

  const handleInterest = async (id: string) => {
    if (interestsSent.includes(id)) {
      toast.error('You have already sent interest to this profile.', { position: "top-right" });
      return;
    }

    try {
      const userProfile = localStorage.getItem('loggedInUser');
      const userProfileId = userProfile ? JSON.parse(userProfile).profileId : 'anonymous';

      console.log(`Sending interest from dashboard: userProfileId=${userProfileId}, interestedProfileId=${id}`);

      const response = await fetch(`${BASE_URL}/api/send-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfileId, interestedProfileId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send interest: ${errorData.error || response.statusText}`);
      }

      setInterestsSent((prev) => [...prev, id]);
      toast.success("Interest Sent!\nYour interest has been sent successfully.", {
        position: "top-right",
      });

      // Refresh interested profiles
      const interestsResponse = await fetch(`${BASE_URL}/api/interested-profiles?userProfileId=${userProfileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!interestsResponse.ok) {
        const errorData = await interestsResponse.json();
        throw new Error(`Failed to fetch interested profiles: ${errorData.error || interestsResponse.statusText}`);
      }
      const interestsData = await interestsResponse.json();
      // Filter out logged-in user's profile
      const filteredInterestsData = interestsData.filter(profile => profile.id.toString() !== userProfileId);
      setReceivedInterests(interestsData.map(profile => profile.id.toString()));
      if (showReceived) {
        setProfiles(filteredInterestsData);
      }
    } catch (error) {
      console.error('Error sending interest:', error.message);
      toast.error(
        error.message === 'Interest already sent for this profile'
          ? 'You have already sent interest to this profile.'
          : error.message === 'Interested profile not found'
          ? 'The selected profile does not exist.'
          : 'Failed to send interest.',
        { position: "top-right" }
      );
    }
  };

  const handlePass = async (id: string) => {
    try {
      const userProfile = localStorage.getItem('loggedInUser');
      if (!userProfile) {
        throw new Error('No user profile found in localStorage. Please log in.');
      }
      const userProfileId = JSON.parse(userProfile).profileId || 'anonymous';
      console.log(`Attempting to remove interest: userProfileId=${userProfileId}, interestedProfileId=${id}`);

      // Remove interest from backend
      const response = await fetch(`${BASE_URL}/api/remove-interest `, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfileId, interestedProfileId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Remove interest failed: ${JSON.stringify(errorData)}`);
        throw new Error(errorData.error || `Failed to remove interest: ${response.statusText}`);
      }

      // Update local state only after successful deletion
      setProfiles((prev) => {
        const updated = prev.filter((profile) => profile.id.toString() !== id);
        console.log(`Updated profiles after pass: ${JSON.stringify(updated)}`);
        return updated;
      });
      setReceivedInterests((prev) => {
        const updated = prev.filter((profileId) => profileId !== id);
        console.log(`Updated receivedInterests after pass: ${JSON.stringify(updated)}`);
        return updated;
      });
      setInterestsSent((prev) => {
        const updated = prev.filter((profileId) => profileId !== id);
        console.log(`Updated interestsSent after pass: ${JSON.stringify(updated)}`);
        return updated;
      });
      toast.success("Profile passed and interest removed.", { position: "top-right" });
      console.log(`Interest successfully removed for profile id=${id}`);
    } catch (error) {
      console.error('Error removing interest:', error.message);
      toast.error(
        error.message.includes('No user profile found') 
          ? 'Please log in to remove interests.' 
          : error.message.includes('Interest not found') 
          ? 'Interest not found in database.' 
          : `Failed to remove interest: ${error.message}`, 
        { position: "top-right" }
      );
    }
  };

  const getFilteredProfiles = () => {
    const userProfile = localStorage.getItem('loggedInUser');
    const userProfileId = userProfile ? JSON.parse(userProfile).profileId : 'anonymous';

    return displayedProfiles.filter(profile => {
      // Exclude the logged-in user's profile
      if (profile.id.toString() === userProfileId) return false;

      if (filters.ageRange && !filters.ageRange.includes(profile.age.toString())) return false;
      if (filters.community && filters.community !== "all" && profile.community !== filters.community) return false;
      if (filters.location && profile.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      if (filters.education && !profile.education.includes(filters.education)) return false;
      return true;
    });
  };

  const displayedProfiles = showReceived
    ? profiles.filter((profile) => receivedInterests.includes(profile.id.toString()))
    : profiles;

  const filteredProfiles = getFilteredProfiles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      <ToastContainer />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Matches</h1>
            <p className="text-gray-600">Discover compatible profiles based on your preferences</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowReceived(!showReceived)}
            className="text-yellow-700 border-yellow-400 hover:bg-yellow-100"
          >
            <Inbox size={16} className="mr-2" />
            {showReceived ? "Hide Interests" : "Show Interests"}
          </Button>
        </div>

        <Card className="mb-8 border-yellow-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Matches</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value }))}>
                <SelectTrigger className="border-yellow-300">
                  <SelectValue placeholder="Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25 years</SelectItem>
                  <SelectItem value="26-30">26-30 years</SelectItem>
                  <SelectItem value="31-35">31-35 years</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, community: value }))}>
                <SelectTrigger className="border-yellow-300">
                  <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lingayat">Lingayat</SelectItem>
                  <SelectItem value="brahmin">Brahmin</SelectItem>
                  <SelectItem value="vokkaliga">Vokkaliga</SelectItem>
                  <SelectItem value="all">All Communities</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="border-yellow-300">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mysore">Mysore</SelectItem>
                  <SelectItem value="hubli">Hubli</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, education: value }))}>
                <SelectTrigger className="border-yellow-300">
                  <SelectValue placeholder="Education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Post Graduate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading profiles...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center text-gray-600">
            {showReceived ? "No interests sent yet." : "No profiles to display."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow border-yellow-200">
                <div className="aspect-square">
                  <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{profile.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1"><User size={14} /><span>{profile.age} years</span></div>
                    <div className="flex items-center gap-1"><Briefcase size={14} /><span>{profile.profession}</span></div>
                    <div className="flex items-center gap-1"><MapPin size={14} /><span>{profile.location}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50" 
                      onClick={() => handlePass(profile.id.toString())}
                    >
                      <X size={16} className="mr-1" /> Pass
                    </Button>
                    <Button 
                      size="sm" 
                      className={`flex-1 ${interestsSent.includes(profile.id.toString()) ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"}`} 
                      onClick={() => handleInterest(profile.id.toString())}
                      disabled={interestsSent.includes(profile.id.toString())} // Disable button if interest already sent
                    >
                      <Heart size={16} className="mr-1" /> {interestsSent.includes(profile.id.toString()) ? "Interest Sent" : "Interest"}
                    </Button>
                  </div>
                  <Link to={`/profile/${profile.id}`}>
                    <Button variant="ghost" className="w-full mt-2 text-yellow-600 hover:bg-yellow-50">View Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
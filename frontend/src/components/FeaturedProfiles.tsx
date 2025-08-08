import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const initialProfiles = [
  {
    id: 1,
    name: "Priya",
    age: 28,
    profession: "Software Engineer",
    location: "Bangalore",
    education: "B.Tech",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&w=400"
  },
  {
    id: 2,
    name: "Kavya",
    age: 26,
    profession: "Doctor",
    location: "Chennai",
    education: "MBBS",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&w=400"
  },
  {
    id: 3,
    name: "Meera",
    age: 25,
    profession: "Teacher",
    location: "Mumbai",
    education: "M.Ed",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=400"
  },
  {
    id: 4,
    name: "Anjali",
    age: 27,
    profession: "CA",
    location: "Delhi",
    education: "CA, B.Com",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&w=400"
  }
];

const FeaturedProfiles = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const { toast } = useToast();

  const handleLike = (profileId: number) => {
    setLikedProfiles((prev) => [...prev, profileId]);
    toast({
      title: "Interest Sent!",
      description: "Your interest has been sent successfully.",
    });
  };

  const handleMessage = (profileName: string) => {
    toast({
      title: "Starting Conversation",
      description: `Opening chat with ${profileName}...`,
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Profiles
          </h2>
          <p className="text-lg text-gray-600">
            Discover verified profiles of potential matches
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-yellow-100 hover:border-yellow-300 hover:scale-105 animate-fade-in ${
                likedProfiles.includes(profile.id) ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Online
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {profile.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {profile.age} years, {profile.location}
                </p>
                <p className="text-gray-700 text-sm mb-2">{profile.profession}</p>
                <p className="text-gray-600 text-xs mb-4">{profile.education}</p>

                {/* Centered Action Buttons (without X) */}
                <div className="flex justify-center flex-wrap gap-2">
                  <Link to={`/profile/${profile.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    className={`transition-all duration-200 hover:scale-110 ${
                      likedProfiles.includes(profile.id)
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                    onClick={() =>
                      !likedProfiles.includes(profile.id) && handleLike(profile.id)
                    }
                    disabled={likedProfiles.includes(profile.id)}
                  >
                    {likedProfiles.includes(profile.id) ? (
                      <>
                        <Heart className="h-4 w-4 mr-1" />
                        Interest Sent
                      </>
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-200 hover:scale-110"
                    onClick={() => handleMessage(profile.name)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center mt-12 text-gray-600">
            No more profiles to show.
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/search">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              View All Profiles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfiles;

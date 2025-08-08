import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, Heart, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const { toast } = useToast();

  const events = [
    {
      id: 1,
      title: "Meet & Greet Coffee Evening",
      description: "An intimate evening to meet like-minded individuals over coffee and light refreshments.",
      date: "2024-02-15",
      time: "6:00 PM - 8:00 PM",
      location: "Café Central, Mumbai",
      attendees: 25,
      maxAttendees: 30,
      category: "social",
      featured: true,
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Traditional Dance Workshop",
      description: "Learn classical Indian dance forms and connect with others who share your passion for culture.",
      date: "2024-02-18",
      time: "4:00 PM - 7:00 PM",
      location: "Cultural Center, Delhi",
      attendees: 18,
      maxAttendees: 20,
      category: "cultural",
      featured: false,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Speed Dating Event",
      description: "Meet multiple potential matches in a fun, organized setting with structured conversations.",
      date: "2024-02-20",
      time: "7:00 PM - 10:00 PM",
      location: "Hotel Regency, Bangalore",
      attendees: 45,
      maxAttendees: 50,
      category: "dating",
      featured: true,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Cooking Class & Dinner",
      description: "Learn to cook traditional recipes together and enjoy a group dinner.",
      date: "2024-02-25",
      time: "5:00 PM - 9:00 PM",
      location: "Culinary Institute, Chennai",
      attendees: 12,
      maxAttendees: 16,
      category: "lifestyle",
      featured: false,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Outdoor Adventure Trek",
      description: "Join us for a day trek and team building activities in the beautiful Western Ghats.",
      date: "2024-03-02",
      time: "6:00 AM - 6:00 PM",
      location: "Lonavala Hills, Maharashtra",
      attendees: 28,
      maxAttendees: 35,
      category: "adventure",
      featured: false,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleRegister = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      toast({
        title: "Registration Cancelled",
        description: "You have successfully cancelled your registration.",
      });
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for this event.",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "social": return "bg-blue-100 text-blue-800";
      case "cultural": return "bg-purple-100 text-purple-800";
      case "dating": return "bg-pink-100 text-pink-800";
      case "lifestyle": return "bg-green-100 text-green-800";
      case "adventure": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterEventsByCategory = (category: string) => {
    if (category === "all") return events;
    return events.filter(event => event.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Matrimony Events</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Join our exclusive events to meet potential life partners in person. From cultural celebrations to adventure activities, find your perfect match while doing what you love.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2" />
            Featured Events
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {events.filter(event => event.featured).map(event => (
              <Card key={event.id} className="overflow-hidden border-yellow-200 shadow-lg">
                <div className="relative">
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">Featured</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base sm:text-xl">{event.title}</CardTitle>
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attendees}/{event.maxAttendees} registered
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRegister(event.id)}
                    className={`w-full text-sm ${registeredEvents.includes(event.id)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                      }`}
                  >
                    {registeredEvents.includes(event.id) ? "Registered ✓" : "Register Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full text-xs sm:text-sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="dating">Dating</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="adventure">Adventure</TabsTrigger>
          </TabsList>

          {["all", "social", "cultural", "dating", "lifestyle", "adventure"].map(category => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterEventsByCategory(category).map(event => (
                  <Card key={event.id} className="overflow-hidden border-yellow-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                      {event.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" /> Featured
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base sm:text-lg">{event.title}</CardTitle>
                        <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                      <div className="space-y-1 text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" /> {event.attendees}/{event.maxAttendees}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRegister(event.id)}
                        size="sm"
                        className={`w-full text-xs ${registeredEvents.includes(event.id)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                          }`}
                      >
                        {registeredEvents.includes(event.id) ? "Registered ✓" : "Register"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Events;

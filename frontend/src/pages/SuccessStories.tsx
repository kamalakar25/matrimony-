import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar, MapPin, Quote, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SuccessStories = () => {
  const [loading, setLoading] = useState(false);

  const stories = [
    {
      id: 1,
      couple: "Priya & Suresh",
      weddingDate: "March 2024",
      location: "Bangalore",
      story: "We connected through KannadaMatch in January 2023. What started as casual conversations soon blossomed into deep understanding. Our families met, and within months we knew we were perfect for each other. Thank you KannadaMatch for bringing us together!",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      couple: "Kavya & Ramesh",
      weddingDate: "December 2023",
      location: "Mysore",
      story: "After being on the platform for just two months, we found each other. The compatibility was instant - we shared the same values, dreams, and vision for our future. Our wedding was a beautiful celebration of two families coming together.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      couple: "Lakshmi & Naveen",
      weddingDate: "October 2023",
      location: "Hubli",
      story: "We were both skeptical about online matrimony, but KannadaMatch proved us wrong. The verification process gave us confidence, and the detailed profiles helped us understand each other better before meeting.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      couple: "Sowmya & Kiran",
      weddingDate: "August 2023",
      location: "Mangalore",
      story: "Distance was never a barrier when we connected through KannadaMatch. Video calls, long conversations, and family meetings made our bond stronger. Today we're happily married and grateful for this platform.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      couple: "Pooja & Vikram",
      weddingDate: "June 2023",
      location: "Davangere",
      story: "We both had busy careers and limited time to meet people. KannadaMatch made it easy to connect with like-minded individuals. We found our perfect match and couldn't be happier!",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      couple: "Anita & Mahesh",
      weddingDate: "April 2023",
      location: "Shimoga",
      story: "The detailed compatibility matching helped us realize we were meant for each other. From our first conversation to our beautiful wedding ceremony, everything felt perfectly aligned.",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-red-50">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Heart className="mx-auto mb-6 h-16 w-16 text-pink-200 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Love Stories That Inspire
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
            Discover beautiful journeys of couples who found their soulmates through KannadaMatch.
            Their stories prove that true love knows no boundaries.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Stories Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {stories.map((story) => (
            <Card key={story.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.couple}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Heart className="h-6 w-6 text-red-500 fill-current" />
                </div>
              </div>

              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {story.couple}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {story.weddingDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-pink-200" />
                  <p className="text-gray-600 leading-relaxed pl-6 italic text-sm sm:text-base md:text-lg">
                    {story.story}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Share Your Story Section */}
        <div className="relative px-2 sm:px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-red-500/10 rounded-3xl"></div>
          <Card className="relative max-w-4xl mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 md:p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current" />
                </div>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
                  Share Your Love Story
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                  Found your perfect match through KannadaMatch? We'd love to celebrate your journey and inspire others looking for love!
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    alert("Thank you for sharing your story!");
                  }, 2000);
                }}
              >
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Your Names *
                    </label>
                    <Input
                      placeholder="e.g., Priya & Suresh"
                      className="h-10 sm:h-12 border-2 border-pink-100 focus:border-pink-400 bg-white/50 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Wedding Date *
                    </label>
                    <Input
                      type="date"
                      className="h-10 sm:h-12 border-2 border-pink-100 focus:border-pink-400 bg-white/50 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Wedding Location *
                    </label>
                    <Input
                      placeholder="e.g., Bangalore"
                      className="h-10 sm:h-12 border-2 border-pink-100 focus:border-pink-400 bg-white/50 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Your Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="h-10 sm:h-12 border-2 border-pink-100 focus:border-pink-400 bg-white/50 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Your Love Story *
                  </label>
                  <Textarea
                    placeholder="Tell us how you met through KannadaMatch, your journey to marriage, and what made your connection special..."
                    rows={5}
                    className="border-2 border-pink-100 focus:border-pink-400 bg-white/50 resize-none text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="text-center">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-12 text-sm sm:text-lg font-semibold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />}
                    {loading ? "Sharing..." : "Share Your Beautiful Story"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SuccessStories;

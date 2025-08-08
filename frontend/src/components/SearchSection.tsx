
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const SearchSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-lg border-yellow-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Find Your Perfect Match
              </h2>
              <p className="text-gray-600 text-lg">
                Search from lakhs of verified profiles
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Looking for
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option>18 to 25</option>
                  <option>26 to 30</option>
                  <option>31 to 35</option>
                  <option>36 to 40</option>
                  <option>Above 40</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Sikh</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother Tongue
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                  <option>Bengali</option>
                  <option>Marathi</option>
                  <option>Gujarati</option>
                  <option>Kannada</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/search">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-12 py-4 text-lg font-semibold shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Let's Begin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SearchSection;

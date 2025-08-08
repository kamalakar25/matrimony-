
import { Button } from "@/components/ui/button";

const AppDownload = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Download Our App
        </h2>
        <p className="text-xl mb-8 text-yellow-100">
          Find your perfect match on the go with our mobile app
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-4">
            <img src="/api/placeholder/24/24" alt="Google Play" className="w-6 h-6 mr-2" />
            Download for Android
          </Button>
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-4">
            <img src="/api/placeholder/24/24" alt="App Store" className="w-6 h-6 mr-2" />
            Download for iOS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;

import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">♥</div>
        <div className="absolute bottom-20 right-20 text-4xl">💝</div>
        <div className="absolute top-1/2 left-1/4 text-3xl">💑</div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-white mt-2">Life Partner</span>
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-yellow-100 font-medium">
            Lakhs of Verified Profiles. 100% Privacy. Safe & Secure.
          </p>
          <p className="text-lg md:text-xl mb-8 text-yellow-200">
            Join thousands of families who found their perfect match through our trusted platform
          </p>

          {/* Updated Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/signup">
              <button className="bg-white text-yellow-700 font-semibold px-10 py-4 rounded-md shadow-lg hover:bg-yellow-100 transition duration-300 text-lg sm:text-xl">
                Join Now For Free
              </button>
            </Link>
            <Link to="/success-stories">
              <button className="bg-white text-yellow-700 font-semibold px-10 py-4 rounded-md shadow-lg hover:bg-yellow-100 transition duration-300 text-lg sm:text-xl">
                View Success Stories
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-yellow-100">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">5L+</div>
              <div className="text-sm md:text-base">Verified Profiles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">50K+</div>
              <div className="text-sm md:text-base">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">15+</div>
              <div className="text-sm md:text-base">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { Users, Heart, Award, Globe } from "lucide-react";

const SuccessCounter = () => {
  const stats = [
    {
      icon: Users,
      number: "5,00,000+",
      label: "Registered Members",
      color: "text-blue-600"
    },
    {
      icon: Heart,
      number: "50,000+",
      label: "Success Stories",
      color: "text-red-600"
    },
    {
      icon: Award,
      number: "15+",
      label: "Years of Trust",
      color: "text-yellow-600"
    },
    {
      icon: Globe,
      number: "500+",
      label: "Cities Covered",
      color: "text-green-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Millions
          </h2>
          <p className="text-xl text-yellow-100">
            Numbers that speak for our success
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon size={28} className="text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-yellow-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessCounter;


import { Check, Mail, User } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Check,
      title: "Verified Profiles",
      description: "100% verified profiles with document verification",
    },
    {
      icon: User,
      title: "24/7 Support",
      description: "Round-the-clock customer support for your queries",
    },
    {
      icon: Mail,
      title: "Privacy Protected",
      description: "Your personal information is completely secure",
    },
  ];

  return (
    <section className="py-12 bg-yellow-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center justify-center text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-3">
                  <badge.icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {badge.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

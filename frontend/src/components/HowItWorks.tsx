
import { User, ArrowDown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: User,
      title: "Register",
      description: "Create your profile with verified details and preferences",
    },
    {
      icon: ArrowDown,
      title: "Connect",
      description: "Browse compatible matches and send interests",
    },
    {
      icon: Check,
      title: "Marry",
      description: "Meet your soulmate and start your journey together",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finding your perfect life partner is simple with our 3-step process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-yellow-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

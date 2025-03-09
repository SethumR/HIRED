import { Check, Crown, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";

function Upgrade() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      icon: Shield,
      popular: false,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      glowColor: "group-hover:shadow-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-900/50",
      features: [
        "20 mock interviews/month",
        "AI-generated feedback",
        "Common interview questions",
        "Email support",
        "Basic tips & tricks",
        "Interview progress tracking",
        "24/7 priority support",
        "Resume formatting ",
      ],
    },
    {
      name: "Advanced",
      price: "$15",
      icon: Zap,
      popular: true,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      glowColor: "group-hover:shadow-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-900/50",
      features: [
        "Unlimited mock interviews",
        "AI-driven insights & analysis",
        "Personalized question bank",
        "Advanced strategies",
        "Priority email support",
        "24/7 priority support",
        "Role-specific interview sets",
        "AI-powered voice  analysis",
      ],
    },
    {
      name: "Premium",
      price: "$30",
      icon: Crown,
      popular: false,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      glowColor: "group-hover:shadow-amber-500/20",
      iconColor: "text-amber-400",
      borderColor: "border-amber-900/50",
      features: [
        "Unlimited mock interviews",
        "1-on-1 expert coaching",
        "Live feedback & tracking",
        "Comprehensive courses",
        "Exclusive resources",
        "24/7 priority support",
        "Mock panel interviews",
        "Private career counseling session",
      ],
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1c] p-6 relative overflow-hidden py-28">
      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-16 relative">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Elevate your interview skills</span>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Upgrade Your Experience
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Unlock exclusive features and take your interview preparation to the next level.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className="group relative">
              <div
                className={`h-full p-8 rounded-2xl transition-all duration-500 bg-gradient-to-br ${plan.color} ${plan.hoverColor} border ${plan.borderColor} backdrop-blur-xl hover:shadow-2xl ${plan.glowColor} hover:scale-[1.02] bg-gray-900/40`}
              >
                <div className="mb-6 flex items-center space-x-4 justify-center">
                  <div className="w-14 h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <plan.icon className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>
                  <h3 className={`text-3xl font-bold ${plan.iconColor} text-center`}>{plan.name}</h3>
                </div>
                <div className="flex items-baseline mb-6 text-center justify-center -mt-4">
                  <span className="text-2xl font-extrabold text-white">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-gray-400 ml-2">/Year</span>}
                </div>
                <ul className="text-gray-300 space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className={`flex-shrink-0 mt-0.5 ${plan.iconColor}`}>
                        <Check className="h-5 w-5" />
                      </span>
                      <span className="group-hover:text-gray-200 transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-xl font-medium transition-all duration-300 text-white flex items-center justify-center space-x-2 bg-gray-900 border border-gray-800 group-hover:bg-gray-800">
                  <span>{plan.price === "Free" ? "Get Started" : "Select Plan"}</span>
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-all duration-300 group-hover:opacity-100" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-400 max-w-xl mx-auto relative mb-6 mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/10 to-transparent h-px -top-8" />
          <p className="mt-8">
            All plans include a 14-day money-back guarantee. No questions asked.
            <br />
            Need a custom plan for your team?{" "}
            <a
              href="#"
              className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:text-purple-300 underline">
              Contact us
            </a>
          </p>
          {/* { <div className="mt-4">
            <a
              href="#"
              className="inline-block py-2 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:bg-purple-300 transition-all"
            >
              Contact Us
            </a>
          </div> } */}
        </div>
      </div>
    </div>
  );
}

export default Upgrade;
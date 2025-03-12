"use client"

import { Check, Crown, Zap, Shield, ArrowRight, Sparkles, Building, User } from "lucide-react"
import { useState } from "react"

function Upgrade() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [isCompany, setIsCompany] = useState(false)

  const candidatePlans = [
    {
      name: "Basic",
      monthly: "Free",
      annual: "Free",
      icon: Shield,
      popular: false,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/10 hover:to-blue-600/10",
      glowColor: "group-hover:shadow-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-900/40",
      features: [
        "5 mock interviews/month",
        "AI-generated feedback",
        "Common interview questions",
        "Email support",
        "Interview progress tracking",
        "24/7 priority support",
      ],
    },
    {
      name: "Advanced",
      monthly: "$10",
      annual: "$100",
      icon: Zap,
      popular: true,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/10 hover:to-blue-600/10",
      glowColor: "group-hover:shadow-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-blue-900/40",
      features: [
        "Unlimited mock interviews",
        "AI-driven insights & analysis",
        "Personalized question bank",
        "Advanced strategies",
        "Priority email support",
        "24/7 priority support",
        "Role-specific interview sets",
        "AI-powered voice analysis",
        "CV script analysis",
      ],
    },
    {
      name: "Premium",
      monthly: "$15",
      annual: "$150",
      icon: Crown,
      popular: false,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/10 hover:to-blue-600/10",
      glowColor: "group-hover:shadow-amber-500/20",
      iconColor: "text-amber-400",
      borderColor: "border-blue-900/40",
      features: [
        "Unlimited mock interviews",
        "1-on-1 expert coaching",
        "Live feedback & tracking",
        "Comprehensive courses",
        "Exclusive resources",
        "24/7 priority support",
        "CV script analysis",
        "Private career counseling session",
      ],
    },
  ]

  const companyPlans = [
    {
      name: "Starter",
      monthly: "$20",
      annual: "$200",
      icon: Shield,
      popular: false,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      glowColor: "group-hover:shadow-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-900/50",
      features: [
        "Up to 5 team members",
        "50 mock interviews/month",
        "Basic candidate analytics",
        "Standard question library",
        "Email support",
        "Basic reporting tools",
        "Candidate progress tracking",
        "Standard templates",
      ],
    },
    {
      name: "Business",
      monthly: "$50",
      annual: "$500",
      icon: Zap,
      popular: true,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      glowColor: "group-hover:shadow-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-900/50",
      features: [
        "Up to 20 team members",
        "Unlimited mock interviews",
        "Advanced candidate analytics",
        "Custom question library",
        "Priority support",
        "Advanced reporting tools",
        "Team performance insights",
        "Custom interview templates",
      ],
    },
    {
      name: "Enterprise",
      monthly: "$70",
      annual: "$700",
      icon: Crown,
      popular: false,
      color: "from-blue-500/10 to-blue-600/10",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      glowColor: "group-hover:shadow-amber-500/20",
      iconColor: "text-amber-400",
      borderColor: "border-amber-900/50",
      features: [
        "Unlimited team members",
        "Unlimited mock interviews",
        "Enterprise-grade analytics",
        "Custom integration options",
        "Dedicated account manager",
        "Executive reporting",
        "White-label solutions",
        "Custom training workshops",
      ],
    },
  ]

  const plans = isCompany ? companyPlans : candidatePlans

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f1c] p-6 relative overflow-hidden py-28">
      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-8 relative">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Elevate your interview skills</span>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">Upgrade Your Experience</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10 ">
            Unlock exclusive features and take your interview preparation to the next level.
          </p>
        </div>

        {/* Toggle switches */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          {/* User type toggle */}
          <div className="flex items-center justify-center space-x-3 bg-gray-900/80 px-4 py-2 rounded-2xl border border-gray-800">
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all ${!isCompany ? "bg-[#1e293b] text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setIsCompany(false)}
            >
              <User className="w-4 h-4" />
              <span>Candidate</span>
            </button>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all ${isCompany ? "bg-[#1e293b] text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setIsCompany(true)}
            >
              <Building className="w-4 h-4" />
              <span>Company</span>
            </button>
          </div>

          {/* Billing period toggle */}
          <div className="flex items-center justify-center space-x-3 bg-gray-900/80 px-4 py-2 rounded-2xl border border-gray-800">
            <button
              className={`px-4 py-2 rounded-2xl transition-all ${!isAnnual ? "bg-[#1e293b] text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-2xl transition-all ${isAnnual ? "bg-[#1e293b] text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className="group relative flex flex-col h-full">
              <div
                className={`flex flex-col flex-grow p-8 rounded-2xl transition-all duration-500 bg-gradient-to-br ${plan.color} ${plan.hoverColor} border ${plan.borderColor} backdrop-blur-xl hover:shadow-2xl ${plan.glowColor} hover:scale-[1.02] bg-gray-900/40`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-max px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <div className="mb-6 flex items-center space-x-4 justify-center">
                  <div className="w-14 h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <plan.icon className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>
                  <h3 className={`text-3xl font-bold ${plan.iconColor} text-center`}>{plan.name}</h3>
                </div>
                <div className="flex items-baseline mb-6 text-center justify-center -mt-4">
                  <span className="text-2xl font-extrabold text-white">{isAnnual ? plan.annual : plan.monthly}</span>
                  {plan.monthly !== "Free" && (
                    <span className="text-gray-400 ml-2">/{isAnnual ? "year" : "month"}</span>
                  )}
                </div>
                <ul className="text-gray-300 space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className={`flex-shrink-0 mt-0.5 ${plan.iconColor}`}>
                        <Check className="h-5 w-5" />
                      </span>
                      <span className="group-hover:text-gray-200 transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button className="w-full py-3.5 rounded-xl font-medium transition-all duration-300 text-white flex items-center justify-center space-x-2 bg-gray-900 border border-gray-800 group-hover:bg-gray-800">
                    <span>{plan.monthly === "Free" ? "Get Started" : "Select Plan"}</span>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-all duration-300 group-hover:opacity-100" />
                  </button>
                </div>
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:text-purple-300 underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Upgrade
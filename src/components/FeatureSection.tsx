"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Smartphone,
  Shield,
  TrendingUp,
  Search,
  Bell,
  Download,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: PieChart,
      title: "Visual Analytics",
      description:
        "Interactive pie charts and bar graphs to visualize your spending patterns across different categories.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Monthly Reports",
      description:
        "Comprehensive monthly and weekly spending reports with detailed breakdowns and trends.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Calendar,
      title: "Date Tracking",
      description:
        "Track expenses by date with calendar view and historical data analysis.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description:
        "Filter expenses by category, date range, amount, and custom criteria for better insights.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Search,
      title: "Quick Search",
      description:
        "Find any expense instantly with powerful search functionality across all your transactions.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Fully responsive design that works perfectly on all devices - desktop, tablet, and mobile.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Your financial data is stored locally in your browser with no external servers involved.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: TrendingUp,
      title: "Spending Insights",
      description:
        "Get actionable insights about your spending habits and recommendations for better budgeting.",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Stay informed about your spending with intelligent alerts and budget notifications.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Download,
      title: "Export Data",
      description:
        "Export your expense data in various formats for external analysis and record keeping.",
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Smart Money Management
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to take control of your finances, track
            expenses, and make informed financial decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Ready to start your financial journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started Free
            </button>
            <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

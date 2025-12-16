import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Brain, Eye, Newspaper, Hourglass } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto pt-10 sm:px-6 lg:px-8 py-16 md:py-24 pb-5">
        <div className="flex flex-col lg:flex-row gap-16 items-start justify-between">
          <div className="flex-shrink-0 max-w-sm">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              No Distractions,
              <span className="block text-foreground">STAY FOCUSED,</span>
              <span className="block text-red-600">Straight Forward MEDIA</span>
            </h1>
            <div className="flex gap-4 mb-8 items-center">
              <Link to="/signin">
                <Button className="bg-black text-white hover:bg-gray-900 px-8 py-3 text-base">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex gap-2 flex-shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2F1e9ffb499d8f4bc1b493208a723d2d5d?format=webp&width=800"
              alt="LockedIn app interface mockup"
              className="h-80 w-auto"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2F941257f2f48f49df86c49277a1e6f86e?format=webp&width=800"
              alt="No mindless scrolling - stay focused"
              className="h-80 w-auto"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2F53284484e7df47038aa979c599496a5e?format=webp&width=800"
              alt="App features - fixed scrolling, verified news, low dopamine mode"
              className="h-80 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Grid - Be Mindful Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100  md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Be
              <span className="block text-red-600 text-5xl md:text-6xl font-bold mt-2">Mindful!</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
              Features designed to help you reclaim control of your digital life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Digital Wellness Card */}
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 group-hover:bg-red-600 transition-colors mb-4">
                <Heart className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">Digital Wellness</h3>
              <p className="text-sm text-muted-foreground">Protect your mental health with mindful design</p>
            </div>

            {/* Focus Mode Card */}
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 group-hover:bg-blue-600 transition-colors mb-4">
                <Brain className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">Focus Mode</h3>
              <p className="text-sm text-muted-foreground">Eliminate distractions and concentrate better</p>
            </div>

            {/* Content Filtering Card */}
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-600 transition-colors mb-4">
                <Eye className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">Content Filtering</h3>
              <p className="text-sm text-muted-foreground">Smart curation of what matters to you</p>
            </div>

            {/* Verified News Card */}
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 group-hover:bg-green-600 transition-colors mb-4">
                <Newspaper className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">Verified News</h3>
              <p className="text-sm text-muted-foreground">Only trusted sources, no misinformation</p>
            </div>

            {/* Fixed Scrolling Card */}
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 group-hover:bg-amber-600 transition-colors mb-4">
                <Hourglass className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fixed Scrolling</h3>
              <p className="text-sm text-muted-foreground">Control your time, not endless feeds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our App Helps Section */}
      <section className="bg-white border-t border-gray-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="pr-6">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                <span className="text-red-600">Our App</span> Helps you stay aware of your precious
                <span className="block text-red-600">Time!</span>
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Our app keeps you mindful of your time with a finite feed, gentle reminders, and low-dopamine design — helping you connect meaningfully without endless scrolling or losing hours.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2Fa5eb334962de49558cb21c2bd157349f?format=webp&width=800"
                alt="Addictive vs Mindful comparison"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Stay Focused?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands who are reclaiming their time and attention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg">
                Create Account
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 LockedIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

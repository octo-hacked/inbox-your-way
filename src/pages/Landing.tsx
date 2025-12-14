import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2F556c038b85e942c2b15d53e3710e039f?format=webp&width=800" 
              alt="LockedIn Logo" 
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin">
              <Button variant="ghost" className="text-white hover:text-gray-300">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-red-600 hover:bg-red-700">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              No Distractions,
              <span className="block text-foreground">STAY FOCUSED.</span>
              <span className="block text-red-600">Straight Forward MEDIA</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Our app keeps you mindful of your time with a finite feed, gentle reminders, and low-dopamine design.
            </p>
            <div className="flex gap-4">
              <Link to="/signup">
                <Button className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 mt-6">
              <span className="text-sm text-muted-foreground">get the app on :</span>
              <a href="#" className="text-sm hover:underline">▶ PlayStore</a>
              <a href="#" className="text-sm hover:underline">🍎 AppStore</a>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2F32c5f9ac38c5436fab13c805f9a0b668?format=webp&width=800" 
              alt="App features mockup" 
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Be <span className="text-red-600">Mindful!</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our App Helps you stay aware of your precious Time!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {[
              { icon: "🧘", title: "DIGITAL WELLNESS", desc: "Stay mindful of your usage" },
              { icon: "🎯", title: "FOCUS MODE", desc: "Reduce distractions" },
              { icon: "👁️", title: "CONTENT FILTERING", desc: "Control what you see" },
              { icon: "📰", title: "VERIFIED NEWS", desc: "Trust your sources" },
              { icon: "⏳", title: "FIXED SCROLLING", desc: "Finite feed only" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Our App Helps you stay aware of your precious <span className="text-red-600">Time!</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Our app keeps you mindful of your time with a finite feed, gentle reminders, and low-dopamine design — helping you connect meaningfully without endless scrolling or losing hours.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  <span>Fixed scrolling - No endless feed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  <span>Verified news - Trust your sources</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600">✓</span>
                  <span>Low dopamine mode - Reduce stimulation</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2Ff8c798f7606042bbaa40a2a8f75192a4?format=webp&width=800" 
                alt="Addictive vs Mindful comparison" 
                className="w-full"
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

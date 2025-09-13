import { Home, MessageCircle, Bell, BookOpen, Settings, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Sidebar = () => {
  const navigationItems = [
    { icon: Home, label: "Home", isActive: true },
    { icon: MessageCircle, label: "Messages" },
    { icon: Bell, label: "Notifications" },
    { icon: BookOpen, label: "Capsules" },
  ];

  const contentFilters = [
    "Memes",
    "Memes", 
    "Memes",
    "Memes",
    "Memes"
  ];

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-border p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">LockedIn</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              item.isActive 
                ? "text-accent font-medium" 
                : "text-foreground hover:bg-hover-bg"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-foreground font-medium">Content Filter</span>
          <Switch />
        </div>
        <div className="space-y-2">
          {contentFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted"></div>
              <span className="text-muted-foreground text-sm">{filter}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Toggles */}
      <div className="space-y-4 mb-auto">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">Low Dopamine</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">Monochrome</span>
          <Switch />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-foreground hover:bg-hover-bg transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-foreground hover:bg-hover-bg transition-colors">
          <User className="w-5 h-5" />
          Profile
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
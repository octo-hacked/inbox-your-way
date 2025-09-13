import { Home, MessageCircle, Bell, BookOpen, Settings, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  monochrome: boolean;
  onToggleMonochrome: (checked: boolean) => void;
};

const Sidebar = ({ monochrome, onToggleMonochrome }: SidebarProps) => {
  const location = useLocation();
  
  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: BookOpen, label: "Capsules", path: "/capsules" },
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
          <Link
            key={item.label}
            to={item.path}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              location.pathname === item.path
                ? "text-accent font-medium" 
                : "text-foreground hover:bg-hover-bg"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
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
          <Switch checked={monochrome} onCheckedChange={onToggleMonochrome} />
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

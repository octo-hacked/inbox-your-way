import Sidebar from "@/components/Sidebar";
import MainFeed from "@/components/MainFeed";
import InboxSidebar from "@/components/InboxSidebar";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MainFeed />
      <InboxSidebar />
    </div>
  );
};

export default Index;

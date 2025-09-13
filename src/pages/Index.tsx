import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainFeed from "@/components/MainFeed";
import InboxSidebar from "@/components/InboxSidebar";

const Index = () => {
  const [monochrome, setMonochrome] = useState(false);

  return (
    <div className={`flex min-h-screen bg-background ${monochrome ? "grayscale" : ""}`}>
      <Sidebar monochrome={monochrome} onToggleMonochrome={setMonochrome} />
      <MainFeed />
      <InboxSidebar />
    </div>
  );
};

export default Index;

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainFeed, { type FeedPost } from "@/components/MainFeed";
import InboxSidebar from "@/components/InboxSidebar";

const Index = () => {
  const [monochrome, setMonochrome] = useState(false);
  const [postPreview, setPostPreview] = useState<FeedPost | null>(null);

  return (
    <div className={`flex min-h-screen bg-background ${monochrome ? "grayscale" : ""}`}>
      <Sidebar monochrome={monochrome} onToggleMonochrome={setMonochrome} />
      <MainFeed onOpenComments={(post) => setPostPreview(post)} />
      <InboxSidebar postPreview={postPreview} onBackFromPost={() => setPostPreview(null)} />
    </div>
  );
};

export default Index;

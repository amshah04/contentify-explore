
import { useState } from "react";
import { StoriesContainer } from "@/components/stories/stories-container";
import { PostsContainer } from "@/components/posts/posts-container";
import { VideosContainer } from "@/components/videos/videos-container";
import { Layout } from "@/components/layout/layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"feeds" | "videos">("feeds");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <StoriesContainer />
        
        <div className="mb-6">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "feeds" | "videos")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feeds">Feeds</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === "feeds" ? <PostsContainer /> : <VideosContainer />}
      </div>
    </Layout>
  );
}

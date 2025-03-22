
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
            <TabsList className="grid w-full grid-cols-2 bg-secondary/60 p-1.5">
              <TabsTrigger 
                value="feeds" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-social-purple data-[state=active]:to-social-blue data-[state=active]:text-white"
              >
                Feeds
              </TabsTrigger>
              <TabsTrigger 
                value="videos" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-social-blue data-[state=active]:to-social-pink data-[state=active]:text-white"
              >
                Videos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === "feeds" ? <PostsContainer /> : <VideosContainer />}
      </div>
    </Layout>
  );
}

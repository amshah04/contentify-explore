
import { StoriesContainer } from "@/components/stories/stories-container";
import { PostsContainer } from "@/components/posts/posts-container";
import { Layout } from "@/components/layout/layout";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <StoriesContainer />
        <PostsContainer />
      </div>
    </Layout>
  );
}

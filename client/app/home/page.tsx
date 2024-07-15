import { createClient } from "@/utils/supabase/server";
import DisplayEmail from "../../components/ui/DisplayEmail";
import { Button } from "@/components/ui/button";
import { logOut } from "./actions";

async function getProfile() {
  const supabase = createClient();
  const {data: {user}} = await supabase.auth.getUser();
  const id = user?.id;
  const {data, error} = await supabase.from('profiles').select('friends').eq('id', id);
  if (error) {
    throw error;
  }
  let postid = []
  for (let i = 0; i < data.length; i++) {
    const posts = await supabase.from('profiles').select('posts').eq('id', data[i]);
    if (posts.error) {
      throw posts.error;
    }
    for (let j = 0; j < posts.data.length; j++) {
      postid.push(posts.data[j]);
    }

  }

  return postid;

}
  
const Home : ({}: any) => Promise<JSX.Element> = async ({}) => {
    const posts = await getProfile();
  return (
    <div className="flex flex-col">
      <div className="mx-auto">
        <form>
          <button className="bg-white text-black" formAction={logOut}>Log Out</button>
        </form>
        {posts.map((post : any) => (
          <div key={post.id} className="border border-gray-300 p-4 my-4">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
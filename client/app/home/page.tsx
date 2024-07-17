import { createClient } from "@/utils/supabase/server";
import DisplayEmail from "../../components/ui/DisplayEmail";
import { Button } from "@/components/ui/button";
import { logOut } from "./actions";
import Post from "@/components/post";

async function getProfile() {
  const supabase = createClient();
  const {data: {user}} = await supabase.auth.getUser();
  const id = user?.id;
  const {data, error} = await supabase.from('profiles').select('friends').eq('id', id);
  if (error) {
    throw error;
  }

  let postid = []
  for (let i = 0; i < data[0].friends.length; i++) {
    const posts = await supabase.from('profiles').select('posts').eq('id', data[0].friends[i]);
    if (posts.error) {
      throw posts.error;
    }
    //console.log(posts)
    for (let j = 0; j < posts.data.length; j++) {
      //console.log(posts.data[j].posts)
      postid.push(posts.data[j].posts[0]);
    }

  }

  return postid;


}
  
const Home : ({}: any) => Promise<JSX.Element> = async ({}) => {
    const posts = await getProfile();
    //console.log(posts)
  return (
    <div className="flex flex-col">
      <div className="mx-auto">
        <form>
          <button className="bg-white text-black" formAction={logOut}>Log Out</button>
        </form>
        {posts.map((post : any) => (
          <Post id={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
import { createClient } from "@/utils/supabase/server";
import DisplayEmail from "../../components/ui/DisplayEmail";
import { Button } from "@/components/ui/button";
import { logOut } from "./actions";

export async function getProfile() {
  const supabase = createClient();
  const {data: {user}} = await supabase.auth.getUser();
  const id = user?.id;
  const email = await supabase.from('profiles').select('email').eq('id', id);
  const emailobj = email.data ? email.data[0] : null;
  const emailaddress = emailobj ? emailobj.email : null;
  return emailaddress;

}
  
const Home : ({}: any) => Promise<JSX.Element> = async ({}) => {
    const email = await getProfile();
  return (
    <div>
      {email && <DisplayEmail user={{email}} />}
      <h1>{email}</h1>
      <form>
        <button className="bg-black" formAction={logOut}>Log Out</button>
      </form>
    </div>
  );
};

export default Home;
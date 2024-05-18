import { createClient } from "@/utils/supabase/server";
import DisplayEmail from "../../components/ui/DisplayEmail";
  
  

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
    </div>
  );
};

export default Home;
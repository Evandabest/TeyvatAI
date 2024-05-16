import { createClient } from "@/utils/supabase/server";
import DisplayEmail from "../components/DisplayEmail";
  
  interface DisplayEmailProps {
       id: string;
       aud: string;
       role: string;
       email: string;
       email_confirmed_at: string;
       phone: string;
       confirmation_sent_at: string;
       confirmed_at: string;
       last_sign_in_at: string;
       app_metadata: object;
       user_metadata: object;
       identities: Array<any>;
       created_at: string;
       updated_at: string;
       is_anonymous: boolean;
       
  }
  

export async function getProfile() {
  const supabase = createClient();
  const {data: {user}} = await supabase.auth.getUser();
  console.log(user);

  return user;
}
  
const Home : ({}: DisplayEmailProps) => Promise<JSX.Element> = async ({}) => {
    const user1 = await getProfile();
  return (
    <div>
      {user1 && <DisplayEmail user={user1} />}
    </div>
  );
};

export default Home;
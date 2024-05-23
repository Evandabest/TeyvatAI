import { createClient } from "@/utils/supabase/server";

const NotificationsPage = async () => {
  const supabase = createClient()
  const {data: {user}} = await supabase.auth.getUser();
  const id = user?.id;
  //const {data, error} = await supabase.from("profiles").select('notifications').eq('id', id);

  return (
    <div>
      <h1>Notifications</h1>

    </div>
  );
}

export default NotificationsPage;
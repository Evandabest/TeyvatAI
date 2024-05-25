import { createClient } from "@/utils/supabase/server";

const NotificationsPage = async () => {
  const supabase = createClient()
  const {data: {user}} = await supabase.auth.getUser();
  const id = user?.id;
  const {data, error} = await supabase.from("profiles").select('notifications').eq('id', id);
  
  let notifications;
  if (data && data[0]) {
    notifications = data[0].notifications;
  }
  
  console.log(notifications)

  const {time, type, sender} = notifications[0];
  console.log(time, type, sender)
  const users = await supabase.from('profiles').select('username').eq('id', sender);
  const userobj = users.data ? users.data[0] : null;
  const userName = userobj ? userobj.username : null;

  return (
    <div>
      <p>{time}</p>
      <p>{userName} sent you a friend request</p>
    </div>
  );
}

export default NotificationsPage;
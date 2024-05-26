import { createClient } from "@/utils/supabase/server";
import UpdateFriend from "./updateFriend";

const NotificationsPage = async () => {
  const supabase = createClient()
  const {data: {user}} = await supabase.auth.getUser();
  const id = user?.id;
  const {data, error} = await supabase.from("profiles").select('notifications').eq('id', id);
  
  let notifications: any;
  if (data && data[0]) {
    notifications = data[0].notifications;
  }
  console.log(notifications)
  
  //
  //console.log(notifications)

  //const {time, type, sender} = notifications[0];
  //console.log(time, type, sender)
  //const users = await supabase.from('profiles').select('username').eq('id', sender);
  //const userobj = users.data ? users.data[0] : null;
  //const userName = userobj ? userobj.username : null;


  const usernames = await Promise.all(
    notifications.map((notification: any) => 
      supabase.from('profiles').select('username').eq('id', notification.sender)
    )
  );


  return (
    <div>
    {notifications && notifications.map((notification: any, index: any) => {
      // Get the username for this notification
      const userobj = usernames[index].data ? usernames[index].data[0] : null;
      const userName = userobj ? userobj.username : null;

      switch (notification.type) {
        case 'friend request':
          return (
            <div key={index}>
              <p>Time: {notification.time}</p>
              <p>Friend request from: {userName}</p>
              <UpdateFriend props ={notification.sender} />
            </div>
          );
        case 'post':
          return (
            <div key={index}>
              <p>Time: {notification.time}</p>
              <p>New post from: {notification.sender}</p>
            </div>
          );
        case 'message':
          return (
            <div key={index}>
              <p>Time: {notification.time}</p>
              <p>New message from: {notification.sender}</p>
            </div>
          );
        default:
          return null;
      }
    })}
  </div>
  );
}

export default NotificationsPage;
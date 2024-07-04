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
  
  const usernames = await Promise.all(
    notifications.map((notification: any) => 
      supabase.from('profiles').select('username').eq('id', notification.sender)
    )
  );

  function getTimePassed(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime(); // milliseconds between now & past
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // days
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // hours
    const diffMins = Math.round(((diffMs % (1000 * 60 * 60)) / (1000 * 60))); // minutes
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }
    else {
      return `${diffHrs}h, ${diffMins}m ago`;
    }
    
    
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="m-auto text-2xl my-2">Notifications</h1>
      <div className="flex flex-col overflow-y-auto">
    {notifications && notifications.map((notification: any, index: any) => {
      // Get the username for this notification
      const userobj = usernames[index].data ? usernames[index].data[0] : null;
      const userName = userobj ? userobj.username : null;

      switch (notification.type) {
        case 'friend request':
          return (
            <div key={index} className="bg-slate-400 rounded-lg my-4 p-4">
              <p className="text-white text-lg">Friend request from {userName}</p>
              <p className="text-white text-sm">{getTimePassed(notification.time)}</p>
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
  </div>
  );
}

export default NotificationsPage;
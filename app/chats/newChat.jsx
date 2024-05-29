"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"


  
  const NewChat = async (props) => {
    const router = useRouter()
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser();
    const id = user?.id;

    const startChat = async (friend) => {
        const { data: existingChat, error: fetchError } = await supabase
                .from('chats')
                .select('*')
                .eq('id', `${id}--${friend}`)||  await supabase
                .from('chats')
                .select('*')
                .eq('id', `${friend}--${id}`)
    
            if (fetchError) {
                console.error('Error fetching existing friend requests:', fetchError);
                return;
            }
        
        if (existingChat.length > 0) {
            console.log('Chat already exists');
            router.push(existingChat[0].id)
        }

        const { data: newChat, error: insertError } = await supabase.from('chats').insert({ id: `${id}--${friend}` })

        if (insertError) {
            console.error('Error fetching existing friend requests:', fetchError);
            return;
        }
        console.log(newChat)

        router.push(`/chats/${id}--${friend}`)

    }



    return (
        <AlertDialog>
            <AlertDialogTrigger>Start a new Chat</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Friends</AlertDialogTitle>
                <AlertDialogCancel>x</AlertDialogCancel>
                    {props && props.props && props.props.map((friend, index) => {
                        return (
                            <div key={index}>
                                <AlertDialogDescription>
                                    {friend.username}
                                </AlertDialogDescription>
                                <AlertDialogAction onClick={() => startChat(friend.id)}>Start Chat</AlertDialogAction>
                            </div>
                        )
                    })}
                    </AlertDialogContent>
                    </AlertDialog>
                )
    }

export default NewChat;

  
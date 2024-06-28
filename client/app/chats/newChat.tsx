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
import { useEffect } from "react";

interface Friend {
    id: string;
    username: string;
}
  
  const NewChat =  ({friend}: {friend: Friend[]}) => {
    const router = useRouter()
    const supabase = createClient()
    
    useEffect(() => {
        const getUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const id = user?.id;
            if (!id) {
                console.error('Error fetching user:')
                return;
            }
        }
        getUser();
    }, [supabase])


    const startChat = async ({id} : {id: string}) => {
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
            const ChatId = existingChat[0].id
            router.push(`/chats/${ChatId}`)
        }

        const { data: newChat, error: insertError } = await supabase.from('chats').insert({ id: `${id}--${friend}` })

        if (insertError) {
            console.error('Error fetching existing friend requests:', fetchError);
            return;
        }
        console.log(newChat)

        const Chatid = `${id}--${friend}`

        router.push(`/chats/${Chatid}`)

    }



    return (
            <AlertDialog>
                <AlertDialogTrigger className="text-white bg-slate-400 rounded-md p-2">Start a new Chat</AlertDialogTrigger>
                <AlertDialogContent className="flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-center w-full">
                        <AlertDialogTitle className="text-xl">Friends</AlertDialogTitle>
                        <div className="flex flex-row items-center justify-end w-full">
                        <AlertDialogCancel className="">X</AlertDialogCancel>
                        </div>
                    </div>
                        {friend && friend.map((friend, index) => {
                            return (
                                <div key={index} className="flex flex-row items-center justify-between w-full">
                                    <AlertDialogDescription className="text-black">
                                        {friend.username}
                                    </AlertDialogDescription>
                                    <AlertDialogAction className="" onClick={() => startChat({ id: friend.id })}>Start Chat</AlertDialogAction>
                                </div>
                            )
                        })}
                </AlertDialogContent>
            </AlertDialog>
        )
    }

export default NewChat;

  
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
import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import 'boxicons/css/boxicons.min.css'; 


const Chatbot = () => {
    const [chats, setChats] = useState<any>([])
    const [current_id, setCurrentId] = useState("")
    const [currentPfp, setCurrentPfp] = useState("")
    const [message, setMessage] = useState<string>("");
    const supabase = createClient()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const getInfo = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            const current_id = user?.id;
            if (current_id) {
                setCurrentId(current_id);
            }
            else {
                console.error('Error fetching user:')
                return;
            }
            const { data: chats, error } = await supabase
                .from('chatbot')
                .select('messages')
                .eq('id', current_id);

            const messages = chats?.map(chat => chat.messages);
            if (messages) {
                const message = messages[0]
                setChats(message);
            }
            else {
                console.error('Error fetching messages:', error);
                return;
            }

            const data = await supabase.from('profiles').select('pfp').eq('id', current_id).single();
            if (data.error) {
                console.error('Error fetching pfp:', data.error);
                return;
            }
            setCurrentPfp(data.data.pfp);

        }
        getInfo()
    }, [supabase])

    useEffect(() => {        
        const channel = supabase
                .channel('table-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'chatbot',
                    },
                    (payload) => {
                        const newMessages = (payload.new as { messages: any }).messages;
                        setChats(newMessages);
                    }
                )
                .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [supabase])
    
    useEffect(() => {
        scrollToBottom()
    }, [chats])

    const sendMessage = async (event: React.MouseEvent) => {
        event.preventDefault();
        console.log(message)
    
        const chatMessage = {
            sender: current_id,
            message: message,
            timestamp: new Date().toISOString()
        }
    
        let latestMessage = chats ? [...chats.flat(), chatMessage] : [chatMessage];
    
        console.log(chats, chatMessage)
        const { data: newMessage, error } = await supabase
            .from('chatbot')
            .update({ messages: latestMessage})
            .eq('id', current_id);
    
        if (error) {
            console.error('Error sending message:', error);
        } else {
            setMessage('');
        }

        const url = `https://teyvatai.onrender.com/api/chat`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: message,
                id: current_id
            })
        });
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger className="fixed bottom-10 right-0 mb-4 mr-4 flex">
                    <i className='bx bx-lg bx-bot'></i>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader className="flex flex-row items-center w-full">
                    <AlertDialogTitle>Teyvat Tinker</AlertDialogTitle>
                    <AlertDialogCancel className="flex ml-[16rem]">Cancel</AlertDialogCancel>
                    </AlertDialogHeader>
                    <>
                        {chats ? (
                            <>
                         <AlertDialogDescription>
                            <div className="flex flex-col m-auto rounded-md bg-slate-700">
                                <p className="m-auto my-4 text-white">Chat With Teyvat&apos;s Tinker</p>
                                <div className="mx-4 flex flex-grow flex-col h-96 bg-white overflow-y-scroll">
                                    {chats?.map((message : any , index : any) => (
                                        message.sender === current_id ? (
                                            <>
                                                <div className='flex flex-row justify-end mr-4'>
                                                    <p className=" text-end mx-4 text-black my-2" key={index}>{message.message}</p>
                                                    <img className="rounded-full h-8 w-8" src={currentPfp} alt="Profile Picture" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-start text-gray-500 mx-4 text-sm">Teyvat&apos;s Tinker</p>
                                                <p className="text-start mx-4 text-black" key={index}>{message.message}</p>
                                            </>
                                        )
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="flex my-4 flex-row m-auto w-full">
                                    <Input className="w-full mx-2" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    <Button  className = "mx-2" onClick={(event) => sendMessage(event)}>Send</Button>
                                </div>
                            </div>
                        </AlertDialogDescription>
                        </>
                            )  : (
                        <>
                                <p>No messages</p>
                                <div className="flex my-4 flex-row m-auto w-full">
                                    <Input className="w-full mx-2" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    <Button  className = "mx-2" onClick={(event) => sendMessage(event)}>Send</Button>
                                </div>
                            </>
                        )}
                    </>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export default Chatbot
"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"



const InputMessage = ({id, sender, chats}: {id: string, sender: string, chats: any}) => {
    const supabase = createClient();
    const [message, setMessage] = useState<string>("");

    const sendMessage = async (event: React.MouseEvent) => {
        event.preventDefault();

        const chatMessage = {
            sender: sender,
            message: message,
            timestamp: new Date().toISOString()
        }
        const latestMessage  = [...chats, chatMessage]
        console.log(chats, chatMessage)
        const { data: newMessage, error } = await supabase
            .from('chats')
            .update({ messages: latestMessage})
            .eq('id', id);

        if (error) {
            console.error('Error sending message:', error);
        } else {
            setMessage('');
        }
    }

    return (
        <div>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button onClick={(event) => sendMessage(event)}>Send</Button>
        </div>
    );
}

export default InputMessage;
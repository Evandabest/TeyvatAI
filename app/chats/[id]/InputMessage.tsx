"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

const inputMessage = () => {
    const supabase = createClient();
    const [message, setMessage] = useState<string>("");


    const sendMessage = async (message: string) => {
        
    }

    return (
        <>
            <form >
                <Input
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </form>
        </>
    )
}

export default inputMessage;
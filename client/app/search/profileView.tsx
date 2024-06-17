"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ProfileViewForm = ({userId , username}: {userId: string, username: string}) => {
    const router = useRouter();
    
    const handleProfileView = async (event: React.FormEvent) => {
        event.preventDefault();
        router.push(`/profile/${userId}`)
    }

    return (
        <form onSubmit={handleProfileView}>
            <h1>{username}</h1>
            <Button type="submit">View</Button>
        </form>
    );
}

export default ProfileViewForm
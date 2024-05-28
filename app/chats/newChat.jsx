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

  
  const NewChat = (props) => {


    return (
        <AlertDialog>
            <AlertDialogTrigger>Start a new Chat</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Friends</AlertDialogTitle>
                <AlertDialogCancel>x</AlertDialogCancel>
                    {props && props.friends && props.friends.map((friend, index) => {
                        console.log(friend)
                        return (
                            <div key={index}>
                                <AlertDialogDescription>
                                    {friend.username}
                                </AlertDialogDescription>
                                <AlertDialogAction>Start Chat</AlertDialogAction>
                            </div>
                        )
                    })}
                    </AlertDialogContent>
                    </AlertDialog>
                )
    }

export default NewChat;

  
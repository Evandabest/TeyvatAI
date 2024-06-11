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

const Chatbot = () => {
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger>Chat</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Teyvat Tinker</AlertDialogTitle>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export default Chatbot

import 'boxicons/css/boxicons.min.css'; 
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

const NavBar = () => {
  return (
    <div>
        <i className='bx bxs-home-circle'></i>
        <img src="/logo.png" alt="logo" />
        <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
            <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
        </Sheet>
    </div>
  );
}

export default NavBar;
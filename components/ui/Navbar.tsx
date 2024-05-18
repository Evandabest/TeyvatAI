"use client"
import 'boxicons/css/boxicons.min.css'; 
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';
  

const NavBar = () => {
    const router = useRouter()
    const goHome = () => {
        router.push('/home')
    }
  return (
    <div className='flex-row flex justify-evenly'>
        <button onClick={goHome}><i className='bx bxs-home-circle'></i></button>
        <img className=' w-20' src="/logo.png" alt="logo" />
        <Sheet>
            <SheetTrigger><i className ='bx bx-menu'></i></SheetTrigger>
            <SheetContent className=' max-w-20'>
                    <SheetHeader>
                        <SheetTrigger><i className='bx bx-message-rounded-dots' ></i></SheetTrigger>
                        <SheetTrigger><i className='bx bxs-book' ></i></SheetTrigger>
                        <SheetTrigger><i className='bx bxs-user' ></i></SheetTrigger>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </div>
  );
}

export default NavBar;
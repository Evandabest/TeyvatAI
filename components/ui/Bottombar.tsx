"use client"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
  

const Bottombar = () => {
    return (
        <>
        <div className="flex-row flex justify-evenly">
            <i className='bx bxs-bell'></i>
            <i className='bx bx-plus' ></i>
            <i className='bx bx-search-alt-2' ></i>
        </div>
        </>
    );
}

export default Bottombar;
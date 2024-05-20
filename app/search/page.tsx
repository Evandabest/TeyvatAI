"use server"
import { Input } from "@/components/ui/input";
//import { handleSearch } from "./actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Searches from "./searches";


//const search : ({}: any) => Promise<JSX.Element> = async ({}) => {
//    const handleSearches = async (event: any) => {
//        event.preventDefault();
//        const form = new FormData(event.target);
//        const userName = form.get('userName') as string; // Extract the value of the input field
//        if (!userName) {
//            return;
//        }
//        const response = await handleSearch(userName); // Pass the value to the handleSearch function
//        return response;
//    }
//    const getSearch = async (prop: any) => {
//        const Searches: any[][] = await prop;
//        return Searches;
//    }
//
//
//    return (
//        <div>
//            <h1>Search Page</h1>
//            {/*}
//            <form >
//                <Input placeholder="Search" id="userName" name="userName" type="userName" required/>
//                <Button formAction = {} type="submit">Search</Button>
//            </form>
//            */}
//        </div>
//    )
//}
//export default search;

import Search from "./searches";
import {Suspense} from "react";
import UsersList from "./userlist";

const Page = ({searchParams}: {searchParams?: {query?: string}}) => {
    const query = searchParams?.query || "";

    return (
        <div>
            <Search />
            <Suspense key={query} fallback={<p>Loading...</p>}>
                <UsersList query={query} />
            </Suspense>
        </div>
    );
};

export default Page;
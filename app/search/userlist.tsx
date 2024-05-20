import { Button } from "@/components/ui/button";
import {fetchUsersSearch} from "./actions";
import { redirect } from "next/navigation";
import ProfileViewForm from "./profileView";

const UsersList = async ({query}: {query: string}) => {
    "use server"
    const {data: users} = await fetchUsersSearch(query);

    return (
        <>
            {users? users.map(user => (
                <ProfileViewForm key={user.id} userId={user.id} username={user.username} />
            )): null}
        </>
    );
};

export default UsersList;
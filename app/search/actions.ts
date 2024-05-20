
import { createClient } from "@/utils/supabase/server"


//export async function handleSearch(form:string ) {
//    const supabase = createClient();
//    const response = await supabase.from('profiles').select('*').ilike('username', `%${form}%`);
//    const results = [];
//    console.log(response);
//    if (response.error) {
//        console.log(response.error);
//        return { error: response.error };
//    } else {
//        results.push(response.data);
//    }
//    return { data: results };
//}

export async function fetchUsersSearch (query: string) {
    const supabase = createClient();
    const {data, error} = await supabase.from('profiles').select('*').ilike('username', `%${query}%`);
    return {data, error}; 
}


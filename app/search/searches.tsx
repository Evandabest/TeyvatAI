
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";

const Search = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.delete("page");
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className='relative flex flex-1 flex-shrink-0'>
            <label htmlFor='search' className='sr-only'>
                Search
            </label>
            <Input
                placeholder={'Search usernames'}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()}
            />
        </div>
    );
}

export default Search;
import {useRouter} from "next/router";
import {Details} from "@/src/components";

export default function DetailsScreen() {
    const {query} = useRouter();

    return (
        <>
            {query.id}
            <Details/>
        </>
    )
}
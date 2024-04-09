import {Create} from "@/src/components";
import {useCallback} from "react";
import {useCrowdfundingList} from "@/src/hooks/useCroudfundingList";

export default function CreateScreen() {
    const crowdfunding = useCrowdfundingList();
    const onCreate = useCallback(async (formData: Record<string, any>) => {
        await crowdfunding.create(formData.name, formData.description, formData.image, formData.goal, formData.deadline);
    }, [crowdfunding])

    return <Create onCreate={onCreate}/>
}
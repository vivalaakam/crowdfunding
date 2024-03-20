import {Input, Textarea, UploadImage} from "@/src/components";
import {useCallback, useState} from "react";

export type CreateProps = {
    onCreate: (form: Record<string, any>) => void
}

export function Create({onCreate}: CreateProps) {
    const [form, setForm] = useState<Record<string, any>>({})

    const onSubmit = useCallback(() => {
        onCreate(form);
    }, [form, onCreate])

    console.log('form', form);

    return (
        <div>
            <Input label="Crowdfunding name" type="text" value={form['name'] ?? ''} onChange={(e) => {
                setForm((form) => ({...form, name: e.target.value}))
            }}/>

            <Textarea label="Crowdfunding description" value={form['description'] ?? ''} onChange={(e) => {
                setForm((form) => ({...form, description: e.target.value}))
            }}/>

            <UploadImage label="Crowdfunding preview" value={form['image']} onChange={(e) => {
                setForm((form) => ({...form, image: e}))
            }}/>

            <Input label="Crowdfunding goal" type="number" value={form['goal'] ?? ''} onChange={(e) => {
                setForm((form) => ({...form, goal: e.target.value}))
            }}/>

            <Input label="Crowdfunding duration" type="date" value={form['deadline'] ?? ''} onChange={(e) => {
                setForm((form) => ({...form, deadline: e.target.value}))
            }}/>

            <button onClick={onSubmit}>Submit</button>
        </div>
    )
}
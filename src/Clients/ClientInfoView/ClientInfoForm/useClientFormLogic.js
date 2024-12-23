import { useState } from "react"

export const useClientFormLogic = (form, saveClientInfo) => {
    const [saving, setSaving] = useState(false)
    const onFinish = async(values) => {
        setSaving(true)
        const formData = new FormData()
        for (const key in values) {
            formData.append(key, values[key] || "")
        }

        const result = await saveClientInfo(formData)
        setSaving(false)
        if(result){
            form.resetFields()
            document.location.reload()
        } 
    }

    return {
        onFinish,
        saving
    }
}
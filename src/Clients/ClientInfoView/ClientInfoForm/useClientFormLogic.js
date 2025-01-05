import { notification } from "antd"
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
            notification.success({
                message: "Tus datos fueron actualizados con exito",
                description: "Cerraremos tu sesión",
                duration: 2,
                pauseOnHover: false,
                showProgress: true
            })

            setTimeout(() => {
                document.location.reload()
            }, 2500);
        } 
    }

    return {
        onFinish,
        saving
    }
}
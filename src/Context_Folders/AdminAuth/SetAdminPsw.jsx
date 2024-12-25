import { message, notification } from "antd";
import { processRequests } from "../../utils/processRequests";
import { apis } from "../../utils/apis";

const setAdminPassword = async(password, admin_email) => {
    try {
        const response = await fetch(`${apis.backend}/api/admins/set-admin-psw/${admin_email}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({password})
        });

        const responseData = await processRequests(response)
        if(!response.ok) throw new Error(responseData.msg)
        message.success(`${responseData.msg}`)
        return true
    } catch (error) {
        console.log(error)
        notification.error({
            message: "No fue posible actualizar la contraseña",
            description: error.message,
            duration: 5,
            pauseOnHover: false,
            showProgress: true
        })
        return false
    }
}

export default setAdminPassword
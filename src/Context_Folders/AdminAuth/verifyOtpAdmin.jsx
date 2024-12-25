import { notification } from "antd"
import { apis } from "../../utils/apis"
import { processRequests } from "../../utils/processRequests"

const verifyOtpAdmin = async(otpCode, admin_email) => {
    try {
        const response = await fetch(`${apis.backend}/api/admins/verify-admin-otp/${otpCode}?admin_email=${admin_email}`)
        const responseData = await processRequests(response)
        console.log(responseData)
        if(!response.ok) throw new Error(responseData.msg)
            notification.success({
                message: "Código OTP correcto",
                description: "Ahora puedes ingresar la contraseña de tu cuenta"
            })
        return true
    } catch (error) {
        console.log(error)
        notification.error({
            message: "No fue posible verificar el OTP",
            description: error.message,
            duration: 5,
            pauseOnHover: false,
            showProgress: true
        })
        return false
    }
}

export default verifyOtpAdmin
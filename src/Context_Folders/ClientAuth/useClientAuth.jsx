import { message, notification } from "antd"
import { apis } from "../../utils/apis"
import { processRequests } from "../../utils/processRequests"
import useRetriveSession from "../VerifySession/useSession"

const useClientAuth = () => {
    const { retrieveSession } = useRetriveSession()
    const loginClientWithEmail = async (client_email) => {
        try {
            const response = await fetch(`${apis.backend}/api/clients/login-client/${client_email}`, {
                method: "PUT"
            })
            if (response.status === 404) {
                notification.info({
                    message: "No se encontro ningun usuario con ese correo",
                })

                return false
            }
            const responseData = await processRequests(response)

            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible iniciar sesion",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const createNewClient = async (clientEmail) => {
        try {
            const response = await fetch(`${apis.backend}/api/clients/new-client/${clientEmail}`, {
                method: "POST"
            })
            const responseData = await processRequests(response)
            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible crear el usuario",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const verifyAuthCodeClients = async (authCode, clientEmail) => {
        try {
            const response = await fetch(`${apis.backend}/api/clients/verify-auth-code?otpCode=${authCode}&client_email=${clientEmail}`, {
                method: "PUT"
            })
            const responseData = await processRequests(response)

            console.log("Response Data: ", responseData)
            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)

            const sessionData = {
                user_id : responseData.user.id,
                user_type: "client",
            }
            localStorage.setItem("session_data", JSON.stringify(sessionData))
            await retrieveSession()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible verificar el codigo",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    return {
        loginClientWithEmail,
        createNewClient,
        verifyAuthCodeClients
    }
}

export default useClientAuth
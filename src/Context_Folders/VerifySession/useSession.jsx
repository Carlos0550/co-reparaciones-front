import { notification, Spin } from "antd"
import { apis } from "../../utils/apis"
import { processRequests } from "../../utils/processRequests"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const useRetriveSession = () => {
    const [loginData, setLoginData] = useState([])
    const navigate = useNavigate()
    const retrieveSession = async () => {
        setTimeout(() => {
            notification.open({
                icon: <Spin />,
                message: "Verificando sesión",
                description: "Estamos verificando tu sesión, por favor espere...",
                duration: 0
            })
        }, 100);

        try {
            const session = localStorage.getItem("session_data")

            if (!session) {
                console.log("No se encontraron rastros de la sesión anterior")
                return false
            }

            const sessionData = JSON.parse(session)
            const {
                user_id,
                user_type
            } = sessionData

            if (!user_id || !user_type) {
                console.log("Los datos de la sesión anterior no son válidos")
                return false
            }

            const response = await fetch(`${apis.backend}/session/retrieve-session-data?user_type=${user_type}&user_id=${user_id}`)
            const responseMsg = await processRequests(response)

            if (!response.ok) {
                console.log(responseMsg)
                return false
            }

            if (responseMsg.user.admin) {
                const { admin_psw, auth_code, authorized_session, is_verified, ...otherValues } = responseMsg.user[0];
                
                const { admin } = responseMsg.user;
                otherValues.admin = admin;
                setLoginData([otherValues]);
            } else {
                const { admin } = responseMsg.user;
                setLoginData([{ ...responseMsg.user[0], admin }]);
            }
            
            return true
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                notification.destroy()
            }, 1000);
        }
    }

    const closeSession = async () => {
        localStorage.removeItem("session_data")
        setLoginData([])
        window.location.href = "/"
    }

    return {
        retrieveSession,
        loginData,
        setLoginData,
        closeSession
    }
}

export default useRetriveSession
import { message, notification, Spin } from "antd"
import { apis } from "../../utils/apis"
import { processRequests } from "../../utils/processRequests"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const useSession = () => {
    const [loginData, setLoginData] = useState({})

    const retrieveSession = async () => {
        setTimeout(() => {
            notification.open({
                icon: <Spin />,
                message: "Verificando sesión",
                duration: 1.5,
                pauseOnHover: false,
                showProgress: true
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
                const { admin_psw, auth_code, authorized_session, is_verified, ...otherValues } = responseMsg.user;
                
                const { admin } = responseMsg.user;
                otherValues.admin = admin;
                setLoginData(otherValues);
            } else {
                const { admin } = responseMsg.user;
                
                setLoginData({ ...responseMsg.user, admin });
            }
            
            return true
        } catch (error) {
            console.log(error)
        }
    }

    const closeSession = async () => {
        localStorage.removeItem("session_data")
        setLoginData([])
        window.location.href = "/"
    }

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

    const loginAdmin = async (userData) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/login-admin`, {
                body: userData,
                method: "POST",
            });

            const responseData = await processRequests(response);

            if (!response.ok) throw new Error(responseData.msg);

            notification.success({
                message: responseData.msg,
            });

            const sessionData = {
                user_id : responseData.user.id,
                user_type: "admin",
            }
            localStorage.setItem("session_data", JSON.stringify(sessionData))
            await retrieveSession()
            return true;
        } catch (error) {
            console.log(error);
            notification.error({
                message: "No fue posible iniciar sesión",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true,
            });
            return false;
        }
    };

    const verifyAdminAccount = async(user_email) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/verify-admin-data/${user_email}`)
            const responseData = await processRequests(response)
            
            if(response.status === 403){
                notification.warning({
                    description: responseData.message,
                    duration: 5,
                    pauseOnHover: false,
                    showProgress: true
                })
                return 403
            }
            if(!response.ok) throw new Error(responseData.msg)
            return 200
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible verificar la cuenta",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return 400
        }
    }

    const navigate = useNavigate()
    const handleVerifyRoleAndSession = () => {
        const session_data = localStorage.getItem("session_data")

        let parsedSessionData = []
        const route = window.location.pathname
        
        if(session_data){
            try {
                parsedSessionData = JSON.parse(session_data)
            } catch (error) {
                console.log(error)
                return
            }
        }else{
            localStorage.removeItem("session_data")
            return 
        }


        if(parsedSessionData?.user_type === "admin" && !route.includes("/admin-")){
            message.error("No tienes permiso para acceder a esta sección")
            navigate("/admin-dashboard")
            return;
        }if(!parsedSessionData?.user_type === "client" && route === "/client-info"){
            message.error("No tienes permiso para acceder a esta sección")
            navigate("client-info")
            return

        }
        if(session_data && route === "/login-admin"){
            navigate("/admin-dashboard")
        }
        if(session_data && route === "/login-client"){
            navigate("/client-info")
        }
    }

    return {
        retrieveSession,
        loginData,
        setLoginData,
        closeSession,
        verifyAuthCodeClients,
        createNewClient,
        loginClientWithEmail,
        loginAdmin,
        verifyAdminAccount,
        handleVerifyRoleAndSession
    }
}

export default useSession
import { notification } from "antd";
import { apis } from "../../utils/apis";
import { processRequests } from "../../utils/processRequests";
import useRetriveSession from "../VerifySession/useSession";

const useLoginAdmin = () => {
    const { retrieveSession } = useRetriveSession()
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


    return { loginAdmin, verifyAdminAccount };
};

export default useLoginAdmin;

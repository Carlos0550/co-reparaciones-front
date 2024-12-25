import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../AppContext'
import { useNavigate } from 'react-router-dom'
import ClientHeader from '../ClientLayout/ClientHeader'
import ClientInfoForm from './ClientInfoForm/ClientInfoForm'
import Title from 'antd/es/typography/Title'
import { WarningOutlined } from '@ant-design/icons'
import "./ClientInfoView.css"
import ClientDataTable from './Tables/ClientDataTable'
import { Button, Drawer, message } from 'antd'
import CartView from '../views/CartView/CartView'
import useSession from "../../Context_Folders/VerifySession/useSession"
function ClientInfoView() {
    const navigate = useNavigate()
    const { loginData, openCart, setOpenCart, getClientOrder, setGettingClientOrder, setClientOrder } = useAppContext()
    const [userNotVerified, setUserNotVerified] = useState(false)

    const { closeSession } = useSession()

    const alreadyGettedClientOrder = useRef(false)    
    const handleGetClientOrder = async () => {
        if(!alreadyGettedClientOrder.current){
            alreadyGettedClientOrder.current = true
            setGettingClientOrder(true)
            const result = await getClientOrder(loginData[0]?.client_uuid)
            setGettingClientOrder(false)
            setClientOrder(result.orders)
        }
    }

    useEffect(() => {
        if (!loginData || (Array.isArray(loginData) && loginData.length === 0)) {
            navigate("/login-client");
        } else if (loginData[0] && !loginData[0]?.admin) {
            handleGetClientOrder()
        } else if (loginData[0] && loginData[0]?.admin) {
            navigate("/admin-info");
        }
    }, [loginData])

    useEffect(()=>{
        setUserNotVerified(!loginData[0]?.is_verified)
    },[loginData])

    const getUsernameFromEmail = (email) => email?.split("@")[0] || "Usuario"

    return (
        <React.Fragment>
            <ClientHeader />

            <div className='client-info-view'>
                <Title level={3}>Información de usuario</Title>
                <div className="client-info-name-and-button">
                    {!userNotVerified && <Title level={3}>Hola, {loginData[0]?.user_fullname}</Title>}
                    <Button type='primary' danger onClick={() => closeSession()}>Cerrar sesión</Button>
                </div>
                {!userNotVerified && <ClientDataTable/>}
                <div className='client-info-view-content'>
                    {userNotVerified === true && <div className='client-info-view-content-warning'>

                        <div className='client-info-view-content-warning-text'>
                            <p><WarningOutlined /> Hola {getUsernameFromEmail(loginData.user_email)}, Tu cuenta no ha sido verificada</p>
                            <p>Por favor, completa este formulario para continuar con tu compra.</p>
                        </div>
                        <ClientInfoForm />
                    </div>
                    }

                </div>
            </div>

            {
                openCart && <Drawer onClose={() => setOpenCart(false)} open={openCart} children={<CartView />} />
            }
        </React.Fragment>
    )
}

export default ClientInfoView
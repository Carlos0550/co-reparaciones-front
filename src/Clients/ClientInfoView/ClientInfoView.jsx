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
import useSession from "../../Context_Folders/Session/useSession"
function ClientInfoView() {
    const navigate = useNavigate()
    const { loginData, openCart, setOpenCart, getClientOrder, setGettingClientOrder, setClientOrder } = useAppContext()
    const [userNotVerified, setUserNotVerified] = useState(false)

    const { closeSession, handleVerifyRoleAndSession } = useSession()

    const handleGetClientOrder = async () => {

        setGettingClientOrder(true)
        const result = await getClientOrder(loginData[0]?.client_uuid)

        if(!result){
            setClientOrder([])
            setGettingClientOrder(false)
            return
        }
        setGettingClientOrder(false)
        setClientOrder(result.orders)
    }

    const alreadyVerified = useRef(false)
    useEffect(() => {
        if (!alreadyVerified.current) {
            alreadyVerified.current = true
            handleVerifyRoleAndSession()
            handleGetClientOrder()
        }
    }, [])

    useEffect(()=>{
        setUserNotVerified(loginData && !loginData[0]?.is_verified || false)
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
                {!userNotVerified && <ClientDataTable getClientOrder={()=>handleGetClientOrder()}/>}
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
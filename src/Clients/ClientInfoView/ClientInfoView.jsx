import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../AppContext'
import { useNavigate } from 'react-router-dom'
import ClientHeader from '../ClientLayout/ClientHeader'
import ClientInfoForm from './ClientInfoForm/ClientInfoForm'
import Title from 'antd/es/typography/Title'
import { WarningOutlined } from '@ant-design/icons'
import "./ClientInfoView.css"
import ClientDataTable from './Tables/ClientDataTable'
import { Button, Drawer, message, Modal } from 'antd'
import CartView from '../views/CartView/CartView'
import useSession from "../../Context_Folders/Session/useSession"
function ClientInfoView() {
    const navigate = useNavigate()
    const { loginData, openCart, setOpenCart, getClientOrder, setGettingClientOrder, getPageColors, getProducts, productsList } = useAppContext()
    const [userNotVerified, setUserNotVerified] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const { closeSession, handleVerifyRoleAndSession } = useSession()

    const handleGetClientOrder = async () => {

        setGettingClientOrder(true)
        await getClientOrder(loginData[0]?.client_uuid)

        setGettingClientOrder(false)
    }

    const alreadyVerified = useRef(false)
    useEffect(() => {
        if (!alreadyVerified.current) {
            (async () => {
                alreadyVerified.current = true
                handleVerifyRoleAndSession()
                await getPageColors()
                if (productsList.length === 0) await getProducts()
                if(loginData && loginData[0]?.is_verified) await handleGetClientOrder()
            })()
        }
    }, [])

    useEffect(() => {
        setUserNotVerified(loginData && !loginData[0]?.is_verified || false)
    }, [loginData])

    const getUsernameFromEmail = (email) => email?.split("@")[0] || "Usuario"
    return (
        <React.Fragment>
            <ClientHeader />

            <div className='client-info-view'>
                <Title level={3}>Información de usuario</Title>
                <div className="client-info-name-and-button">
                    <Title level={3}>Hola, {loginData[0]?.user_fullname || getUsernameFromEmail(loginData.user_email)}</Title>
                    <Button type='primary' danger onClick={() => closeSession()}>Cerrar sesión</Button>
                    {userNotVerified && <div>
                        <p><WarningOutlined /> Hola {getUsernameFromEmail(loginData.user_email)}, Tu cuenta no ha sido verificada</p>
                        <p>Puedes seguir comprando pero tus compras no quedarán registradas en nuestra plataforma, si prefieres puedes <Button type='primary' onClick={() => setShowForm(true)}>Completar Datos</Button></p>

                    </div>
                    }
                </div>
                <ClientDataTable getClientOrder={() => handleGetClientOrder()} />

            </div>
            {
                openCart && <Drawer onClose={() => setOpenCart(false)} open={openCart} children={<CartView />} />
            }

            {showForm && <Modal
                onCancel={() => setShowForm(false)}
                open={showForm}
                footer={null}
                title="Completar Datos"
            >

                <ClientInfoForm />
            </Modal>}
        </React.Fragment>
    )
}

export default ClientInfoView
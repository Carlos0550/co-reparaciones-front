import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../AppContext'
import { useNavigate } from 'react-router-dom'
import ClientHeader from '../ClientLayout/ClientHeader'
import ClientInfoForm from './ClientInfoForm/ClientInfoForm'
import Title from 'antd/es/typography/Title'
import { WarningOutlined } from '@ant-design/icons'
import "./ClientInfoView.css"
import ClientDataTable from './Tables/ClientDataTable'
import { Button } from 'antd'
function ClientInfoView() {
    const navigate = useNavigate()
    const { loginData, retrieveClientInfo, clientInfo, closeSession } = useAppContext()
    const [userNotVerified, setUserNotVerified] = useState(false)
    
    useEffect(() => {
        if (!loginData) navigate("/")
        if (loginData && loginData.user_type !== "client") {
            navigate("/")
            return
        }

        if (!loginData.is_verified) setUserNotVerified(true)

    }, [loginData])


    const [retrievingClientInfo, setRetrievingClientInfo] = useState(false)
    const alreadyRetrieve = useRef(false)
    const handleRetrevingClientInfo = async () => {
        console.log("Ejecuta handleRetrevingClientInfo")
        setRetrievingClientInfo(true)
        await retrieveClientInfo()
        setRetrievingClientInfo(false)
    }
    useEffect(() => {
        if (!alreadyRetrieve.current && loginData?.is_verified === true) {
            handleRetrevingClientInfo()
            alreadyRetrieve.current = true
        }
    }, [loginData])

    useEffect(()=>{
        if(clientInfo.id) setUserNotVerified(false)
    },[clientInfo])

    const getUsernameFromEmail = (email) => email?.split("@")[0] || "Usuario"

    return (
        <React.Fragment>
            <ClientHeader />
            
            <div className='client-info-view'>
            <Title level={3}>Información de usuario</Title>
            <div className="client-info-name-and-button">
                {!userNotVerified && <Title level={3}>Hola, {clientInfo[0]?.user_fullname}</Title>}
                <Button type='primary' danger onClick={()=> closeSession()}>Cerrar sesión</Button>
            </div>
                <ClientDataTable gettingData={retrievingClientInfo}/>
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
        </React.Fragment>
    )
}

export default ClientInfoView
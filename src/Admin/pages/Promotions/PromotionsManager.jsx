import { Button, Card, Col, message, Row, Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef, useState } from 'react'
import PromotionForm from './Forms/PromotionForm'
import PromotionsTable from './Tables/PromotionsTable'
import { useAppContext } from '../../../AppContext'
import useSession from '../../../Context_Folders/Session/useSession'
import { useNavigate } from 'react-router-dom'
import { InfoCircleOutlined } from '@ant-design/icons'

function PromotionsManager() {
    const { width, getAllPromotions } = useAppContext()

    const navigate = useNavigate()
    const { loginData } = useSession()

    const [gettingPromotions, setGettingPromotions] = useState(false)
    const handleGetPromotions = async() => {
        const hiddenMessge = message.loading('Obteniendo promociones...', 0)
        setGettingPromotions(true)
        await getAllPromotions()
        setGettingPromotions(false)
        hiddenMessge()
    }

    const { handleVerifyRoleAndSession } = useSession()

    
    const alreadyVerified = useRef(false)
    useEffect(()=> {
        if(!alreadyVerified.current){
            alreadyVerified.current = true
            handleVerifyRoleAndSession()
        }
    },[])
  return (
    <React.Fragment>
        <Title>Promociones</Title>
        <Title level={3}>Administra aqui tus promociones</Title>
        <Row gutter={[16, 16]}>
            <Col xl={12} lg={24} xs={24}>
                <Card title="Listado de promociones" style={{minHeight: width < 1200 ? "10vh" : "100vh"}}>
                    <Button onClick={()=> handleGetPromotions()} loading={gettingPromotions}>Obtener Promociones</Button>
                    <p><InfoCircleOutlined/> Debes tener al menos 2 promociones activas para que sean visibles en la web</p>
                    <PromotionsTable/>
                </Card>
            </Col>
            <Col xl={12} lg={24} xs={24}>
                <Card title="Crear una promoción">
                    <PromotionForm/>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default PromotionsManager
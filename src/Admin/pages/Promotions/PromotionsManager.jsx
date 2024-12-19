import { Button, Card, Col, message, Row, Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useState } from 'react'
import PromotionForm from './Forms/PromotionForm'
import PromotionsTable from './Tables/PromotionsTable'
import { useAppContext } from '../../../AppContext'

function PromotionsManager() {
    const { width, getAllPromotions } = useAppContext()

    const [gettingPromotions, setGettingPromotions] = useState(false)
    const handleGetPromotions = async() => {
        const hiddenMessge = message.loading('Obteniendo promociones...', 0)
        setGettingPromotions(true)
        await getAllPromotions()
        setGettingPromotions(false)
        hiddenMessge()
    }
  return (
    <React.Fragment>
        <Title>Promociones</Title>
        <Title level={3}>Administra aqui tus promociones</Title>
        <Row gutter={[16, 16]}>
            <Col xl={12} lg={24} xs={24}>
                <Card title="Listado de promociones" style={{minHeight: width < 1200 ? "10vh" : "100vh"}}>
                    <Button onClick={()=> handleGetPromotions()} loading={gettingPromotions}>Obtener Promociones</Button>
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
import { Button, Card, Col, Row, Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import PromotionForm from './Forms/PromotionForm'
import PromotionsTable from './Tables/PromotionsTable'
import { useAppContext } from '../../../AppContext'

function PromotionsManager() {
    const { width, getAllPromotions } = useAppContext()
  return (
    <React.Fragment>
        <Title>Promociones</Title>
        <Title level={3}>Administra aqui tus promociones</Title>
        <Row gutter={[16, 16]}>
            <Col xl={12} lg={24} xs={24}>
                <Card title="Listado de promociones" style={{minHeight: width < 1200 ? "10vh" : "100vh"}}>
                    <Button onClick={()=> getAllPromotions()}>Obtener Promociones</Button>
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
import { Card, Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

function ClientsManager() {
    return (
        <React.Fragment>
            <Title>Clientes</Title>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Administra aqui tus clientes">

                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default ClientsManager
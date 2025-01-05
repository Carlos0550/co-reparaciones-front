import { Card, Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useRef } from 'react'
import BannersForm from './Forms/BannersForm'
import BannersTable from './Tables/BannersTable'
import { useAppContext } from '../../../AppContext'

import useSession from '../../../Context_Folders/Session/useSession'

function PrincipalManager() {
    const { editingBanner } = useAppContext()

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
        <Title>Principal</Title>
        <Title level={3}>Administra aqui banners y anuncios</Title>
        <Row gutter={[16, 16]}>
            <Col xl={12} lg={24} md={24} style={{width: "100%"}}>
                <Card title="Agregar un Banner" style={{opacity: editingBanner ? 0.2 : 1}}>
                    <BannersForm/>
                </Card>
            </Col>
            <Col xl={12} lg={24} md={24} style={{width: "100%"}}>
                <Card title="Lista de Banners" >
                    <BannersTable/>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default PrincipalManager
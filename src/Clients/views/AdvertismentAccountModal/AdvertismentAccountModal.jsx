import { WarningOutlined } from '@ant-design/icons'
import { Button, Modal, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../AppContext'

function AdvertismentAccountModal({closeModal}) {
    const navigate = useNavigate()
    const { setOpenCart } = useAppContext()
  return (
    <Modal
        open={true}

        footer={null}
    >
      <Title level={3}>Debe iniciar sesión para acceder a esta sección</Title>
        <p style={{marginBottom: "1rem"}}><WarningOutlined/> Para poder continuar con la compra debe iniciar sesión</p>
        <Space>
          <Button onClick={()=> navigate("/login-client")} type='primary'>Iniciar sesión</Button>
          <Button onClick={()=> {
            setOpenCart(false)
            navigate("/")
          }}>Seguir comprando</Button>
        </Space>
    </Modal>
  )
}

export default AdvertismentAccountModal
import { Button, Modal } from 'antd'
import React from 'react'

function ClientOrderData({closeModal, clientData}) {
  console.log(clientData)
  return (
    <Modal
      open={true}
      onCancel={closeModal}
      footer={
        <Button danger onClick={closeModal}>
          Cerrar
        </Button>
      }
    >
      <h2>Datos del cliente</h2>
      <ul>
        <li><strong>Nombre completo:</strong> {clientData?.user_fullname}</li>
        <li><strong>DNI:</strong> {clientData?.dni}</li>
        <li><strong>Dirección:</strong> {clientData?.first_address}</li>
        <li><strong>Dirección 2:</strong> {clientData?.second_address}</li>
        <li><strong>Ciudad:</strong> {clientData?.city}</li>
        <li><strong>Provincia:</strong> {clientData?.province}</li>
        <li><strong>Código postal:</strong> {clientData?.postal_code}</li>
        <li><strong>Teléfono:</strong> {clientData?.user_phone}</li>
      </ul>
    </Modal>
  )
}

export default ClientOrderData
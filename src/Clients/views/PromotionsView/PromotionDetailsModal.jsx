import { Modal, Button } from 'antd'
import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons'

function PromotionDetailsModal({ closeModal, promotion, addToCart }) {
  return (
    <Modal
      open={true}
      onCancel={closeModal}
      footer={null}
      
    >
      <h3>Muy pronto verás en funcionamiento esta sección</h3>
    </Modal>
  )
}

export default PromotionDetailsModal

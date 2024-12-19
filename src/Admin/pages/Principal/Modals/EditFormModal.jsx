import { Modal } from 'antd'
import React from 'react'
import { useAppContext } from '../../../../AppContext'
import BannersForm from '../Forms/BannersForm'

function EditFormModal() {
    const { handleBanner } = useAppContext()
  return (
    <Modal
        open={true}
        footer={null}
        onCancel={()=> handleBanner()}
        title="Editar Banner"
    >
        <BannersForm/>
    </Modal>
  )
}

export default EditFormModal
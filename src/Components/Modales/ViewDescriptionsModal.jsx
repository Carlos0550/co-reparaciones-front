import { Button, Modal } from 'antd'
import React from 'react'

function ViewDescriptionsModal({description, closeModal}) {
  return (
    <Modal
        open={true}
        onCancel={closeModal}
        footer={
            <Button onClick={closeModal}>
                Cerrar
            </Button>
        }

    >
        <div dangerouslySetInnerHTML={{__html: description}}></div>
    </Modal>
  )
}

export default ViewDescriptionsModal
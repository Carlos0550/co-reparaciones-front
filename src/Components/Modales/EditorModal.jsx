import { Modal } from 'antd'
import React from 'react'
import { useAppContext } from '../../AppContext'
import AddProducts from '../../Admin/pages/ProductManager/Forms/AddProducts'
import AddCategories from '../../Admin/pages/ProductManager/Forms/AddCategories'
import ChangeAdminPsw from '../../Admin/pages/Settings/SecurityAccount/ChangeAdminPsw'

function EditorModal() {
  const {
    handlerCategories,
    handleProducts,
    editingCategory,
    editingProduct,
    changeAdminPsw, 
    setEditingAdminPsw, 
    editingAdminPsw
  } = useAppContext()

  return (
    <Modal
      open={true}
      title={
        editingProduct
          ? "Agregar un nuevo producto"
          : editingCategory
          ? "Agregar una nueva categoría"
          : "Editar contraseña"
      }
      footer={null}
      onCancel={() => {
        if(editingProduct) handleProducts()
        if(editingCategory) handlerCategories()
        if(editingAdminPsw) setEditingAdminPsw(false)
      }}
    >
      {editingProduct && <AddProducts />}
      {editingCategory && <AddCategories />}
      {editingAdminPsw && <ChangeAdminPsw />}
    </Modal>
  )
}

export default EditorModal
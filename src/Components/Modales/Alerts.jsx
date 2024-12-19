import { Button, Modal, Skeleton, Space } from 'antd'
import { useAppContext } from '../../AppContext'
import React, { useEffect, useRef, useState } from 'react'

function Alerts() {
  const {
    handlerCategories,
    handleProducts,
    categoryId,
    isDeletingCategory,
    getCountProductsWithCategory,
    deleteCategory
  } = useAppContext()

  const deleteCategoryTitle = `
     Eliminar una categoría
  `

  const alreadyFetch = useRef(false)
  const [countPrWithCat, setCountPrWithCat] = useState(0)

  const [isFetchingData, setIsFetchingData] = useState(false)
  useEffect(() => {
    if (isDeletingCategory && !alreadyFetch.current) {
      (async () => {
        alreadyFetch.current = true
        setIsFetchingData(true)
        const count = await getCountProductsWithCategory(categoryId)
        setCountPrWithCat(parseInt(count))
        setTimeout(() => {
          setIsFetchingData(false)
        }, 500);
      })()
    }
  }, [isDeletingCategory])

  const [isDeleting, setIsDeleting] = useState(false)
  return (
    <Modal title={isDeletingCategory ? deleteCategoryTitle : "Alerta"} open={true} footer={null} onCancel={() => { isDeletingCategory ? handlerCategories() : handleProducts() }}>
      {isDeletingCategory && (
        isFetchingData
          ? (<Skeleton active />)
          : (
            <React.Fragment>

              {countPrWithCat > 0
                ? (
                  <p>Esta categoría está vinculada a {countPrWithCat} {countPrWithCat > 1 ? "productos" : "producto"} y no es posible eliminar.</p>
                )
                : (
                  <p>¿Está seguro de eliminar esta categoría? <strong style={{ color: "red" }}>Esta acción no se puede deshacer</strong></p>
                )
              }

              <Space style={{ marginTop: "1rem" }}>
                <Button
                  disabled={countPrWithCat > 0 || isDeleting}
                  onClick={async () => {
                    setIsDeleting(true)
                    await deleteCategory(categoryId)
                    setIsDeleting(false)
                    handlerCategories()
                  }}
                  loading={isDeleting}
                  type='primary'
                >
                  Sí, eliminar
                </Button>

                <Button
                  onClick={() => handlerCategories()}
                  disabled={isDeleting}
                  type='primary'
                  danger
                >
                  Cancelar
                </Button>
              </Space>

            </React.Fragment>
          )
      )}


    </Modal>
  )
}

export default Alerts
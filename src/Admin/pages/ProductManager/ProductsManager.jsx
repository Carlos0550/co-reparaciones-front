import React from 'react'
import { Row, Col, Card } from 'antd'
import AddCategories from './Forms/AddCategories'
import AddProducts from './Forms/AddProducts'
import CategoriesTable from './Tables/CategoriesTable'
import ProductsTable from './Tables/ProductsTable'
import { useAppContext } from '../../../AppContext'
import Title from 'antd/es/typography/Title'
function ProductsManager() {
    const { editingProduct } = useAppContext()

  return (
    <React.Fragment>
      <Title>
        Sección de productos
      </Title>
      <Title level={3}>Administra aqui tu lista de stock</Title>
      <Row gutter={[16, 16]}>
            <Col xl={12} lg={24}>
                <Card title="Agregar nuevo producto" style={{opacity: editingProduct ? 0.4 : 1}}>
                    <AddProducts/>
                </Card>
            </Col>

            <Col xl={12} lg={24} xs={24}>
                <Card title="Agregar nueva categoría">
                    <AddCategories />
                    <CategoriesTable/>
                </Card>
            </Col>

            <Col xs={24}>
                <Card title="Listado de productos">
                    <ProductsTable/>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default ProductsManager
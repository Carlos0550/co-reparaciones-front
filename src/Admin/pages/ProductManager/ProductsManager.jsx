import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, message } from 'antd'
import AddCategories from './Forms/AddCategories'
import AddProducts from './Forms/AddProducts'
import CategoriesTable from './Tables/CategoriesTable'
import ProductsTable from './Tables/ProductsTable'
import { useAppContext } from '../../../AppContext'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
function ProductsManager() {
    const { editingProduct, getProducts, loginData } = useAppContext()
const navigate = useNavigate()
    const [gettingProducts, setGettingProducts] = useState(false)
    const handleGetProducts = async() => {
        const hiddenMessage = message.loading("Obteniendo productos...")
        setGettingProducts(true)
        await getProducts()
        setGettingProducts(false)
        hiddenMessage()
    }
useEffect(()=> {
        if (!loginData || (Array.isArray(loginData) && loginData.length === 0)) {
            navigate("/login-client");
        } else if (loginData[0] && !loginData[0]?.admin) {
            navigate("/client-info");
        } else if (loginData[0] && loginData[0]?.admin) {
            return
        }
    },[loginData])
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
                    <Button onClick={()=> handleGetProducts()} loading={gettingProducts} style={{marginBottom: "10px"}}>Refrescar</Button>
                    <ProductsTable/>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default ProductsManager
import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Button, message } from 'antd'
import AddCategories from './Forms/AddCategories'
import AddProducts from './Forms/AddProducts'
import CategoriesTable from './Tables/CategoriesTable'
import ProductsTable from './Tables/ProductsTable'
import { useAppContext } from '../../../AppContext'
import Title from 'antd/es/typography/Title'
import { useNavigate } from 'react-router-dom'
import useSession from '../../../Context_Folders/Session/useSession'
function ProductsManager() {
    const { editingProduct, getProducts } = useAppContext()

    const { closeSession, loginData } = useSession()
const navigate = useNavigate()

const { handleVerifyRoleAndSession } = useSession()
    const [gettingProducts, setGettingProducts] = useState(false)
    const handleGetProducts = async() => {
        const hiddenMessage = message.loading("Obteniendo productos...")
        setGettingProducts(true)
        await getProducts()
        setGettingProducts(false)
        hiddenMessage()
    }
    const alreadyVerified = useRef(false)
    useEffect(() => {
        
        if (!alreadyVerified.current) {
            alreadyVerified.current = true
            console.log("Verificando rol...")
            handleVerifyRoleAndSession()
        }
    }, [])
    
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
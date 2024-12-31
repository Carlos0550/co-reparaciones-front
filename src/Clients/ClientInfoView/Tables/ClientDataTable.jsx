import { Button, Tag, Table } from 'antd'
import React from 'react'
import { useAppContext } from '../../../AppContext'
import { EditOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons'
import RoadIcon from "../../../../public/road_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
import Title from 'antd/es/typography/Title'

function ClientDataTable() {
    const { loginData, getClientOrder, gettingClientOrder, clientOrder, productsList } = useAppContext()
    const parseProducts = (productss) => {
        if(!productss) return []
        const parsedProducts = JSON.parse(productss)
        
        const products = parsedProducts.map(product => {
            const productInfo = productsList.find(prod => prod.id === product.id)
            return {
                product_name: productInfo.product_name,
                quantity: product.quantity,
                price: productInfo.product_price
            }
        })

        return products
    }

    const orderCols = [
        {
            title: "Fecha de compra",
            render: (_,record) => {
                const { order_date } = record
                return(
                    <ul>
                        <li>{order_date.split("T")[0]}</li>
                    </ul>
                )
            }
        },{
            title: "Estado de compra",
            render: (_,record) => {
                const { order_status } = record
                const orderStatuses = {
                    "pending": <Tag color="blue">Pendiente</Tag>,
                    "processing": <Tag color="orange">En proceso</Tag>,
                    "completed": <Tag color = "green">Despachada</Tag>,
                }
                return(
                    <ul>
                        <li>{orderStatuses[order_status]}</li>
                    </ul>
                )
            }
        },{
            title: "Detalles de compra",
            render: (_,record) => {
                const parsedProducts = parseProducts(record?.products_details)
                return(
                    <ul>
                        {parsedProducts.map(product => (
                            <li key={product?.id}>{product?.quantity} {product?.product_name} {parseFloat(product?.price).toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</li>
                        ))}
                    </ul>
                )
            }
        }
    ]

    const tableCols = [
        {
            title: "Nombre",
            render: (_,record) => {
                const { user_fullname } = record
                return(
                    <ul>
                        <li><UserOutlined/> {user_fullname}</li>
                    </ul>
                )
            }
        },
        {
            title: "Correo",
            render: (_,record) => {
                const { user_email } = record
                return(
                    <ul>
                        <li><MailOutlined/> {user_email}</li>
                    </ul>
                )
            }
        },
        {
            title: "Datos domiciliarios",
            render: (_,record) => {
                const { first_address, second_address, postal_code, province } = record
                return(
                    <ul>
                        <li
                            style={{
                                display: "flex",
                                alignItems: "center",
                                listStyle: "disc"                               
                            }}
                        >
                            <img src={RoadIcon} width={"20px"} height={"20px"}/> {first_address} {second_address} {postal_code}
                        </li>
                        <li
                            style={{
                                display: "flex",
                                alignItems: "center",
                                listStyle: "disc"                               
                            }}
                        >
                            <img src={RoadIcon} width={"20px"} height={"20px"}/> {province}, Argentina
                        </li>
                    </ul>
                )
            }
        },
        {
            title: "Datos personales",
            render: (_,record) => {
                const { user_phone, dni } = record
                return(
                    <ul>
                        <li><PhoneOutlined/> {user_phone}</li>
                        <li><IdcardOutlined/> {dni}</li>
                    </ul>
                )
            }
        },{
            render: (_,record) => (
                <Button icon={<EditOutlined/>} type='primary'/>
            )
        }
    ]
  return (
    <React.Fragment>
        <Table
        columns={tableCols}
        dataSource={loginData}

        pagination={false}
        rowKey={(record) => record.id}
        bordered
        scroll={{ x: 800 }}
    />
    <Title level={3}>Historial de compras</Title>

    <Button type='primary' style={{
        marginBottom: "1rem",
        width: "min-content"
    }}
    onClick={()=> getClientOrder(loginData[0]?.client_uuid)}
    loading={gettingClientOrder}
    >Obtener ordenes</Button>

    <Table
        loading={gettingClientOrder}
        columns={orderCols}
        dataSource={clientOrder}
        locale={{
            emptyText: <div style={{ textAlign: "center" }}>
            <SmileOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <p style={{ margin: 0, fontSize: "16px", color: "#555" }}>Próximamente</p>
        </div>
        }}
    />
    </React.Fragment>
  )
}

export default ClientDataTable
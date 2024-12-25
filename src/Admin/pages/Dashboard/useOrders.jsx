import { Button, Popconfirm, Select, Tag } from "antd"
import { useEffect, useState } from "react"

function useOrders(processOrders, handleGetOrders) {
    const [openModal, setOpenModal] = useState(false)
    const [clientData, setClientData] = useState({})
    const parseProducts = (productsDetails) => {
        if(!productsDetails) return []
        const products = []
        try {
            
            const parsedProducts = JSON.parse(productsDetails)

            parsedProducts.forEach(product => {
                products.push({
                    name: product.product_name,
                    quantity: product.quantity
                })
            })
        } catch (error) {
            console.log(error)
        }

        return products
    }

    const orderCols = [
        {
            title: "Estado de la orden",
            render: (_, record) => {
                const { order_status } = record
                const orderStatus = {
                    "pending": "Pendiente",
                    "processing": "Procesando",
                    "completed": "Completada"
                }
    
                return (
                    <span>{orderStatus[order_status]}</span>
                )
            }
        },
        {
            title: "Productos a despachar",
            render: (_, record) => {
                const products = parseProducts(record.products_details)
                return (
                    <ul>
                        {
                            products.map((product, index) => (
                                <li key={index}>
                                    <span>{product.quantity} {product.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        },
        {
            title: "Cliente",
            render: (_, record) => {
                const {
                    order_status, 
                    id, products_details,
                    client_id,
                    client_uuid,
                    ...clientData
                } = record
    
                return (
                    <Button type="primary" onClick={() => {
                        setClientData(clientData)
                        setOpenModal(true)
                    }}>Ver informacion</Button>
                )
            }
        },
        {
            render: (_, record) => {
                return (
                    <>
                        {record.order_status === "pending" && (
                            <Popconfirm
                                title="Marcando como procesando..."
                                description="¿Estas seguro de procesar esta orden?, una vez procesada no se puede revertir y el cliente verá el producto como en procesamiento."
                                overlayStyle={{ maxWidth: 400 }}
                                okText="Procesar"
                                cancelText="Cancelar"
                                placement="top"
                                onConfirm={async () => {
                                    await processOrders(record.order_id)
                                    await handleGetOrders()
                                }}
                            >
                                <Button type="primary">Procesar compra</Button>
                            </Popconfirm>
                        )}
    
                        {record.order_status === "processing" && (
                            <Popconfirm
                                title="Marcando como completada..."
                                description="¿Estas seguro de completar esta orden?, una vez completada no se puede revertir y el cliente verá el producto como despachado."
                                overlayStyle={{ maxWidth: 400 }}
                                okText="Completar"
                                cancelText="Cancelar"
                                placement="top"
                                onConfirm={async () => {
                                    await processOrders(record.order_id)
                                    await handleGetOrders()
                                }}
                            >
                                <Button style={{
                                    backgroundColor: "green", color: "white"
                                }}>Completar compra</Button>
                            </Popconfirm>
                        )}

                        {record.order_status === "completed" && (
                            <Tag color="green">Despachada</Tag>
                        )}
                    </>
                )
            }
        }
    ]
    

    return {
        orderCols,
        openModal,
        setOpenModal,
        clientData
    }
}

export default useOrders
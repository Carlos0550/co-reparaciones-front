import { Button, Popconfirm, Space, Table } from "antd"
import { useAppContext } from "../../../../AppContext"
import React, { useEffect } from "react"
import "./ProductsTable.css"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import EditorModal from "../../../../Components/Modales/EditorModal"
function ProductsTable() {
    const { getProducts, 
        productsList, 
        handleProducts, 
        showProductForm, 
        deleteProducts,
        categories,
        width
    } = useAppContext()

    const tableColumns = [
        {
            render: (_, record) => {
                return (
                    <picture className="product-image-minified">
                        <img src={record.images[0]?.image_data} alt={record.image_name} />
                    </picture>
                )
            }
        },
        {
            title: "Producto",
            dataIndex: "product_name",
        },
        {
            title: "Precio",
            dataIndex: "product_price",
            render: (_, record) => {
                return (
                    <span>{parseFloat(record.product_price).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</span>
                )
            }
        },{
            title: "Stock",
            dataIndex: "stock",
        },
        {
            title: "Categoría",
            dataIndex: "product_category",
            render: (_, record) => {
                return (
                    <span>{categories.find(category => category.id === record.product_category)?.category_name || "Sin categoria"}</span>
                )
            }
        },
        {
            title: "Descripción",
            render: (_,record) => (
                <Popconfirm
                    description={<div dangerouslySetInnerHTML={{ __html: record.product_description }}></div>}
                    okText={"Cerrar"}
                    overlayStyle={{ maxWidth: width > 800 ? "50%" : width}}
                    cancelButtonProps={{ style: { display: "none" } }}
                >
                    <Button>Ver descripción</Button>
                </Popconfirm>
            )
        },
        {
            render: (_, record) => (
                <Space>
                    <Button type='primary' icon={<EditOutlined />} onClick={() => {
                        handleProducts(true, record.id, true)
                    }}></Button>
                    <Popconfirm
                        title="¿Estás seguro de eliminar este producto?"
                        description="No podrás revertir esta acción"
                        onConfirm={async () => {
                            try {
                                await deleteProducts(record.id);
                            } catch (error) {
                                console.error("Error eliminando producto:", error);
                            }
                        }}
                        okText="Sí"
                        cancelText="No"
                        
                    >
                        <Button
                            type='primary'
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ]

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <React.Fragment>
            <Table
                columns={tableColumns}
                dataSource={productsList}
                scroll={{ x: 1000 }}
            />

            {showProductForm && (<EditorModal />)}
        </React.Fragment>
    )
}

export default ProductsTable
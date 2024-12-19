import { Button, Popconfirm, Space, Table } from 'antd'
import React, { useState } from 'react'
import './PromotionTable.css'
import { useAppContext } from '../../../../AppContext'
import dayjs from "dayjs"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
function PromotionsTable() {
    const { promotions, productsList, getAllPromotions, deletePromotion,handlePromotions}  = useAppContext()
    const [deleting, setDeleting] = useState(false)
    const handleDelete = async(promotion_id) => {
        setDeleting(true)
        await deletePromotion(promotion_id)
        await getAllPromotions()
        setDeleting(false)
    }

    const handleEditPromotion = (promotionId) => {
        handlePromotions(promotionId,true)
    }
    const tableColumns = [
        {
           render:(_,record) => {
               const images = record.images
               return(
                    <picture className='promotion-image-minified'>
                        <img src={images[0].image} alt={record.image_name} />
                    </picture>
               )
           }
        },
        {
            title: "Promocion",
            dataIndex: "promotion_name",
        },
        {
            title: "Fechas",
            render:(_,record) => {
                const inicio = dayjs(record.promotion_starts).format("DD/MM/YYYY")
                const fin = dayjs(record.promotion_ends).format("DD/MM/YYYY")
                return(
                    <em>{inicio} - {fin}</em>
                )
            }
        },
        {
            title: "Descripción",
            render:(_,record) => {
                const description = record.promotion_data.promotion_description
                return(
                    <Popconfirm
                        description={<div dangerouslySetInnerHTML={{ __html: description }}></div>}
                        okText={"Cerrar"}
                        overlayStyle={{ maxWidth: "50%" }}
                        cancelButtonProps={{ style: { display: "none" } }}
                    >
                        <Button>Ver descripción</Button>
                    </Popconfirm>
                )
            }
        },
        {
            title: "Tipo de promoción",
            render:(_,record) => {
                const type = record.promotion_type === "single" ? "Simple" : "Personalizada"
                return(
                    <em>{type}</em>
                )
            }
        },            
        {

            title: "Producto/s",
            render: (_,record) => {
                const products = record?.promotion_data?.promotion_products_array
                const singleProduct = productsList.find(prod => prod.id === record?.promotion_data.product_id)
                return(
                    <em>{singleProduct ? singleProduct?.product_name : products?.map(prod => `${prod.quantity} ${prod.productName}`).join(", ")}</em>
                )
            }
        },{
            title: "Estado",
            render:(_,record) => {
                const status = record.promotion_state ? "Activo" : "Inactivo"
                return(
                    <em>{status}</em>
                )
            }
        },{
            render:(_,record) => (
                <Space direction='vertical'>
                    <Button type='primary' icon={<EditOutlined/>} onClick={()=> handleEditPromotion(record.promotion_id)}/>
                    <Popconfirm
                        title={"Eliminar promocion"}
                        description={"¿Estas seguro de eliminar la promocion?"}
                        okText={"Eliminar"}
                        cancelText={"Cancelar"}
                        onConfirm={()=> handleDelete(record.promotion_id)}
                    >
                        <Button type='primary' danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]
  return (
    <React.Fragment>
        <Table
            columns={tableColumns}
            dataSource={promotions}
            scroll={{ x: "max-content" }}
            loading={deleting}
        />
    </React.Fragment>
  )
}

export default PromotionsTable
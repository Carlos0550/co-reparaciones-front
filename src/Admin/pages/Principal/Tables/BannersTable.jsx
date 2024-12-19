import { Button, message, Popconfirm, Space, Table } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../../AppContext'
import "./BannerTable.css"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import EditFormModal from '../Modals/EditFormModal'
function BannersTable() {
    const { banners, deleteBanner, handleBanner, editingBanner } = useAppContext()
    const [deleting, setDeleting] = useState(false)
    const handleDelete = async(banner_id) => {
        setDeleting(true)
        await deleteBanner(banner_id)
        setDeleting(false)
    }

    const handleEditBanner = (banner_id) => {
        handleBanner(banner_id,true)
    }
    const tableCols = [
        {
            title: "Banner",
            dataIndex: "banner_name",
            width: 200
        },
        {
            render:(_,record) => {
                const images = record.images
                return(
                    <div className='banner-images'>
                        
                            {images && images.length > 0 && images.map((img,idx) =>(
                                <picture key={idx} className='banner-image-minified'>
                                <img src={img.image_data} alt={record.image_name} />
                                </picture>
                            ))}
                        
                    </div>
                )
            }
        },
        {
            render:(_,value) => (
                <Space direction='vertical'>
                    <Button type='primary' icon={<EditOutlined/>} onClick={()=> handleEditBanner(value.banner_id)}/>
                    <Popconfirm
                        title={"Eliminar banner"}
                        description={"¿Estas seguro de eliminar el banner?"}
                        okText={"Eliminar"}
                        okButtonProps={{ danger: true, loading: deleting }}
                        cancelText={"Cancelar"}
                        onConfirm={()=> handleDelete(value.banner_id)}
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
            columns={tableCols}
            dataSource={banners}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            loading={!banners}
            scroll={{ x: 1000 }}
        />

        {editingBanner && <EditFormModal/>}
    </React.Fragment>
  )
}

export default BannersTable
import { Button, message, notification, Space, Table } from "antd"
import { useAppContext } from "../../../../AppContext"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import React, { useEffect } from "react"
import EditorModal from "../../../../Components/Modales/EditorModal"
import Alerts from "../../../../Components/Modales/Alerts"
function CategoriesTable() {
    const { categories, getCategories, handlerCategories, showCategoryForm, showAlertCategories, } = useAppContext()

    const columns = [
        {
            title: "Categoría",
            dataIndex: "category_name",
            key: "category_name"
        },{
            render:(_,record) => {
                return (
                    <Space>
                        <Button type='primary' icon={<EditOutlined/>}
                            onClick={()=> handlerCategories(true, record.id, true, false, false)}
                        ></Button>
                        <Button type='primary' danger icon={<DeleteOutlined />}
                            onClick={()=> handlerCategories(false, record.id, false, true, true)}
                        ></Button>
                    </Space>
                )
            }
        }
    ]
  return (
    <React.Fragment>
        <Button onClick={async()=>{
            const hiddenMessage = message.loading("Cargando categorías...")
            await getCategories()
            hiddenMessage()
            notification.info({
                message: "Lista de categorias actualizada.",
                description: `Se encontraron ${categories.length} categorías`,
            })
        }} style={{marginBottom: "10px"}}>Refrescar</Button>
        <Table
        columns={columns}
        dataSource={categories}
        rowKey={"category_id"}
        style={{maxHeight: "530px", overflow: "auto"}}
        
    />
    {showCategoryForm && <EditorModal/>}
    {showAlertCategories && <Alerts/>}
    </React.Fragment>
  )
}

export default CategoriesTable
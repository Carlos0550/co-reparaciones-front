import { Button, Space, Table } from 'antd'
import React from 'react'
import { useAppContext } from '../../../AppContext'
import { DeliveredProcedureOutlined, EditOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons'
import RoadIcon from "../../../../public/road_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
import Title from 'antd/es/typography/Title'

function ClientDataTable({ gettingData }) {
    const { clientInfo } = useAppContext()

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
        dataSource={clientInfo}
        loading={gettingData}
        pagination={false}
        rowKey={(record) => record.id}
        bordered
        scroll={{ x: 800 }}
    />
    <Title level={3}>Historial de compras</Title>
    <Table
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
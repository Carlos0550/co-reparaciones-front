import React, { useEffect } from 'react'
import { useAppContext } from '../../../AppContext'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Statistic, Table } from 'antd'
import "./Dashboard.css"
function Dashboard() {
  const { registerUser, loginUser, loginData } = useAppContext()
  const navigate = useNavigate()
  const userName = loginData?.user_fullname

  // useEffect(()=>{
  //     if(!loginUser?.user_fullname) navigate("/")
  // },[loginData])
  return (
    <React.Fragment>
      <h1>Panel de administración</h1>
      <h2>Hola, {loginData?.admin_name}</h2>
      <Card title="Listado de ordenes">
          <Table/>
      </Card>
    </React.Fragment>
  )
}

export default Dashboard
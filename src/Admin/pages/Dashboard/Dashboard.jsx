import React, { useEffect } from 'react'
import { useAppContext } from '../../../AppContext'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Statistic, Table } from 'antd'
import "./Dashboard.css"
function Dashboard() {
  const { loginData } = useAppContext()
  const navigate = useNavigate()

  useEffect(()=> {
    if (!loginData || (Array.isArray(loginData) && loginData.length === 0)) {
        navigate("/login-client");
    } else if (loginData[0] && !loginData[0]?.admin) {
        navigate("/client-info");
    } else if (loginData[0] && loginData[0]?.admin) {
        navigate("/admin-dashboard");
    }
},[loginData])
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
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext'
import { useNavigate } from 'react-router-dom'
import { Card, message, notification, Table } from 'antd'
import "./Dashboard.css"
import useOrders from './useOrders'
import ClientOrderData from './ClientOrderData'
function Dashboard() {
  const { loginData, getOrders, processOrders } = useAppContext()
  const navigate = useNavigate()
  const [gettingOrders, setGettingOrders] = useState(false)
  const alreadyGettingOrders = useRef(false)
  const [orders, setOrders] = useState([])

  

  const handleGetOrders = async() => {
    setGettingOrders(true);
    const result = await getOrders();
    setGettingOrders(false);
    setTimeout(() => {
      notification.destroy();
    }, 1000);
    if (!result) {
      message.info("No hay órdenes de compra");
    }
    setOrders(result.orders)
    message.success(`Ordenes actualizas`,3)
  }
  const fetchOrders = async () => {
    try {
      setGettingOrders(true);
      const result = await getOrders();
      setGettingOrders(false);
      
      if (!result) {
        message.info("No hay órdenes de compra");
      }
      setOrders(result.orders)
      message.success(`Se encontraron ${result?.orders.length} órdenes de compra`,4)
    } catch (error) {
      setGettingOrders(false);
      notification.destroy();
      console.error("Error al obtener órdenes:", error);
      message.error("Hubo un problema al obtener las órdenes.");
    }
  };

  
useEffect(()=>{
  if (!loginData || (Array.isArray(loginData) && loginData.length === 0)) {
    navigate("/login-client");
  } else if (loginData[0] && !loginData[0]?.admin) {
    navigate("/client-info");
  } else if (loginData[0] && loginData[0]?.admin) {
    if (!alreadyGettingOrders.current) {
      alreadyGettingOrders.current = true;
      setTimeout(() => {
        notification.info({
          message: "Obteniendo órdenes de compra...",
          duration: 2,
        });
      }, 200);
      fetchOrders();
    }
  }
},[loginData])


const { 
  orderCols, 
  openModal,
  setOpenModal,
  clientData } = useOrders(processOrders, handleGetOrders)
  return (
    <React.Fragment>
      <h1>Panel de administración</h1>
      <h2>Hola, {loginData[0]?.admin_name}</h2>
      <Card title="Listado de ordenes">
        <Table 
          columns={orderCols}
          dataSource={orders}
          loading={gettingOrders}
        />
      </Card>
      {openModal && (
        <ClientOrderData
          closeModal={() => setOpenModal(false)}
          clientData={clientData}
        />
      )}
    </React.Fragment>
  )
}

export default Dashboard
import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../AppContext'
import { useNavigate } from 'react-router-dom'
import { Card, message, notification, Table } from 'antd'
import "./Dashboard.css"
import useOrders from './useOrders'
import ClientOrderData from './ClientOrderData'
import useSession from '../../../Context_Folders/Session/useSession'
function Dashboard() {
  const { getOrders, processOrders, loginData } = useAppContext()
  const { handleVerifyRoleAndSession } = useSession()
  const [gettingOrders, setGettingOrders] = useState(false)
  const [orders, setOrders] = useState([])


  const fetchOrders = async () => {
    try {
      setGettingOrders(true);
      const result = await getOrders();
      setGettingOrders(false);
      
      if (!result) {
        message.info("No hay órdenes de compra");
        setOrders([]);
        return;
      }
      console.log(result)
      setOrders(result.orders)
      message.success(`Se encontraron ${result?.orders.length} órdenes de compra`,4)
    } catch (error) {
      setGettingOrders(false);
      notification.destroy();
      console.error("Error al obtener órdenes:", error);
      message.error("Hubo un problema al obtener las órdenes.");
    }
  };

  
    const alreadyVerified = useRef(false)
    useEffect(() => {
        if (!alreadyVerified.current) {
            alreadyVerified.current = true
            console.log("Verificando rol...")
            handleVerifyRoleAndSession()
            setTimeout(() => {
              notification.info({
                message: "Obteniendo órdenes de compra...",
                duration: 2,
              });
            }, 200);
            fetchOrders();
        }
    }, [])


const { 
  orderCols, 
  openModal,
  setOpenModal,
  clientData } = useOrders(processOrders, fetchOrders)
  return (
    <React.Fragment>
      <h1>Panel de administración</h1>
      <h2>Hola, {loginData[0]?.admin_name}</h2>
      <Card title="Listado de ordenes">
        <Table 
          columns={orderCols}
          dataSource={orders}
          loading={gettingOrders}
          rowKey={(record) => record.order_id}
          scroll={{x: 800}}
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
import React from 'react'
import dayjs from 'dayjs'
import { Button } from 'antd'
import { useAppContext } from '../../../../AppContext'

export default function getSecurityAdminColumns() {
    const { setEditingAdminPsw, closeSession } = useAppContext()
  return [
    {
      title: 'Nombre de usuario',
      dataIndex: 'admin_name',
      key: 'admin_name',
    },
    {
      title: 'Correo',
      dataIndex: 'admin_email',
      key: 'admin_email', 
    },
    {
      title: 'Próximo cierre de sesión',
      dataIndex: 'expired_session',
      key: 'expired_session',
      render: (expired_session) => formatSessionDate(expired_session)
    },
    {
      title: 'Contraseña',
      key: 'password',
      render: (_, record) => (
        <Button type='primary' onClick={() => setEditingAdminPsw(true)}>
          Cambiar contraseña
        </Button>
      )
    },{
        render: () => (
            <Button type='primary' danger onClick={()=> closeSession()}>Cerrar sesión</Button>
        )
    }
  ]
}

const formatSessionDate = (expired_session) => {
  if (!expired_session) return 'Sin fecha'
  return dayjs(expired_session).format('YYYY-MM-DD')
}

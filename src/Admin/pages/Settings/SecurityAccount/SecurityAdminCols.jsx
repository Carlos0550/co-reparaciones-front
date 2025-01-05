import React from 'react'
import dayjs from 'dayjs'
import { Button } from 'antd'
import { useAppContext } from '../../../../AppContext'
import useSession from "../../../../Context_Folders/Session/useSession"
export default function getSecurityAdminColumns() {
    const { setEditingAdminPsw } = useAppContext()
    const { closeSession } = useSession()
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
      dataIndex: 'session_timeout',
      key: 'session_timeout',
      render: (expired_session) => formatSessionDate(expired_session)
    },
    {
      title: 'Contraseña',
      key: 'password',
      render: () => (
        <Button type='primary' onClick={() => setEditingAdminPsw(true)} disabled>
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

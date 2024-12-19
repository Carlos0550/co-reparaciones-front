import { Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../../AppContext'

function ChangeAdminPsw() {

    const [saving, setSaving] = useState(false)
    const { changeAdminPsw, setEditingAdminPsw } = useAppContext()
    const onFinish = async(values) => {
        setSaving(true)
        const result = await changeAdminPsw(values.new_psw)
        setSaving(false)
        if(result){
            setEditingAdminPsw(false)
        }
    }
  return (
    <Form
        name='change_admin_psw'
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
    >
        <Form.Item
            label="Nueva contraseña"
            name="new_psw"
            rules={[
                {
                    required: true,
                    message: 'Por favor ingrese su nueva contraseña'
                }
            ]}
        >
            <Input type='password'/>
        </Form.Item>

        <Form.Item>
            <Button type='primary' htmlType='submit' loading={saving}>Cambiar contraseña</Button>
        </Form.Item>
    </Form>
  )
}

export default ChangeAdminPsw
import { Button, Flex, Form, Input, Space } from 'antd'
import React from 'react'
import { useClientFormLogic } from './useClientFormLogic'
import { WarningOutlined } from '@ant-design/icons'
import "./ClientInfoForm.css"
import { useAppContext } from '../../../AppContext'
import useSession from '../../../Context_Folders/Session/useSession'
function ClientInfoForm() {
    const [form] = Form.useForm()
    const { width, saveClientInfo } = useAppContext()
    const { closeSession } = useSession()
    const {
        onFinish,
        saving
    } = useClientFormLogic(
        form,
        saveClientInfo,
    )

    return (
        <div className="form-client-info">
            <Form
                onFinish={onFinish}
                form={form}
                layout='vertical'
                style={{
                    width: "100%"
                }}

            >
                <p>Información personal</p>
                <Form.Item
                    name={"client_name"}
                    label="Nombre completo"
                    rules={[
                        {
                            required: true, message: "El nombre es requerido"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name={"client_dni"}
                    label="DNI (Documento nacional de identidad)"
                    tooltip="Ingrese su DNI sin puntos ni espacios"
                    rules={
                        [
                            {
                                required: true, message: "El DNI es obligatorio"
                            },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve()
                                    if (!/^\d+$/.test(value)) return Promise.reject("El DNI solo puede contener números")
                                    return Promise.resolve()
                                }
                            }
                        ]
                    }
                >
                    <Input />
                </Form.Item>

                <p>Información domiciliar</p>
                <p style={{ color: "red" }}><WarningOutlined /> Solo hacemos envios dentro de Argentina</p>
                <Flex wrap gap={"1rem"} justify='space-evenly' vertical={width < 768}>
                <Form.Item
                    name={"first_address"}
                    label="Direccion 1"
                    rules={[
                        {
                            required: true, message: "La direccion es requerida"
                        }
                    ]}
                >
                    <Input className='antd-input'/>
                </Form.Item>

                <Form.Item
                    name={"second_address"}
                    label="Direccion 2"
                >
                    <Input className='antd-input'/>
                </Form.Item>
                </Flex>
                
                <Flex wrap gap={"1rem"} justify='space-evenly' vertical={width < 768}>
                <Form.Item
                    name={"province"}
                    label="Provincia"
                    rules={
                        [
                            {
                                required: true, message: "La provincia es requerida"
                            }
                        ]
                    }
                >
                    <Input className='antd-input'/>
                </Form.Item>

                <Form.Item
                    name="client_phone"
                    label="Telefono"
                    rules={[
                        {
                            required: true, message: "El telefono es requerido"
                        },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve()
                                if (!/^\d+$/.test(value)) return Promise.reject("El telefono solo puede contener números")
                                return Promise.resolve()
                            }
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>
                </Flex>

                <Flex wrap gap={"1rem"} justify='space-evenly' vertical={width < 768}>
                <Form.Item
                    name={"city"}
                    label="Ciudad/pueblo"
                    rules={
                        [
                            {
                                required: true, message: "La ciudad es requerida"
                            }
                        ]
                    }
                >
                    <Input className='antd-input'/>
                </Form.Item>

                <Form.Item
                    name={"postal_code"}
                    label="Código Postal"
                    rules={
                        [
                            {
                                required: true, message: "El codigo postal es requerido"
                            }
                        ]
                    }
                >
                    <Input placeholder='3308'className='antd-input' />
                </Form.Item>
                </Flex>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={saving}>Guardar información</Button>
                </Form.Item>
                <Button onClick={()=> closeSession()} type='primary' danger>Cancelar</Button>
            </Form>
        </div>
    )
}

export default ClientInfoForm
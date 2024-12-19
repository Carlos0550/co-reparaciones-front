import React, { useState } from "react"
import { Button, Flex, Form, Input } from "antd"
import "./Login.css"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../../../AppContext"

function Register() {
const navigate = useNavigate()
const { registerUser } = useAppContext()
const [isLoading, setIsLoading] = useState(false)
    const onFinish = async(values) => {
        setIsLoading(true)
        const formData = new FormData()
        for (const key in values) {
            formData.append(key, values[key] || "")
        }
        const result = await registerUser(formData)
        setIsLoading(false)
        if(result) navigate("/")
    }

  return (
    <React.Fragment>
    <div className="login-container">
        <div className="login__wrapper">
            <h1>Crear una cuenta</h1>
            <Form
                name="login__form"
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
                
                style={{ width: "100%" }}
            >
                <div className="login__layout">
                <Form.Item
                    label="Nombre"
                    name={"user_fullname"}
                    rules={[
                        {
                            required: true,
                            message: "Por favor ingresa tu nombre",
                        },
                    ]}
                >
                    <Input placeholder="Introduce tu nombre"/>
                </Form.Item>

                <Form.Item
                    label="Nombre de usuario"
                    className="form-item"
                    name="user_login_name"
                    help="Lo usarás opcionalmente para iniciar sesión"
                >
                    <Input placeholder="Introduce un usuario"/>
                </Form.Item>
                </div>
                <div className="login__layout">
                <Form.Item
                    label="Contraseña"
                    
                    name="user_password"
                    rules={[
                        {
                            required: true,
                            message: "Por favor ingresa tu contrasena!",
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name={"user_email"}
                    label="Email"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Por favor ingresa tu email!",
                        },
                    ]}
                    help="Lo usarás para iniciar sesión y recibir notificaciones"
                >
                    <Input placeholder="Introduce tu email"/>
                </Form.Item>
                </div>

                <Form.Item>
                    <Flex wrap justify="space-between">
                        <Button type="primary" htmlType="submit" loading={isLoading}>Registrar</Button>
                        <Button onClick={() => navigate("/")}>Ya tengo una cuenta</Button>
                    </Flex>
                </Form.Item>
            </Form>
            <button className="recover-password-btn">Recuperar contraseña</button>
        </div>
    </div>
</React.Fragment>
  )
}

export default Register
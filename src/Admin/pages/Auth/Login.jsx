import React, { useEffect, useState } from "react"
import { Button, Flex, Form, Input, notification, Radio, Space, Switch } from "antd"
import "./Login.css"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../../../AppContext"

function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [hiddenPsw, setHiddenPsw] = useState(true)
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [switchInput, setSwitchInput] = useState(false)
    const [hiddenMainForm, setHiddenMainForm] = useState(false)
    const [adminVerified, setAdminVerified] = useState(false)
    const [user_email, setUserEmail] = useState("")

    const { updateAdminPassword, verifyAccountUser, verifyOtpAdminCode, loginAdmin } = useAppContext()

    const onFinish = async (values) => {
        setIsLoading(true)
        setUserEmail(values.user_email)
        try {
            const result = await verifyAccountUser(values.user_email)
            console.log(result)
            
            if (result === 403) {
                setHiddenMainForm(true)
                setShowOtpInput(true)
                return
            }
            
            if (result === 200) {
                setHiddenMainForm(true)
                setHiddenPsw(false)
                setAdminVerified(true)
            }

            if (result) navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const onOtpSubmit = async (values) => {
        setIsLoading(true)
        try {
            const result = await verifyOtpAdminCode(values.otp_result, user_email)
            
            if (result) {
                setShowOtpInput(false)
                setHiddenPsw(false)
                return; 
            }
            return console.log("OTP incorrecto");
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    
    const onPasswordSubmit = async (values) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("user_password", values.user_password)
            formData.append("user_email", user_email)

            const result = adminVerified ? await loginAdmin(formData) : await updateAdminPassword(values.user_password, user_email)
            
            if (result) {
                navigate("/dashboard")
            } else {
                console.log("No se pudo guardar la contraseña")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <React.Fragment>
            <div className="login-container">
                <div className="login__wrapper">
                    <h1>Iniciar sesión</h1>
                    {
                        !hiddenMainForm && (
<Form
                        name="login__form"
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            label="Email"
                            className="form-item"
                            name="user_email"
                            rules={[
                                { required: true, message: "Por favor ingresa tu email!" },
                                { type: "email", message: "Por favor ingresa un email válido!" }
                            ]}
                        >
                            <Input placeholder="Introduce tu email" />
                        </Form.Item>

                        <Space>
                            <Switch
                                style={{ marginBottom: "10px" }}
                                value={switchInput}
                                onChange={(e) => setSwitchInput(e)}
                            />
                            <p style={{ marginBottom: "10px" }}>Soy administrador</p>
                        </Space>

                        <Button htmlType="submit" type="primary" loading={isLoading}>Iniciar sesión</Button>
                    </Form>
                        )
                    }

                    {showOtpInput && (
                        <Form
                            name="otp__form"
                            onFinish={onOtpSubmit}
                            layout="vertical"
                            style={{ width: "100%" }}

                        >
                            <Form.Item
                                name="otp_result"
                                label="Código de verificación"
                                rules={[{ required: true, message: "Por favor ingresa el código OTP!" }]}
                            >
                                <Input placeholder="Introduce tu código OTP" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading}>Verificar OTP</Button>
                            </Form.Item>
                        </Form>
                    )}

                    {!hiddenPsw && (
                        <Form
                            name="password__form"
                            onFinish={onPasswordSubmit}
                            layout="vertical"
                            style={{ width: "100%" }}
                        >
                            <Form.Item
                                label="Contraseña"
                                name="user_password"
                                rules={[{ required: true, message: "Por favor ingresa tu contraseña!" }]}
                            >
                                <Input.Password placeholder="Introduce tu contraseña" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading}>Guardar contraseña</Button>
                            </Form.Item>
                        </Form>
                    )}

                    <button className="recover-password-btn">Recuperar contraseña</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login

import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Input } from "antd"
import "./LoginClient.css"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../../AppContext"
import useSession from "../../Context_Folders/Session/useSession"
function LoginClient() {
    const navigate = useNavigate()
    const { loginClientWithEmail, createNewClient, verifyAuthCodeClients, handleVerifyRoleAndSession } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)

    const [hideMainForm, setHiddenMainForm] = useState(false)
    const [currentUserEmail, setCurrentUserEmail] = useState(null)

    const onFinish = async (values) => {
        setIsLoading(true)
        const result = isCreatingAccount ? await createNewClient(values.user_email) : await loginClientWithEmail(values.user_email)
        setIsLoading(false)
        if (result) {
            setCurrentUserEmail(values.user_email)
            setHiddenMainForm(true)
            setIsLoading(false)
        }
    }

    const onOtpSubmit = async (values) => {
        setIsLoading(true)
        const result = await verifyAuthCodeClients(values.otp_code, currentUserEmail)
        if(result){
            setIsLoading(false)
            location.href = "/client-info"
        }
        setIsLoading(false)
    }

    const alreadyVerified = useRef(false)
    useEffect(()=> {
            if(!alreadyVerified.current){
                alreadyVerified.current = true
                handleVerifyRoleAndSession()
            }
        },[])

    return (
        <React.Fragment>
            <div className="login-container">
                <div className="login-client-wrapper">
                    <h1>{isCreatingAccount ? "Crear cuenta" : "Iniciar sesión"}</h1>
                    {!hideMainForm && <Form
                        name="client-login-form"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={onFinish}
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            name={"user_email"}
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor ingrese su email",
                                    type: "email"
                                }
                            ]}
                        >
                            <Input placeholder="jhon@gmail.com" />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary" loading={isLoading}>Iniciar sesión</Button>
                        </Form.Item>
                        <div className="form-buttons">
                            <Button onClick={() => navigate("/login-admin")}>Soy administrador</Button>
                            <Button onClick={()=> setIsCreatingAccount(!isCreatingAccount)}>{isCreatingAccount ? "Iniciar sesión" : "Crear cuenta"}</Button>
                        </div>
                    </Form>}

                    {hideMainForm && <Form
                        name="client-login-form"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={onOtpSubmit}
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            name={"otp_code"}
                            label="Ingresá el codigo de verificación"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor ingrese el codigo de verificación",
                                }
                            ]}
                        >
                            <Input.OTP length={5} style={{margin: "0 auto"}}/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary" loading={isLoading}>Iniciar sesión</Button>
                        </Form.Item>
                        <Button danger onClick={()=> setHiddenMainForm(false)}>Cancelar</Button>
                    </Form>}
                </div>

            </div>
        </React.Fragment>
    )
}

export default LoginClient

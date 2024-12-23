import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import Logo from "../../../public/logo.jpeg"
import "./ClientLayout.css"
function ClientHeader() {
    const { width, categories, paragraphColor, headerColor, loginData, setOpenCart} = useAppContext()
    const navigate = useNavigate()

    const headerContent = [
        {
            id: 1,
            name: "📱 Celulares"
        },
        {
            id: 2,
            name: "🔋 Accesorios de Celulares"
        },
        {
            id: 3,
            name: "🎧 Accesorios de Audio"
        },
        {
            id: 4,
            name: "📱 Accesorios de Celulares"
        },
        {
            id: 5,
            name: "🔌 Cables y Adaptadores"
        }
    ]
  return (
    <header className="header" >
                <nav className="navbar" style={{ backgroundColor: headerColor || "#ffffff" }}>
                    <picture className="logo-container" onClick={() => navigate("/")}>
                        <img src={Logo} />
                    </picture>
                    <ul className="navbar-ul">
                        {width > 768 && headerContent.slice(0, (() => {
                            if (width > 1200) return Math.floor(headerContent.length * 0.9);
                            if (width > 1000) return Math.floor(headerContent.length * 0.8);
                            if (width > 868) return Math.floor(headerContent.length * 0.6);
                            if (width > 768) return Math.floor(headerContent.length * 0.4);
                            return 0;
                        })()).map((cat, idx) => (
                            <li className="navbar-li" key={cat.id || idx}>
                                <p className="navbar-p" style={{ color: paragraphColor || "#ffffff" }}>{cat?.name}</p>
                            </li>
                        ))}
                    </ul>
                    <Space>
                        <Button onClick={() => {
                            if(!loginData.id) navigate("/login-client")
                            if(loginData && loginData.user_type === "client") navigate("/client-info")
                            if(loginData && loginData.user_type === "admin") navigate("/admin-dashboard")
                        }} icon={<UserOutlined />} />

                        <Button icon={<ShoppingCartOutlined />} onClick={()=> setOpenCart(true)}/>
                    </Space>
                </nav>


            </header>
  )
}

export default ClientHeader
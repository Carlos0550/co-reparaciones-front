import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import Logo from "../../../public/logo.jpeg"
import "./ClientLayout.css"
import useSession from '../../Context_Folders/Session/useSession';
function ClientHeader() {

    const { width, paragraphColor, headerColor, setOpenCart, isAdmin, loginData} = useAppContext()
    // const {  } = useSession()
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

    function handleRedirect() {
        console.log(loginData)
        if(loginData?.user_type === "client")navigate("/client-info")
        if(loginData?.user_type === "admin")navigate("/admin-dashboard")
        else navigate("/login-client")
    }
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
                    <Button 
                        onClick={() => handleRedirect()} 
                        icon={<UserOutlined />} 
                    />

                        {!isAdmin && <Button icon={<ShoppingCartOutlined />} onClick={()=> setOpenCart(true)}/>}
                    </Space>
                </nav>


            </header>
  )
}

export default ClientHeader
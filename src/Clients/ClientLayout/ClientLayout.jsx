import React, { useEffect, useRef, useState } from "react"
import "./ClientLayout.css"
import { useAppContext } from "../../AppContext.jsx"
import { Button, Drawer, Space } from "antd"
import { Route, Routes, useNavigate } from "react-router-dom"
import BannersView from "../views/BannersView/BannersView.jsx"
import ProductsView from "../views/ProductsView/ProductsView.jsx"
import { ClockCircleOutlined, GithubOutlined, MailOutlined, ShoppingCartOutlined, UserOutlined, WhatsAppOutlined } from "@ant-design/icons"
import RoadSVg from "../../../public/road_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
import ProductDetailsView from "../views/ProductDetailsView/ProductDetailsView.jsx"
import CartView from "../views/CartView/CartView.jsx"
import Logo from "../../../public/logo.jpeg"
function ClientLayout() {
    const { categories,
        paragraphColor,
        footerColor,
        headerColor,
        contentColor,
        width,
        initPage,
        banners,
        productsList,
        setOpenCart,
        openCart
    } = useAppContext()

    const navigate = useNavigate()

    const alreadyInit = useRef(false)
    useEffect(()=>{
        if(!alreadyInit.current){
            alreadyInit.current = true
            initPage()
        }
    },[])

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
        <React.Fragment>
            <header className="header" >
                <nav className="navbar" style={{ backgroundColor: headerColor || "#ffffff" }}>
                    <picture className="logo-container" onClick={() => navigate("/")}>
                        <img src={Logo} />
                    </picture>
                    <ul className="navbar-ul">
                        {Array.isArray(headerContent) && width > 768 && headerContent.slice(0, (() => {
                            if (width > 1200) return Math.floor(categories.length * 0.9);
                            if (width > 1000) return Math.floor(categories.length * 0.8);
                            if (width > 868) return Math.floor(categories.length * 0.6);
                            if (width > 768) return Math.floor(categories.length * 0.4);
                            return 0;
                        })()).map((cat, idx) => (
                            <li className="navbar-li" key={cat.id || idx}>
                                <p className="navbar-p" style={{ color: paragraphColor || "#000000" }}>{cat?.name}</p>
                            </li>
                        ))}
                    </ul>
                    <Space>
                        <Button onClick={() => {
                            navigate("/login-client")
                        }} icon={<UserOutlined />} />

                        <Button icon={<ShoppingCartOutlined />} onClick={()=> setOpenCart(true)}/>
                    </Space>
                </nav>


            </header>
            <Routes>
                <Route path="/" element={
                    <div className="main-client-container" style={{ backgroundColor: contentColor || "#ffffff" }}>
                    {banners && banners.length > 0 && <BannersView />}
                    {productsList && productsList.length > 0
                        ? <ProductsView />
                        : <p>Todavía no hay nada por aquí, vuelve pronto.</p>
                    }
                </div>
                }/>
            <Route path="/product-details/:product_id" element={<ProductDetailsView/>}/>
            </Routes>
            <footer style={{ backgroundColor: footerColor || "#ffffff" }}>
                <div className="footer-content">
                    <div className="footer-info">
                        <p><MailOutlined /> Cristianocampo@Reparaciones</p>
                        <p style={{ display: "flex" }}><img src={RoadSVg} width={20} height={20} /> Av Mitre y esquina Pelegrini, Candelaria Misiones</p>
                        <p><ClockCircleOutlined /> Horarios de lunes a viernes de 08:30 a 13:00 y de 15:30 a 20:30</p>
                        <p>3764100978</p>
                    </div>

                    <div className="footer-credits">
                        <p>Pagina web hecha por PelinskiCarlos</p>
                    </div>

                    <div className="footer-icons">
                        <a href="https://github.com/Carlos0550" target="_blank" rel="noopener noreferrer">
                            <Button icon={<GithubOutlined />} />
                        </a>
                        <a href="https://wa.me/3765223959" target="_blank" rel="noopener noreferrer">
                            <Button icon={<WhatsAppOutlined />} />
                        </a>
                    </div>
                </div>
            </footer>
            
            {
                openCart && <Drawer onClose={() => setOpenCart(false)} open={openCart} children={<CartView />}/>
            }

            
        </React.Fragment>
    )
}

export default ClientLayout

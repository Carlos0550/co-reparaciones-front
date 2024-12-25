import React, { useEffect, useRef } from "react"
import "./ClientLayout.css"
import { useAppContext } from "../../AppContext.jsx"
import { Button, Drawer } from "antd"
import { Route, Routes } from "react-router-dom"
import BannersView from "../views/BannersView/BannersView.jsx"
import ProductsView from "../views/ProductsView/ProductsView.jsx"
import { ClockCircleOutlined, GithubOutlined, MailOutlined, WhatsAppOutlined } from "@ant-design/icons"
import RoadSVg from "../../../public/road_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
import ProductDetailsView from "../views/ProductDetailsView/ProductDetailsView.jsx"
import CartView from "../views/CartView/CartView.jsx"
import ClientHeader from "./ClientHeader.jsx"
import PromotionsView from "../views/PromotionsView/PromotionsView.jsx"

import EmptyImage from "../../../public/emptyImage.webp"
function ClientLayout() {
    const { 
        footerColor,
        contentColor,
        initPage,
        banners,
        productsList,
        setOpenCart,
        openCart, 
        promotions   
    } = useAppContext()

    const alreadyInit = useRef(false)
    useEffect(()=>{
        if(!alreadyInit.current){
            alreadyInit.current = true
            initPage()
        }
    },[])

    return (
        <React.Fragment>
            <ClientHeader/>
            <Routes>
                <Route path="/" element={
                    <div className="main-client-container" style={{ backgroundColor: contentColor || "#ffffff" }}>
                    
                    
                    {productsList && productsList.length > 0
                        ? (
                            <>
                                {banners && banners.length > 0 && <BannersView />}
                                {promotions && promotions.length > 0 && <PromotionsView/>}
                                <ProductsView />
                            </>
                        )
                        : <div className="empty-container">
                            <picture className="empty-image">
                                <img src={EmptyImage} alt="" />
                            </picture>
                            <div className="empty-info">
                                <h2 className="empty-title">No hay productos disponibles</h2>
                                <p className="empty-subtitle">Pero no te preocupes, puedes volver más adelante</p>
                            </div>
                        </div>
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

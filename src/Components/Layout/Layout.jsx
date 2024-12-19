import './LayoutComponent.css';
import logoImg from "../../public/assets/logo.png"
import { HomeOutlined, MenuOutlined, ProductOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import PromotionIcon from "../../public/assets/icons/discount-tag-discount-ecommerce-svgrepo-com.svg"
import BannerSvg from "../../public/assets/icons/bannerSvg.svg"
function LayoutComponent({ component }) {
    const navigate = useNavigate()
    const [resizeSideBar, setResizeSideBar] = useState(false)
    const { width } = useAppContext()

    useEffect(() => {
        if (width > 868) setResizeSideBar(false)
        else setResizeSideBar(true)
    }, [width])
    return (
        <div className="layout">
            {/* <header className="header">
                <picture className='logo-container'>
                    <img src={logoImg} alt="logoImg" />
                </picture>
                <button className='logout-btn'>Cerrar sesión</button>
            </header> */}

            <div className="main-layout">
                <aside className={resizeSideBar ? "sider active" : "sider"}>
                    {!resizeSideBar ? <p>Plantas Emanuel</p> : <p style={{ marginBottom: "18px" }}></p>}
                    {width < 868 && <span onClick={() => setResizeSideBar(!resizeSideBar)} className={resizeSideBar ? "menu-icon active" : "menu-icon"}>
                        <MenuOutlined style={{ fontSize: "24px" }} />
                    </span>}

                    <ul>
                        {
                            (width >= 868 || (resizeSideBar === false && width < 868))
                                ? (
                                    <React.Fragment>
                                        <li onClick={() => {
                                            navigate("/admin-dashboard")
                                            if (width < 868) setResizeSideBar(true)
                                        }}>
                                            <HomeOutlined style={{ fontSize: "22px" }} /> Dashboard
                                        </li>
                                        <li onClick={() => {
                                            if (width < 868) setResizeSideBar(true)
                                            navigate("/admin-manage-products")
                                        }}>
                                            <ProductOutlined style={{ fontSize: "22px" }} /> Productos
                                        </li>

                                        <li
                                            onClick={()=>{
                                                if (width < 868) setResizeSideBar(true)
                                                navigate("/admin-manage-promotions")
                                            }}
                                        >
                                            <img src={PromotionIcon} width={24} height={24}/>Promociones
                                        </li>

                                        <li
                                            onClick={()=> {
                                                if (width < 868) setResizeSideBar(true)
                                                navigate("/admin-manage-principal")
                                            }}
                                        >
                                            <img src={BannerSvg} width={24} height={24}/> Principal
                                        </li>

                                        <li
                                            onClick={()=> {
                                                if (width < 868) setResizeSideBar(true)
                                                navigate("/admin-manage-clients")
                                            }}
                                        >
                                            <UserOutlined style={{ fontSize: "22px" }} /> Clientes
                                        </li>
                                        <li
                                            onClick={()=> {
                                                if (width < 868) setResizeSideBar(true)
                                                navigate("/admin-settings")
                                            }}
                                        >
                                            <SettingOutlined style={{ fontSize: "22px" }} /> Ajustes
                                        </li>
                                    </React.Fragment>
                                )
                                : null
                        }
                    </ul>

                </aside>

                <main className="content">
                    {component}
                </main>
            </div>
        </div>
    );
}

export default LayoutComponent;

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import { apis } from './utils/apis';
import { processRequests } from './utils/processRequests';
import { message, notification } from "antd"
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import EditorModal from './Components/Modales/EditorModal';

import Loader from "./utils/Loader"

import setAdminPassword from "./Context_Folders/AdminAuth/SetAdminPsw"
import useSession from './Context_Folders/Session/useSession';



dayjs.extend(utc)
dayjs.extend(timezone)

const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return ctx
}

export const AppProvider = ({ children }) => {

    const { retrieveSession, loginData, 
        setLoginData } = useSession()

    const registerUser = async (userData) => {
        try {
            const response = await fetch(`${apis.backend}/api/users/register-user`, {
                method: "POST",
                body: userData
            })

            const responseData = await processRequests(response)
            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            notification.success({
                message: responseData.msg,
                description: "Ahora podrá iniciar sesión con los datos que proporcionaste.",
                duration: 3,
                pauseOnHover: false,
                showProgress: true
            })
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible registrarte",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const saveCategory = async(categoryName) => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/save-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({category_name: categoryName})
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible registrar la categoría",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }
    const [categories, setCategories] = useState([])
    const getCategories = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/get-categories`)

            const responseData = await processRequests(response)
            if(response.status === 404){
                return setCategories([])
            };
            if(!response.ok) throw new Error(responseData.msg)
            if(responseData.categories.length > 0) setCategories(responseData.categories)
            
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible encontrar las categorías",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const saveProduct = async(productData) => {
        try {
            const response = await fetch(`${apis.backend}/api/products/save-product`, {
                method: "POST",
                
                body: productData
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible registrar el producto",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [productsList, setProductsList] = useState([])

    const getProducts = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/products/get-products`)

            const responseData = await processRequests(response)
            if(response.status === 404){
                setProductsList([])
                return
            };
            if(!response.ok) throw new Error(responseData.msg)

            if(responseData.products.length > 0) setProductsList(responseData.products)
            else setProductsList([])
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible encontrar los productos",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
        }
    }

    const [editingProduct, setEditingProduct] = useState(false)
    const [showProductForm, setShowProductForm] = useState(false)
    const [showAlertProductForm, setShowAlertProductForm] = useState(false)
    const [productId, setProductId] = useState(null)
    const [isDeletingProduct, setIsDeletingProduct] = useState(false)
    const handleProducts = (editing = false, productId = null, showProductForm = false, showAlertProuctsForm = false, deletingProduct = false) => {
        setEditingProduct(editing)
        setProductId(productId)
        setShowProductForm(showProductForm)
        setShowAlertProductForm(showAlertProuctsForm)
        setIsDeletingProduct(deletingProduct)
    }

    const editProducts = async(productValues, productId) => {
        try {
            const response = await fetch(`${apis.backend}/api/products/edit-product/${productId}`, {
                method: "PUT",
                body: productValues
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
           
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible actualizar el producto",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const deleteProducts = async(productID) => {
        if(!productID) return
        try {
            const response = await fetch(`${apis.backend}/api/products/delete-product/${productID}`, {
                method: "DELETE"
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            const hiddenMessage = message.loading("Actualizando productos...",0)
            await getProducts()
            hiddenMessage()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar el producto",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [editingCategory, setEditingCategory] = useState(false)
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [showAlertCategories, setShowAlertCategories] = useState(false)
    const [categoryId, setCategoryId] = useState(null)
    const [isDeletingCategory, setIsDeletingCategory] = useState(false)
    const handlerCategories = async(editing = false, categoryId = null, showCategoryForm = false, showAlertCategories = false, deletingCategory = false) => {
        setEditingCategory(editing)
        setCategoryId(categoryId)
        setShowCategoryForm(showCategoryForm)
        setShowAlertCategories(showAlertCategories)
        setIsDeletingCategory(deletingCategory)
    }

    const editCategory = async(categoryValues, categoryId) => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/edit-category/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({category_name: categoryValues})
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible actualizar la categoría",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    
    const getCountProductsWithCategory = async(categoryID) => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/get-count-products-with-category/${categoryID || categoryId}`)

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            return responseData.countPrWithCat
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    const deleteCategory = async(categoryID) => {
        if(!categoryID) return
        try {
            const response = await fetch(`${apis.backend}/api/categories/delete-category/${categoryID}`, {
                method: "DELETE"
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            getCategories()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar la categoría",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }    

    const savePromotion = async(promotionValues) => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/save-promotion`,{
                method: "POST",
                body: promotionValues
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
                console.log(responseData)
            message.success(`${responseData.msg}`)
            getAllPromotions()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible guardar la promoción",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [promotions, setPromotions] = useState([])
    const getAllPromotions = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/get-promotions`)
            const responseData = await processRequests(response)
            if(response.status === 404){
                setPromotions([])
                return
            } ;
            if(!response.ok) throw new Error(responseData.msg)
            if(responseData.promotions.length > 0) setPromotions(responseData.promotions)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible obtener las promociones",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    };

    const deletePromotion = async(promotionID) => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/delete-promotion/${promotionID}`,{
                method: "DELETE"
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`) 
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar la promocion",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
        }
    }

    const [promotionID, setPromotionID] = useState(null)
    const [editingPromotion, setEditingPromotion] = useState(false)
    const handlePromotions = (promotion_id = null, editing = false) => {
        setPromotionID(promotion_id)
        setEditingPromotion(editing)
    }

    const editPromotion = async(promotionData) => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/edit-promotion/${promotionID}`,{
                method: "PUT",
                body: promotionData
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            getAllPromotions()
            handlePromotions()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible editar la promocion",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    };

    const saveBanner = async(bannerData) => {
        try {
            const response = await fetch(`${apis.backend}/api/banners/save-banner`,{
                method: "POST",
                body: bannerData
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            await getAllBanners()
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible guardar el banner",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }
    const [banners, setBanners] = useState([])
    const getAllBanners = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/banners/get-banners`)
            const responseData = await processRequests(response)
            if(response.status === 404) return setBanners([]);
            if(!response.ok) throw new Error(responseData.msg)
            if(responseData.banners.length > 0) setBanners(responseData.banners)
            else setBanners([])
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible obtener los banners",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const deleteBanner = async(bannerID) => {
        try {
            const response = await fetch(`${apis.backend}/api/banners/delete-banner/${bannerID}`,{
                method: "DELETE"
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            getAllBanners()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar el banner",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [bannerId, setBannerId] = useState(null)
    const [editingBanner, setEditingBanner] = useState(false)
    const handleBanner = (bannerID, editing = false) => {
        setBannerId(bannerID)
        setEditingBanner(editing)
    }

    const editBanner = async(bannerData) => {
        try {
            const response = await fetch(`${apis.backend}/api/banners/edit-banner/${bannerId}`,{
                method: "PUT",
                body: bannerData
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            getAllBanners()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible editar el banner",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }
    const [headerColor, setHeaderColor] = useState("")
    const [contentColor, setContentColor] = useState("")
    const [footerColor, setFooterColor] = useState("")
    const [titleColor, setTitleColor] = useState("")
    const [subtitleColor, setSubtitleColor] = useState("")
    const [paragraphColor, setParagraphColor] = useState("")

    const getPageColors = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/colors/get-page-colors`)
            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            setHeaderColor(responseData.headerColor)
            setContentColor(responseData.contentColor)
            setFooterColor(responseData.footerColor)
            setTitleColor(responseData.titleColor)
            setSubtitleColor(responseData.subtitleColor)
            setParagraphColor(responseData.paragraphColor)
            return true
        } catch (error) {
            console.log(error)
            
            return false
        }
    }


    const editPageColors = async(colorsData) => {
        try {
            const response = await fetch(`${apis.backend}/api/colors/edit-page-colors`,{
                method: "PUT",
                body: colorsData
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            await getPageColors()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible editar los colores",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [editingAdminPsw, setEditingAdminPsw] = useState(false)
    const changeAdminPsw = async(newPsw) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/change-admin-psw?admin_email=${loginData.admin_email}&password=${newPsw}`,{
                method: "PUT",
            })
            const responseData = await processRequests(response)
            console.log(responseData)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            setEditingAdminPsw(false)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible cambiar la contraseña",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [openCart, setOpenCart] = useState(false)


    const appIsReady = useRef(false)
    const [isInitialising, setIsInitialising] = useState(false)
    const initPage = async() => {
        console.log("Comienza a cargar los datos")
        setIsInitialising(true)
        try {
            await Promise.all([
               getCategories(),
               getProducts(),
               getAllPromotions(),
               getAllBanners(),
               getPageColors()
            ]);
            
         } catch (error) {
            message.error("Hubo un error al cargar los datos")
            console.error(error)
         }finally{
            console.log("Termina de cargar los datos")
            setIsInitialising(false)
         } 
    }

    const saveClientInfo = async(clientData) => {
        console.log("lOGINdATA: ",loginData)
        console.log("ClientData: ",clientData)
        try {
            const response = await fetch(`${apis.backend}/api/clients/save-client-info?client_id=${encodeURI(loginData.id)}`,{
                method: "POST",
                body: clientData
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            const updatedLoginData = {
                ...loginData,
                is_verified: true
            }

            setLoginData(updatedLoginData)
            localStorage.setItem("session_data", JSON.stringify(updatedLoginData))

            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible guardar la informacion",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }
    

    const processOrders = async(orderId) => {
        try {
            const response = await fetch(`${apis.backend}/api/orders/process-order/${orderId}`,{
                method: "PUT"
            })
            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            
            notification.info({
                message: "Orden de compra procesada",
                description: responseData.msg,
                duration: 5,
                showProgress: true
            })
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible procesar la orden",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const getOrders = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/orders/get-orders`)

            if(response.status === 404) return false;
            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)

            return responseData
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const [gettingClientOrder, setGettingClientOrder] = useState(false)
    
    const [clientOrder, setClientOrder] = useState([])
    const getClientOrder = async(clientId) => {

        if(!clientId){
            notification.info({
                message: "Tus datos estan en proceso",
                description: "No pudimos buscar tus ordenes porque tus datos estan en proceso, espera unos segundos e intenta de nuevo",
                duration: 5,
                showProgress: true,
                pauseOnHover: false
            })

            return false
        }
        setGettingClientOrder(true)

        try {
            const response = await fetch(`${apis.backend}/api/clients/get-client-orders/${clientId}`)
            
            if(response.status === 404) return;
            const responseData = await processRequests(response)

            if(response.status === 400){
                setTimeout(() => {
                    notification.info({
                        message: "Estamos cargando tus datos",
                        description: "No pudimos obtener tus ordenes tus datos estan en proceso, espera unos segundos e intenta de nuevo",
                        duration: 5,
                        showProgress: true,
                        pauseOnHover: false
                    }) 
                }, 1500);

                return;
            }
            if(!response.ok) throw new Error(responseData.msg)

            setClientOrder(responseData?.orders || [])
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No pudimos obtener tus ordenes",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }finally{
            setGettingClientOrder(false)
        }
    }

    useEffect(()=>{
        if(!appIsReady.current && loginData.length > 0 && !location.includes("/payment")){ 
            appIsReady.current = true
            message.loading("Cargando datos...")
            initPage() //Descarga los datos del backend
        }
    },[loginData])

    const location = useLocation().pathname
    
    const alreadyVerifiedSession = useRef(false) //Hace una verificación inicial de la sesion 
    useEffect(()=>{
        if(!alreadyVerifiedSession.current){
            alreadyVerifiedSession.current = true
            retrieveSession()
        }
    },[])


    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[])

    const alreadyCharged = useRef(false)
    useEffect(() => {
        if(location.includes("/admin-") && (loginData && loginData.user_type === "admin" &&Object.keys(loginData).length > 0) && !alreadyCharged.current){
            console.log("Cargando sistema");
            alreadyCharged.current = true;
    
            (async () => {
                const hiddenMessage = message.loading("Trayendo datos...", 0);
                try {
                    await Promise.all([
                        getAllBanners(),
                        getAllPromotions(),
                        getCategories(),
                        getProducts(),
                        getPageColors()
                    ]);
                    message.success("Sistema listo!");
                } catch (error) {
                    message.error("No se pudo recuperar algunos datos.")
                    console.error("Error fetching data", error);
                } finally {
                    hiddenMessage();
                }
            })();
        }
    },[location, loginData])

    return (
        <AppContext.Provider
            value={{
                //Categorias
                saveCategory, getCategories, categories, getCountProductsWithCategory, deleteCategory,
                //Categories handlers
                handlerCategories, editingCategory, categoryId, showCategoryForm, showAlertCategories, isDeletingCategory,
                editCategory,
                //Productos
                saveProduct, productsList, getProducts, deleteProducts,
                //Products Handlers
                editProducts, handleProducts, editingProduct, productId, showProductForm, showAlertProductForm, isDeletingProduct,
                
                // Utils
                width,
                
                //Promociones
                savePromotion, promotions, getAllPromotions, deletePromotion, 
                //Promotions handlers
                handlePromotions, promotionID, editingPromotion,editPromotion, 
                //Banners
                saveBanner, banners, deleteBanner, getAllBanners,
                //Banners handlers
                handleBanner, bannerId, editingBanner, editBanner, 
                //Colores de la página
                headerColor, contentColor, footerColor,
                titleColor, subtitleColor, paragraphColor, getPageColors,
                //Colors handlers
                editPageColors,setHeaderColor, setContentColor, setFooterColor, setTitleColor,
                setSubtitleColor, setParagraphColor,

                //Carrito
                setOpenCart, openCart,
                
                //Inicio de aplicación
                isInitialising, initPage,
            
                
                changeAdminPsw, setAdminPassword,
                setEditingAdminPsw, editingAdminPsw,

                //Clientes
                loginData,getClientOrder, gettingClientOrder, setGettingClientOrder, clientOrder, setClientOrder,
                //Inicio de sesión
                registerUser,
                //Guardar información del cliente
                saveClientInfo,

                //Ordenes
                getOrders, processOrders
            }}
            
        >
            
            {editingAdminPsw && <EditorModal/>}

            {isInitialising && <Loader/>}
            
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}
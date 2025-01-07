import { notification } from "antd";
import { apis } from "../../utils/apis";
import { useState } from "react";

import { useAppContext } from "../../AppContext";
import useCart from "../../utils/CartManager";
import { useNavigate } from "react-router-dom";

function usePayment() {
    const { loginData, getProducts } = useAppContext()
    const { setCart } = useCart()
    const [showWhatsapp, setShowWhatsapp] = useState(false)
    
    const navigate = useNavigate()
    // const purchaseProduct = async() => {
    //     await retrieveClientInfo(true)
    //     const clientData = localStorage.getItem("client_info");
    //     const formData = new FormData()
    //     const cart = localStorage.getItem("current_cart")

    //     const products = JSON.parse(cart)
        
    //     let processedProducts = []

    //     if(products && products.length > 0){
    //         products.forEach(element => {
    //             productsList.forEach(prod => {
    //                 if(prod.id === element.id){

    //                     processedProducts.push({
    //                         id: prod.id,
    //                         quantity: element.quantity,
    //                         name: prod.product_name,
    //                         unit_price: prod.product_price,
    //                         currency_id: 'ARS'
    //                     })
    //                 }
    //             })
    //         })
    //     }

        
    //     formData.append("products", JSON.stringify(processedProducts))
    //     formData.append("client_data", clientData)
    //     try {
    //         const response = await fetch(`${apis.backend}/api/checkout/create-payment`,{
    //             method: "POST",
    //             body: formData
    //         })

    //         const responseData = await processRequests(response)
            
    //         if(!response.ok) throw new Error(responseData.msg)
            
    //         document.location.href = responseData.init_point
    //         return true
    //     } catch (error) {
    //         console.log(error)
    //         notification.error({
    //             message: "No fue posible proceder con la compra.",
    //             description: error.message,
    //             duration: 5,
    //             pauseOnHover: false,
    //             showProgress: true
    //         })
    //         return false
    //     }
    // }
    
    const sendPurchaseConfirmation = async () => {
        const cart = localStorage.getItem("current_cart");

        const products = JSON.parse(cart);
        const formData = new FormData();

        formData.append("products", JSON.stringify(products));
        formData.append("client_data", JSON.stringify(loginData[0]));
    
        try {
            const response = await fetch(`${apis.backend}/api/admins/send-purchase-confirmation`, {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                console.log("Confirmación de compra enviada exitosamente.");
                await substractStockInDb(products)
                return true
            } else {
                throw new Error("Error en la respuesta del servidor.");
            }
        } catch (error) {
            console.error("Error al enviar la confirmación de compra:", error);
    
            notification.error({
                message: "No procesar tu compra.",
                description: "No pudimos procesar tu compra. Por favor, inténtalo de nuevo más tarde.",
                duration: 6,
                pauseOnHover: false,
            });
            return false
        }
    };
    
    
    const substractStockInDb = async() => {
        const products = localStorage.getItem("current_cart")
        if(!products) return
        const parsedProducts = JSON.parse(products)
        
        try {
            const formData = new FormData()

            const processedProducts = parsedProducts.map(prod => {
                return {
                    id: prod.id,
                    quantity: prod.quantity
                }
            })
            formData.append("products", JSON.stringify(processedProducts))

            await fetch(`${apis.backend}/api/products/substract-stock`, {
                method: "POST",
                body: formData
            })

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const generatePdfReceipt = async () => {
        const currentCart = localStorage.getItem("current_cart");
        if (!currentCart) {
            return notification.error({
                message: "No pudimos generar el recibo",
                description: "No pudimos encontrar tu carrito de compras",
                duration: 3,
                showProgress: true,
                pauseOnHover: false
            });
        }
    
        const formData = new FormData();
        formData.append("cart_items", currentCart);
        
        if(loginData[0]?.is_verified) formData.append("client_info", JSON.stringify(loginData));
    
        try {
            const response = await fetch(`${apis.backend}/api/receipts/generate-receipt`, {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                let pdfBlob = await response.blob();
                if (pdfBlob.type !== "application/pdf") {
                    pdfBlob = new Blob([pdfBlob], { type: "application/pdf" });
                }
                const downloadUrl = URL.createObjectURL(pdfBlob);

                notification.info({
                    message: "Recibo generado con éxito",
                    description: "Deberás sacar captura del recibo, y volver a esta sección para ser dirigido al whatsapp de soporte para enviar dicho recibo",
                    duration: 4,
                    showProgress: true,
                    pauseOnHover: false
                });
    

                setTimeout(() => {
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = "recibo-de-compra.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(downloadUrl);
                    setShowWhatsapp(true)
                }, 4000);
    
                return true;

            } else {
                notification.error({
                    message: "No pudimos generar el recibo",
                    description: "Puedes volver a generarlo desde tu historial de compras",
                    duration: 3,
                    showProgress: true,
                    pauseOnHover: false
                });

                return false;
            }
        } catch (error) {
            console.error("Error al generar el archivo: ", error);
            notification.error({
                message: "No pudimos generar el recibo",
                description: error.message,
                duration: 3,
                showProgress: true,
                pauseOnHover: false
            });
            return false;
        }
    };

    const [processigPayment, setProcessigPayment] = useState(false)
    const handlePayment = async() => {
        setProcessigPayment(true)
        let result3;

        if(loginData[0]?.is_verified) await sendPurchaseConfirmation()

        await substractStockInDb()
        result3 = await generatePdfReceipt()

        localStorage.removeItem("current_cart");

        setCart([])
        setProcessigPayment(false)
        getProducts()
        navigate("/")

        if(result3){
            return true
        }else{
            return false
        }
    };

    return {
        handlePayment,
        processigPayment,
        generatePdfReceipt,
        showWhatsapp, 
        setShowWhatsapp
    }
}

export default usePayment
import { notification } from "antd";
import { apis } from "../../utils/apis";
import { useState } from "react";

import { useAppContext } from "../../AppContext";
import { processRequests } from "../../utils/processRequests";
import useCart from "../../utils/CartManager";

function usePayment() {
    const { setOpenCart, loginData } = useAppContext()
    const { setCart } = useCart()
    const [showWhatsapp, setShowWhatsapp] = useState(false)
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
                message: "No pudimos enviarte tu comprobante de compra",
                description:
                    "Pero no te preocupes, tu compra fue procesada correctamente y nos pondremos en contacto cuanto antes.",
                duration: 6,
                pauseOnHover: false,
            });
            return false
        }
    };
    
    
    const substractStockInDb = async(products) => {
        if(!products) return;
        const formData = new FormData()

        const processedProducts = products.map(prod => {
            return {
                id: prod.id,
                quantity: prod.quantity
            }
        })
        formData.append("products", JSON.stringify(processedProducts))


        try {
            const response = await fetch(`${apis.backend}/api/products/substract-stock`, {
                method: "POST",
                body: formData
            })

            if(response.ok) return true
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
        formData.append("client_info", JSON.stringify(loginData));
    
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
                }, 4500);
    
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
        const result1 = await sendPurchaseConfirmation()
        const result2 = await substractStockInDb()
        const result3 = await generatePdfReceipt()
        setProcessigPayment(false)


        if(result1 && result2 && result3){
            notification.success({
                message: "Compra realizada con exito",
                description: "Gracias por tu compra",
                duration: 3,
                pauseOnHover: false
            })
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
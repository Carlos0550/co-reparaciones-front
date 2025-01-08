import React, { useEffect, useState } from 'react'
import "./CartView.css"
import { useAppContext } from '../../../AppContext'
import { Button, notification, Space } from 'antd'
import { CreditCardOutlined, DeleteOutlined, MinusCircleOutlined, PlusOutlined, WhatsAppOutlined } from '@ant-design/icons'
import usePayment from '../../../Context_Folders/Payments/usePayment'
import useCart from "../../../utils/CartManager"
import { useNavigate } from 'react-router-dom'

function CartView() {
    const { subtitleColor, productsList, loginData,  } = useAppContext()
    const [totalCart, setTotalCart] = useState(0)
    
    const { updateQuantityCart, getCartItems, cart, setCart } = useCart()
    const { handlePayment, processigPayment, showWhatsapp, setShowWhatsapp } = usePayment()

    useEffect(() => {
        setCart(getCartItems())
    }, [])

    useEffect(() => {
        getSumTotal()
    }, [cart])

    const refreshCart = () => {
        const updatedCart = getCartItems()
        setCart(updatedCart)
        getSumTotal()
    }

    const getSumTotal = () => {
        const realCartProducts = productsList.filter(prod => 
            cart.some(item => item.id === prod.id && item.item_type === "product")
        );
        
        const realCartPromotions = cart.filter(item => 
            item.item_type === "promotion"
        );
        
        const productsTotal = realCartProducts.reduce((acc, item) => {
            const quantity = cart.find(cartItem => cartItem.id === item.id).quantity;
            return acc + (parseFloat(item.product_price) * parseInt(quantity));
        }, 0);
    
        const promotionsTotal = realCartPromotions.reduce((acc, item) => {
            const quantity = item.quantity;
            return acc + (parseFloat(item.price) * parseInt(quantity)); 
        }, 0);
    
        const sumTotal = productsTotal + promotionsTotal;
    
        setTotalCart(sumTotal);
    };
    

    const handleWhatsAppRedirect = () => {
        const whatsappNumber = '+5403764100978'; 
        const message = `Hola Cristian, recientemente te hice una compra, te comparto el recibo de compra.`;
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank'); 
        setShowWhatsapp(false)
      };

      const substractWords = (words, limit = 20) => {
        if (!words) return '';
        return words.length > limit ? words.slice(0, limit) + '..' : words;
    };
    return (
        <div className='cart-view-container'>
            <h1 style={{ color: subtitleColor || "#f0f0f0" }} className='cart-view-title'>Retoma desde donde lo dejaste</h1>

            <div className='cart-view'>
                {cart.map((product) => (
                    <div key={product.id} className='cart-item'>
                        <div className='cart-item-image'>
                            <img src={productsList.find(item => item.id === product.id)?.images[0]?.image_data || product.image} alt="" />
                        </div>
                        <div className='cart-item-info'>
                            <p className='cart-item-name'>{substractWords(productsList.find(item => item.id === product.id)?.product_name || product.name)}</p>
                            <p className='cart-item-quantity'>Cantidad: {product.quantity}</p>
                            <p className='cart-item-quantity'>{parseFloat(productsList.find(item => item.id === product.id)?.product_price || product.price).toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</p>
                        </div>
                        <Space>
                            <Button icon={<PlusOutlined />} type='primary' onClick={() => {
                                updateQuantityCart(product.id, "add")
                                refreshCart()
                            }} />
                            <Button icon={<MinusCircleOutlined />} type="text" onClick={() => {
                                updateQuantityCart(product.id, "remove")
                                refreshCart()
                            }} />
                            <Button icon={<DeleteOutlined />} type='primary' danger onClick={() => {
                                updateQuantityCart(product.id, "delete")
                                refreshCart()
                            }}/>
                        </Space>
                    </div>
                ))}

                {cart.length === 0 && (
                    <p>No hay productos en el carrito.</p>
                )}
            </div>

            <div className='cart-total-container'>
                <div className='cart-total'>
                    <p className='cart-total-label'>Total:</p>
                    <p className='cart-total-amount'>
                        {parseFloat(totalCart).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                    </p>
                    {!showWhatsapp ? <Button type="primary" className='finalize-purchase-button' disabled={cart.length === 0} loading={processigPayment} onClick={async()=>{
                        if(loginData?.admin) return notification.warning({
                            message: "No puedes realizar compras como administrador",
                            description: "Por favor, inicia sesión como cliente para poder realizar compras"
                        })                        
                        const resultPayment = await handlePayment()
                        if(resultPayment){
                            localStorage.removeItem("current_cart")
                            setCart([])
                        }
                    }}>
                    <CreditCardOutlined/> Finalizar compra
                    </Button>
                : <Button icon={<WhatsAppOutlined/>} onClick={()=> handleWhatsAppRedirect()}>Ir a Whatsapp</Button>    
                }
                </div>
                
            </div>

        </div>
    )
}

export default CartView

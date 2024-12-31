import React, { useEffect, useState } from 'react'
import "./CartView.css"
import { useAppContext } from '../../../AppContext'
import { Button, notification, Space } from 'antd'
import { CreditCardOutlined, DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import AdvertismentAccountModal from '../AdvertismentAccountModal/AdvertismentAccountModal'
import usePayment from '../../../Context_Folders/Payments/usePayment'
import useCart from "../../../utils/CartManager"

function CartView() {
    const { subtitleColor, productsList, loginData } = useAppContext()
    const [totalCart, setTotalCart] = useState(0)
    
    const { updateQuantityCart, getCartItems, cart, setCart } = useCart()
    const { handlePayment, processigPayment } = usePayment()

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
        const realCart = productsList.filter(prod => cart.some(item => item.id === prod.id))
        const sumTotal = realCart.reduce((acc, item) => {
            const quantity = cart.find(cartItem => cartItem.id === item.id).quantity;
            return acc + (parseFloat(item.product_price) * parseInt(quantity));
        }, 0);
        setTotalCart(sumTotal)
    }

    const [showAdvertisment, setShowAdvertisement] = useState(false)

    useEffect(()=>{
        if(loginData.length === 0) setShowAdvertisement(true)
    },[loginData])

    return (
        <div className='cart-view-container'>
            <h1 style={{ color: subtitleColor || "#f0f0f0" }} className='cart-view-title'>Retoma desde donde lo dejaste</h1>

            <div className='cart-view'>
                {cart.map((product) => (
                    <div key={product.id} className='cart-item'>
                        <div className='cart-item-image'>
                            <img src={productsList.find(item => item.id === product.id)?.images[0]?.image_data} alt="" />
                        </div>
                        <div className='cart-item-info'>
                            <p className='cart-item-name'>{productsList.find(item => item.id === product.id)?.name}</p>
                            <p className='cart-item-quantity'>Cantidad: {product.quantity}</p>
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
                    <Button type="primary" className='finalize-purchase-button' disabled={cart.length === 0} loading={processigPayment} onClick={()=>{
                        if(loginData[0]?.admin) return notification.warning({
                            message: "No puedes realizar compras como administrador",
                            description: "Por favor, inicia sesión como cliente para poder realizar compras"
                        })                        
                        handlePayment()
                    }}>
                    <CreditCardOutlined/> Finalizar compra
                </Button>
                </div>
                
            </div>

            {showAdvertisment && <AdvertismentAccountModal closeModal={()=>setShowAdvertisement(false)}/>}
        </div>
    )
}

export default CartView

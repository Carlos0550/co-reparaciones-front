import React, { useEffect, useState } from 'react'
import "./ProductDetailsView.css"
import { useAppContext } from '../../../AppContext'
import { useLocation } from 'react-router-dom'
import { ShoppingCartOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Space } from 'antd'
import useCart from '../../../utils/CartManager'
function ProductDetailsView() {
    const { productsList } = useAppContext()
    const product_id = useLocation().pathname.split("/")[2]
    const [selectedProduct, setSelectedProduct] = useState({})
    const [mainImage, setMainImage] = useState("")  

    const { InsertCart } = useCart()

    useEffect(() => {
        if (productsList && productsList.length > 0) {
            const product = productsList.find(product => product.id === product_id) || {}
            setSelectedProduct(product)
            setMainImage(product?.images[0]?.image_data)  
        }
    }, [product_id, productsList])

    const handleThumbnailClick = (imageData) => {
        setMainImage(imageData)
    }

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }, 100);
    }, [])

    const [selectedQuantity, setSelectedQuantity] = useState(1)

    const handleRedirectWhatsapp = (productName) => {
        const message = `
            Hola 👋, estoy interesado en ${productName}. Lo encontré a través de su página web y me gustaría comprarlo por aqui
            Espero su respuesta, ¡gracias! 😊
        `;
        const whatsappNumber = "3764100978"
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
    return (
        <React.Fragment>
            <div className='product-details-wrapper'>

                <div className='product-details'>
                    <div className='product-details-image'>
                        {mainImage && <img src={mainImage} alt="Imagen del producto" />}
                    </div>

                    <div className='product-details-thumbnails'>
                        {selectedProduct?.images?.map((image) => (
                            <img
                                key={image.image_name}
                                src={image.image_data}
                                alt={image.image_name}
                                onClick={() => handleThumbnailClick(image.image_data)}
                            />
                        ))}
                    </div>

                    <div className='product-details-description'>
                        <h1>{selectedProduct.product_name}</h1>
                        <p><strong>Precio:</strong> {parseFloat(selectedProduct.product_price).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
                        <p><strong>Stock disponible:</strong>
                        
                            {
                                selectedProduct.stock > 1 ? selectedProduct.stock :
                                selectedProduct.stock === 1 ? "Última unidad" : "Agotado"
                            }
                        </p>
                        <Space direction='vertical'>

                            <Button 
                            icon={<WhatsAppOutlined/>} 
                            style={{
                                backgroundColor: "#25D366",
                                color: "white"
                            }}
                            onClick={()=> handleRedirectWhatsapp(selectedProduct.product_name)}
                            >Comprar directamente</Button>
                            <Space>
                            <Button 
                            
                            disabled={selectedProduct.stock === 0}
                            onClick={() => {
                                InsertCart(selectedProduct.id, selectedQuantity)
                                setSelectedQuantity(1)
                                
                            }}>Añadir al <ShoppingCartOutlined /></Button>
                            <InputNumber min={1} max={selectedProduct.stock} value={selectedQuantity} onChange={(value) => setSelectedQuantity(value)} />

                            </Space>
                        </Space>
                        <p dangerouslySetInnerHTML={{ __html: selectedProduct?.product_description }}></p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ProductDetailsView

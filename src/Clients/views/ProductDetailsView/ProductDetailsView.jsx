import React, { useEffect, useState } from 'react'
import "./ProductDetailsView.css"
import { useAppContext } from '../../../AppContext'
import { useLocation } from 'react-router-dom'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber } from 'antd'
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
                        <Button 
                        disabled={selectedProduct.stock === 0}
                        onClick={() => {
                            InsertCart(selectedProduct.id, selectedQuantity)
                            setSelectedQuantity(1)
                            
                        }}>Añadir al <ShoppingCartOutlined /></Button>
                        <InputNumber min={1} max={selectedProduct.stock} value={selectedQuantity} onChange={(value) => setSelectedQuantity(value)} />
                        <p dangerouslySetInnerHTML={{ __html: selectedProduct?.product_description }}></p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ProductDetailsView

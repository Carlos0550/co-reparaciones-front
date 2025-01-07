import React, { memo, useState, useEffect } from 'react'
import { useAppContext } from '../../../AppContext'
import "./ProductsView.css"
import { Input, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
function ProductsView({products}) {
    const { titleColor, contentColor, categories } = useAppContext()

    const [searchText, setSearchText] = useState("")
    const [categoryId, setCategoryId] = useState(null)

    const filterProducts = () => {
        return products.filter((product) => {
            const matchesSearch = product.product_name.toLowerCase().includes(searchText.toLowerCase())
            const matchesCategory = categoryId ? product.product_category === categoryId : true
            return matchesSearch && matchesCategory
        })
    }

    const filteredProducts = filterProducts()
    const navigate = useNavigate()
    return (
        <React.Fragment>
            <h1 style={{ color: titleColor }} className='products-title'>Conocé todo nuestro catálogo</h1>
            <div className='products-filters' style={{ backgroundColor: contentColor || "#f0f0f0" }}>
                <Input.Search 
                    placeholder='Buscar un producto'
                    style={
                        { 
                        minWidth: "200px", 
                        maxWidth: "400px", 
                        width: "100%",
                        border: "1px solid black",
                            borderRadius: "6px",
                            color: "black"
                    }

                    }
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} // Actualiza el estado de búsqueda
                />
                <Select
                    style={
                        { 
                            minWidth: "200px", 
                            maxWidth: "400px", 
                            width: "100%",
                            border: "1px solid black",
                            borderRadius: "6px",
                            color: "black"
                        }
                    }
                    className='custom-select'
                    placeholder="Filtrar por categoría"
                    allowClear                 
                    value={categoryId}
                    onChange={(categoryId) => setCategoryId(categoryId)} // Actualiza el estado de la categoría
                >
                    {categories && categories.map((category) => (
                        <Select.Option value={category.id} key={category.id}>{category.category_name}</Select.Option>
                    ))}
                </Select>
            </div>
            <div className="products-wrapper">
                {filteredProducts && filteredProducts.map((product) => (
                    <div className="product-card" key={product.id} onClick={()=> navigate(`/product-details/${product.id}`)}>
                        <picture className='product-card-image'>
                            <img src={product.images[0]?.image_data} alt={product.image_name} />
                            <div className="product-card-content">
                                <p className='product-card-title'>{product.product_name}</p>
                                <p className='product-price'>
                                    {parseFloat(product.product_price).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                                </p>
                            </div>
                        </picture>
                    </div>
                ))}
            </div>

            
        </React.Fragment>
    )
}

export default memo(ProductsView)

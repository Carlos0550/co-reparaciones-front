import { Modal, Button } from 'antd'
import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons'
import "./PromotionDetailsModal.css"
import dayjs from 'dayjs'
import { useAppContext } from '../../../../AppContext'
function PromotionDetailsModal({ closeModal, promotion }) {
  const { productsList } = useAppContext()

  const parseCartItems = (cart) => {
    if(!cart) return []

    try {
      return JSON.parse(cart)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCalculatePromotionPrice = (promotionType) => {
    if(promotionType === "single"){
      
      const productPrice = productsList.find((product) => product.id === promotionItems[0].id)?.product_price;
      const promotionDiscount = parseFloat(productPrice) * (parseFloat(promotion.pomotion_discount) / 100);
      console.log("Tipo de promoción simple, total: ", promotionDiscount)
      return promotionDiscount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
    }else{
      const promotionItems = promotion.promotion_data.promotion_products_array
      const promotionDiscount = parseFloat(promotion.promotion_discount)
      const total = promotionItems.reduce((acc, item) => {
        const price = parseFloat(item.price) * parseInt(item.quantity);
        return acc += price
      },0)
      return total * (promotionDiscount / 100).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
    }
  }

  const handleAddCart = () => {
    const cart = localStorage.getItem("current_cart");
    const cartItems = parseCartItems(cart);
    if(cartItems.length > 0) {
      const promotionItem = {
        id: promotion.promotion_id,
        name: promotion.promotion_name,
        price: handleCalculatePromotionPrice(promotion.promotion_type),
        image: promotion.images[0].image,
        quantity: 1,
        item_type: "promotion"
      }

      const updatedCart = [...cartItems, promotionItem];
      localStorage.setItem("current_cart", JSON.stringify(updatedCart));
      console.log("Carrito actualizado:", updatedCart)
    }
  }
  const textMinifier = (html, limit = 420) => {
    if (!html) return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let charCount = 0;

    const truncateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (charCount + node.textContent.length > limit) {
          node.textContent = node.textContent.slice(0, limit - charCount) + ' ...';
          charCount = limit;
        } else {
          charCount += node.textContent.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let child of Array.from(node.childNodes)) {
          if (charCount < limit) {
            truncateNode(child);
          } else {
            node.removeChild(child);
          }
        }
      }
    };

    truncateNode(doc.body);
    console.log(doc.body.innerHTML)
    return doc.body.innerHTML;
  };
  return (
    <Modal
      open={true}
      onCancel={closeModal}
      footer={null}
      width={1200}
    >
      
       <div className="promotion-container">
        <picture className='promotion-img'>
          <img src={promotion.images[0].image} />
        </picture>

        <div className="promotion-info">
          <h3 className='promotion-name'>{promotion.promotion_name}</h3>
          <p className='promotion-endate'>
            Oferta válida hasta el {dayjs(promotion.promotion_ends).format('DD/MM/YYYY')} 
            ({dayjs(promotion.promotion_ends).diff(dayjs(), 'days')} días restantes)
          </p>


          <div 
            dangerouslySetInnerHTML={{__html: textMinifier(promotion.promotion_data.promotion_description)
            }}
            className='promotion-description'
          />
          
          <div className="promotion-buttons">
            <button className='promotion-btn-details' disabled style={{cursor: "not-allowed", backgroundColor: "gray"}}>Más detalles</button>
            <button className='promotion-btn-add-cart' onClick={handleAddCart} disabled style={{cursor: "not-allowed", backgroundColor: "gray"}}>Añadir al carrito</button>
          </div>
        </div>
       </div>
    </Modal>
  )
}

export default PromotionDetailsModal

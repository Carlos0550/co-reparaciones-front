import { Modal, Button, message } from 'antd'
import React from 'react'
import { InfoCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons'
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

  const handleCalculatePromotionPrice = () => {
    const promotionType = promotion.promotion_type;
    if(promotionType === "single"){
      
      const productPrice = productsList.find((product) => product.id === promotion.promotion_data.product_id)?.product_price;
      const promotionDiscount = productPrice * (parseInt(promotion.promotion_discount) / 100);

      const finalPrice = productPrice - promotionDiscount
      return parseFloat(finalPrice)
    }else{
      const promotionItems = promotion.promotion_data.promotion_products_array;
      const promotionDiscount = parseFloat(promotion.promotion_discount);

      const total = promotionItems.reduce((acc, item) => {
        const price = parseFloat(item.price) * parseInt(item.quantity);
        return acc += price;
      }, 0);

      const discountAmount = total * (promotionDiscount / 100);

      const finalPrice = total - discountAmount;

      return parseFloat(finalPrice)

    }
  }

  const handleAddCart = () => {
    const cart = localStorage.getItem("current_cart");
    const cartItems = parseCartItems(cart);
    if(cartItems.length > 0) {
      const promotionItem = {
        id: promotion.promotion_id,
        name: promotion.promotion_name,
        price: handleCalculatePromotionPrice(),
        image: promotion.images[0].image,
        quantity: 1,
        item_type: "promotion"
      }

      const updatedCart = [...cartItems, promotionItem];
      localStorage.setItem("current_cart", JSON.stringify(updatedCart));
      console.log("Carrito actualizado: ", updatedCart)
      message.success("Promoción agregada al carrito");
    }else{
      const promotionItem = {
        id: promotion.promotion_id,
        name: promotion.promotion_name,
        price: handleCalculatePromotionPrice(),
        image: promotion.images[0].image,
        quantity: 1,
        item_type: "promotion"
      }
      const updatedCart = [promotionItem];
      localStorage.setItem("current_cart", JSON.stringify(updatedCart));
      console.log("Carrito actualizado: ", updatedCart)
      message.success("Promoción agregada al carrito");
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
    return doc.body.innerHTML;
  };

  const handleGetPromotionPrices = () => {
    const promotionType = promotion.promotion_type;
    if(promotionType === "single"){
      const productPrice = productsList.find((product) => product.id === promotion.promotion_data.product_id)?.product_price;
      return parseFloat(productPrice)
    }else{
      const promotionItems = promotion.promotion_data.promotion_products_array;
      const total = promotionItems.reduce((acc, item) => {
        const price = parseFloat(item.price) * parseInt(item.quantity);
        return acc + price;
      }, 0);
      return parseFloat(total)
    }
  }

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

          <div className='promotion-prices'>
            <p className='promotion-old-price'>{handleGetPromotionPrices().toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
            <p className='promotion-new-price'>{handleCalculatePromotionPrice().toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
            <p className='promotion-discount-modal'>-{promotion.promotion_discount}% off</p>
          </div>

          <div 
            dangerouslySetInnerHTML={{__html: textMinifier(promotion.promotion_data.promotion_description)
            }}
            className='promotion-description'
            style={{
              minHeight: promotion.promotion_type === "multiple" ? "auto" : "calc(100vh - 850px)"
            }}
          />

          {promotion.promotion_type === "multiple" ? (
            <div className='promotion-items'>
              <h3>Productos en la promoción</h3>
              {promotion.promotion_data.promotion_products_array.map((item, index) => (
                  <div key={index}>
                    <p className='promotion-item-name'>{item.quantity} {item.name} {parseFloat(item.price).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
                  </div>
              ))}
            </div>
          )
          : (
            <div className='promotion-items'>
              <h3>Producto de la promoción</h3>
              <p className='promotion-item-name'>x1 {" "}
                {
                  productsList.find((product) => product.id === promotion.promotion_data.product_id)?.product_name || ''
                }
              </p>
            </div>
          )
        }
          
          <div className="promotion-buttons">
              <button className='promotion-btn-add-cart' 
              onClick={()=> handleAddCart()} >
              <ShoppingCartOutlined/> Añadir al carrito
              </button>
          </div>
        </div>
       </div>
    </Modal>
  )
}

export default PromotionDetailsModal

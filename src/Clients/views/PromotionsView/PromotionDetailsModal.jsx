import { Modal, Button } from 'antd'
import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons'
import "./PromotionDetails.css"
import dayjs from 'dayjs'
function PromotionDetailsModal({ closeModal, promotion, addToCart }) {
  console.log(promotion)
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
            <button className='promotion-btn-add-cart' disabled style={{cursor: "not-allowed", backgroundColor: "gray"}}>Añadir al carrito</button>
          </div>
        </div>
       </div>
    </Modal>
  )
}

export default PromotionDetailsModal

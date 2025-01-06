import React, { useState, useEffect, useRef } from 'react';
import './PromotionsView.css';
import { useAppContext } from '../../../AppContext';
import PromotionDetailsModal from './Modals/PromotionDetailsModal';
import { v4 } from 'uuid';

function PromotionsView() {
    const { promotions, productsList } = useAppContext();
    const titles = [
        "¡Encuentra el precio perfecto aquí!",
        "Promociones que te harán sonreír",
        "Ofertas irresistibles, ¡solo para ti!",
        "¡Descuentos que no querrás perder!",
        "Tu oportunidad de ahorrar está aquí",
    ];
    const randomTitles = titles[Math.floor(Math.random() * titles.length)];

    function getPromotionPrice(promotion_data, promotion_type, promotion_discount = 0) {
        if (promotion_type === 'multiple') {
            const products = promotion_data.promotion_products_array;
            if (!products || products.length === 0) return 'Precio no disponible';
            const total = products.reduce((acc, item) => {
                const price = parseFloat(item.price) * parseInt(item.quantity);
                return acc + price - price * (promotion_discount / 100);
            }, 0);
            return total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        } else {
            const product_id = promotion_data.product_id;
            const productPrice = productsList.find((product) => product.id === product_id)?.product_price;
            const promotionDiscount = parseFloat(productPrice) * (promotion_discount / 100);
            return parseFloat(productPrice - promotionDiscount).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        }
    }

    const substractWords = (words, limit = 30) => {
        if (!words) return '';
        return words.length > limit ? words.slice(0, limit) + '..' : words;
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const promotionsRef = useRef(null);

    const showModal = (promotion) => {
        setSelectedPromotion(promotion);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPromotion(null);
    };

    const activePromotions = promotions.filter(prom => prom.promotion_state === true);
    const [pauseCarrousel, setPauseCarrousel] = useState(false);

    function activateCarrousel() {
        const container = promotionsRef.current;
            if (container) {
                const containerWidth = container.offsetWidth;
                const scrollLeft = container.scrollLeft;
                const cardWidth = container.querySelector('.promotion-card')?.offsetWidth || 0;

                if (scrollLeft + containerWidth >= container.scrollWidth) {
                    container.scrollTo({
                        left: 0,
                        behavior: 'smooth',
                    });
                } else {
                    container.scrollBy({
                        left: cardWidth,
                        behavior: 'smooth',
                    });
                }
            }
    }

    useEffect(() => {
        const container = promotionsRef.current;
        const shouldCarouselRun = () => {
            if (container) {
                const containerWidth = container.offsetWidth;
                const contentWidth = container.scrollWidth;
                return contentWidth > containerWidth;
            }
            return false;
        };
    
        const interval = setInterval(() => {
            if (!pauseCarrousel && shouldCarouselRun()) {
                activateCarrousel();
            }
        }, 3000);
    
        return () => clearInterval(interval);
    }, [pauseCarrousel, promotions]);
    
    


    return (
        <React.Fragment>
            <h1 className="promotions-title">{randomTitles}</h1>
            <div className="promotions-container" ref={promotionsRef} onMouseEnter={() => setPauseCarrousel(true)} onMouseLeave={() => setPauseCarrousel(false)}>
                {activePromotions.map((promotion) => (
                    <div key={`${promotion.promotion_id}-${v4()}`} className="promotion-card" onClick={() => showModal(promotion)}>
                        <picture className="promotion-image">
                            <img
                                src={promotion.images?.[0]?.image || '/path/to/placeholder.jpg'}
                                alt={promotion.promotion_name}
                            />
                        </picture>
                        <div className="promotion-info">
                            <p className="promotion-name">{substractWords(promotion.promotion_name)}</p>
                            <p className="promotion-price">
                                {getPromotionPrice(promotion.promotion_data, promotion.promotion_type, promotion.promotion_discount)}
                            </p>
                            {promotion.promotion_discount > 0 && (
                                <div className="discount-container">
                                    <s className="promotion-price-old">
                                        {getPromotionPrice(promotion.promotion_data, promotion.promotion_type, 0)}
                                    </s>
                                    <p className="promotion-discount">{promotion.promotion_discount}%</p>
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            {isModalVisible && (
                <PromotionDetailsModal
                    closeModal={handleCloseModal}
                    promotion={selectedPromotion}
                />
            )}
        </React.Fragment>
    );
}

export default PromotionsView;

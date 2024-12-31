import React, { useState } from 'react';
import './PromotionsView.css';
import { useAppContext } from '../../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import PromotionDetailsModal from './PromotionDetailsModal';
import { v4 } from 'uuid';

function PromotionsView() {
    const { promotions, productsList, width } = useAppContext();
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

    const showModal = (promotion) => {
        setSelectedPromotion(promotion);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedPromotion(null);
    };

    const activePromotions = promotions.filter(prom => prom.promotion_state === true);

    const slides = activePromotions.length <= 4
        ? [...activePromotions, ...activePromotions]
        : activePromotions;
        
    return (
        <React.Fragment>
            {promotions.length > 3 ? (
                null
            ) : (
                <>
                    <h1 className="promotions-title">{randomTitles}</h1>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        loop
                        spaceBetween={10} // Asegura un espacio consistente
                        slidesPerGroup={width < 768 ? 1 : 2} // Controla cuántas tarjetas avanzan
                        centeredSlides={false} // Alinea las tarjetas al inicio del carrusel
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 }, // Móvil pequeño
                            480: { slidesPerView: 1.5, spaceBetween: 10 }, // Pantallas medianas
                            768: { slidesPerView: 2, spaceBetween: 15 }, // Tablets
                            1024: { slidesPerView: 3, spaceBetween: 20 }, // Escritorio
                        }}
                        className="promotions-swiper"
                    >
                        {slides.map((promotion) => (
                            <SwiperSlide key={`${promotion.promotion_id}- ${v4()}`} className='swiper-slide'>
                                <div className="promotion-card" onClick={() => showModal(promotion)}>
                                    <picture className="promotion-image">
                                        <img
                                            src={promotion.images?.[0]?.image || '/path/to/placeholder.jpg'}
                                            alt={promotion.promotion_name}
                                        />
                                    </picture>
                                    <div className="promotion-info">
                                        <p>{substractWords(promotion.promotion_name)}</p>
                                        <p>{getPromotionPrice(promotion.promotion_data, promotion.promotion_type, promotion.promotion_discount)}</p>
                                        {promotion.promotion_discount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                <s>{getPromotionPrice(promotion.promotion_data, promotion.promotion_type, 0)}</s>
                                                <p>{promotion.promotion_discount}%</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}

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

import React, { memo, useEffect, useState } from 'react';
import "./BannersView.css";
import { useAppContext } from '../../../AppContext';
import { v4 as uuidv4 } from 'uuid';

const BannersView = () => {
  const { banners } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = banners?.flatMap(banner => banner?.images) || [];

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [images]);

  return (
    <React.Fragment>
      <div className='slider'>
        <div 
          className='slider-images' 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map(image => (
            <img key={uuidv4()} src={image?.image_data} alt="" className='banner-image' />
          ))}
        </div>
      </div>
    </React.Fragment>    
  );
}

export default memo(BannersView);

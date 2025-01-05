import React from 'react'
import "./NotFound.css"
import ImgNotFound from "./acUdsIBTTJicTRaX_A5l7Q.webp"
import { useNavigate } from 'react-router-dom'
function NotFound() {
    const navigate = useNavigate()

    const handleRedirect = () => {
        navigate("/")
    }
  return (
    <React.Fragment>
        <div className='not-found'>
            <picture className='not-found__img'>
                <img src={ImgNotFound} />
            </picture>
            <div className="not-found__info">
            <h1>404</h1>
            <p>Página no encontrada</p>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <button className='not-found__btn' onClick={()=> handleRedirect()}>Volver al inicio</button>
            </div>
        </div>
    </React.Fragment>
  )
}

export default NotFound
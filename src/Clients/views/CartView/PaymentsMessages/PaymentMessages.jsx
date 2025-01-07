import React, { useEffect, useRef, useState } from 'react';
import { Result, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../AppContext';

function PaymentMessages() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState()
  const { sendPurchaseConfirmation } = useAppContext()
  const handleBack = () => {
    navigate("/");
  };

  const handleSendPurchaseConfirmation = async() => {
    const hiddenMessage = message.loading("Un momento...",0)
    await sendPurchaseConfirmation()
    hiddenMessage()
  }

  const alreadyVerified = useRef(false)
  useEffect(() => {
    const getResultStatus = () => {
      if (location.pathname.includes('success')) {
        //handleSendPurchaseConfirmation()
        return {
          status: 'success',
          title: '¡Pago Exitoso!',
          subTitle: 'Tu pago se ha realizado correctamente. Te hemos enviado un correo de confirmación y pronto nos pondremos en contacto contigo para confirmar tu compra.'
        };
      } else if (location.pathname.includes('pending')) {
        return {
          status: 'info',
          title: 'Pago Pendiente',
          subTitle: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.'
        };
      } else if (location.pathname.includes('failure')) {
        return {
          status: 'error',
          title: 'Error en el Pago',
          subTitle: 'Hubo un error al procesar tu pago. Por favor, intenta nuevamente.'
        };
      } else {
        return {
          status: 'warning',
          title: 'Estado Desconocido',
          subTitle: 'Hubo un problema al intentar obtener el estado de tu pago.'
        };
      }
    };

    if(!alreadyVerified.current){
      setResult(getResultStatus())
      alreadyVerified.current = true
    }
  }, [location.pathname]);

  return (
    <React.Fragment>
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Result
          status={result?.status}
          title={result?.title}
          subTitle={result?.subTitle}
          extra={[
            <Button type="primary" key="console" onClick={handleBack}>
              Volver al inicio
            </Button>,
          ]}
        />
      </div>
    </React.Fragment>
  );
}

export default PaymentMessages;

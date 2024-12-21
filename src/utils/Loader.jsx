import React from 'react';
import loaderSpinner from "../../public/90-ring-with-bg.svg"
const Loader = () => {
    return (
        <div 
            style={{
                minWidth: "100vw", 
                minHeight: "100vh", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                backgroundColor: "#f0f0f0", 
                position: "fixed",
                zIndex: 999
            }}
        >
            <img src={loaderSpinner} alt="Cargando..." width={54} />
        </div>
    );
};

export default Loader;

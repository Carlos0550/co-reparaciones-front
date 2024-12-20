import React from 'react';
import loaderSpinner from "../../public/road_24dp_EFEFEF_FILL0_wght400_GRAD0_opsz24.svg"
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
                
            }}
        >
            <img src={loaderSpinner} alt="Cargando..." width={34} />
        </div>
    );
};

export default Loader;

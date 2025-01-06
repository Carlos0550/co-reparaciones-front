import { message } from "antd"
import { useAppContext } from "../AppContext";
import { useState } from "react";

function useCart() {
    const { productsList } = useAppContext()
    const [cart, setCart] = useState([])
    const InsertCart = (productID, productQuantity) => {
        if (!productID || productQuantity <= 0) return;
    
        const current_cart = localStorage.getItem("current_cart");
        const product = productsList.find(product => product.id === productID);
        const productName = product.product_name;
        const price = product.product_price;
    
        if (current_cart) {
            const cart = JSON.parse(current_cart);
        
            const existentProduct = cart.find(product => product.id === productID);
    
            if (existentProduct) {
                existentProduct.quantity += productQuantity; 
                localStorage.setItem("current_cart", JSON.stringify(cart));
                message.success(`Se actualizó la cantidad de ${existentProduct.quantity} ${productName}(s) en el carrito`);
            } else {
                cart.push(
                    { 
                        id: productID, 
                        quantity: productQuantity, 
                        product_name: productName, 
                        product_price: price,
                        item_type: "product"
                    }
                );
                localStorage.setItem("current_cart", JSON.stringify(cart));
                message.success(`Se agregó ${productQuantity} ${productName}(s) al carrito`);
            }
            getCartItems()
        } else {
            const newCart = [
                { 
                    id: productID, 
                    quantity: productQuantity, 
                    product_name: productName, 
                    product_price: price,
                    item_type: "product"   
                }
            ];
            localStorage.setItem("current_cart", JSON.stringify(newCart));
            message.success(`Se agregó un nuevo producto al carrito: ${productName}`);
            getCartItems()
        }
    };
    
    
    const getCartItems = () => {
        const current_cart = localStorage.getItem("current_cart")
        if(!current_cart) return []
        return JSON.parse(current_cart)
    }
    
    const updateQuantityCart = (productID, actionType) => {
        const current_cart = localStorage.getItem("current_cart");
        if (current_cart) {
            const cart = JSON.parse(current_cart);
            const existentProduct = cart.find(product => product.id === productID);
            if (existentProduct) {
                if(actionType === "delete") {
                    const newCart = cart.filter(product => product.id !== productID);
                    localStorage.setItem("current_cart", JSON.stringify(newCart));
                    return
                }
    
                if (existentProduct.quantity === 1 && actionType === "remove") {
                    const newCart = cart.filter(product => product.id !== productID);
                    localStorage.setItem("current_cart", JSON.stringify(newCart));
                    return;
                }
    
                if(actionType === "add") existentProduct.quantity += 1;
                else existentProduct.quantity -= 1;
                localStorage.setItem("current_cart", JSON.stringify(cart));
            }
        }
    }

    return {

        InsertCart,
        getCartItems,
        updateQuantityCart,
        cart, 
        setCart
    }
}

export default useCart
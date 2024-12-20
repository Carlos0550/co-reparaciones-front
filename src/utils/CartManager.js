import { message } from "antd"

export const InsertCart = (productID, productQuantity, productName) => {
    if (!productID || productQuantity <= 0) return;

    const current_cart = localStorage.getItem("current_cart");
    console.log(current_cart);

    if (current_cart) {
        const cart = JSON.parse(current_cart);
        const existentProduct = cart.find(product => product.id === productID);

        if (existentProduct) {
            existentProduct.quantity += productQuantity; 
            localStorage.setItem("current_cart", JSON.stringify(cart));
            message.success(`Se actualizó la cantidad de ${existentProduct.quantity} ${productName}(s) en el carrito`);
        } else {
            cart.push({ id: productID, quantity: productQuantity, product_name: productName });
            localStorage.setItem("current_cart", JSON.stringify(cart));
            message.success(`Se agregó ${productQuantity} ${productName}(s) al carrito`);
        }
        getCartItems()
    } else {
        const newCart = [{ id: productID, quantity: productQuantity, product_name: productName }];
        localStorage.setItem("current_cart", JSON.stringify(newCart));
        message.success(`Se agregó un nuevo producto al carrito: ${productName}`);
        getCartItems()
    }
};


export const getCartItems = () => {
    const current_cart = localStorage.getItem("current_cart")
    if(!current_cart) return []
    return JSON.parse(current_cart)
}

export const updateQuantityCart = (productID, actionType) => {
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
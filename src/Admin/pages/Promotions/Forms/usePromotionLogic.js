import { useEffect, useState } from "react";
import { message } from "antd";
import { resizeAndConvertImages } from "../../../../utils/ResizeImages";
import dayjs from "dayjs"
export const usePromotionLogic = (form, savePromotion, editPromotion, isEditing, promotionEditId, promotions,handlePromotions) => {
    const [editorState, setEditorState] = useState("");
    const [fileList, setFileList] = useState([]);
    const [products, setProducts] = useState([]);
    const [simpleProduct, setSimpleProduct] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);
    const [isMultiple, setIsMultiple] = useState(false);

    useEffect(()=>{
        if(isEditing && promotionEditId){
            const oldPromotion = promotions.find(promotion => promotion.promotion_id === promotionEditId)
            form.setFieldsValue({
                promotion_name: oldPromotion.promotion_name,
                promotion_discount: oldPromotion.promotion_discount,
                promotion_description: oldPromotion.promotion_data.promotion_description,
                promotion_type: oldPromotion.promotion_type
            })

            setEditorState(oldPromotion.promotion_data.promotion_description)

            const newFileList = oldPromotion.images.map((image) => ({
                uid: image.image_name,
                name: image.image_name,
                originFileObj: image.image,
                editing: true,
                thumbUrl: image.image
            }))
            setFileList(newFileList)

            if(oldPromotion.promotion_type === "multiple"){
                setIsMultiple(true)
                setProducts(oldPromotion.promotion_data.promotion_products_array)
                const processedProducts = oldPromotion.promotion_data.promotion_products_array.map(product => {
                    return `${product.name} ${product.quantity} ${product.price}`;
                }).join("\n");

                form.setFieldsValue({
                    promotion_products: processedProducts
                })
            }else{
                setSimpleProduct(oldPromotion.promotion_data.product_id)
                form.setFieldsValue({
                    promotion_product: oldPromotion.promotion_data.product_id
                })
            }
        }
    },[isEditing, promotionEditId])
    const handleFormSubmit = async (values) => {
 
        
        const formData = new FormData();
        const promotionStarts = values.promotion_dates[0]
        const promotionEnds = values.promotion_dates[1]

        const imagesWithEdit = fileList.map((file) => ({
            image_name: file.name,
            editing: file.editing || false
        }))

        formData.append("promotion_name", values.promotion_name);
        formData.append("promotion_discount", values.promotion_discount);
        
        formData.append("promotion_start_date", promotionStarts);
        formData.append("promotion_end_date", promotionEnds);

        formData.append("promotion_description", editorState);

        formData.append("imagesWithEdit", JSON.stringify(imagesWithEdit));

        fileList.forEach((file) => {
            formData.append("promotion_images", file.originFileObj)
        })

        formData.append("promotion_type", isMultiple ? "multiple" : "single");

        if (!values.promotion_products) {
            formData.append("product_id", simpleProduct);
        } else {
            formData.append("promotion_products", JSON.stringify(products));
        }   
    
        const promotionValue = products.reduce((acc,item) => {
        return acc += parseFloat(item.price) * parseInt(item.quantity) 
        },0)

        isMultiple && formData.append("promotion_value", promotionValue)
        const today = dayjs().format("YYYY-MM-DD");
        const promStart = dayjs(promotionStarts, "DD-MM-YYYY")
        formData.append("promotion_state", dayjs(promStart).isSame(today, "day") ? true : false);


        const result = isEditing
            ? await editPromotion(formData)
            : await savePromotion(formData);

        if(result){
            form.resetFields();
            setEditorState("");
            setFileList([]);
            setProducts([]);
            setIsMultiple(false);
            setSimpleProduct(null);
        }
    };

    const handleDeleteImage = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
    };

    const handleCancelEdit = () => {
        form.resetFields();
        setEditorState("");
        setFileList([]);
        setProducts([]);
        setSimpleProduct(null);
        handlePromotions()
        message.info("Edición cancelada.");
    };

    const beforeUpload = async (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Solo se permiten archivos de imagen");
            return;
        }

        const [processedImage] = await resizeAndConvertImages([file]);
        setFileList((prev) => [
            ...prev,
            {
                uid: processedImage.uid,
                name: processedImage.name,
                originFileObj: processedImage,
                thumbUrl: URL.createObjectURL(processedImage),
                editing: false,
            },
        ]);
        return false;
    };

    const addProductToPromotion = (productId) => {
        setSimpleProduct(productId);
    };

    const processMultipleProducts = (input) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        const newTimeoutId = setTimeout(() => {
            const lines = input.split("\n").filter(Boolean);
            const productsArray = [];

            for (let line of lines) {
                const parts = line.trim().split(/\s+/); 

                if (parts.length < 3) {
                    message.error(`La línea "${line}" no tiene el formato correcto. Debe ser "cantidad nombre precio".`);
                    return;
                }

                const quantity = parts[0]; 
                const price = parts[parts.length - 1]; 
                const name = parts.slice(1, parts.length - 1).join(" "); 

                if (isNaN(quantity) || isNaN(price)) {
                    message.error(`La cantidad o el precio en la línea "${line}" no son números válidos.`);
                    return;
                }

                const parsedQuantity = parseInt(quantity);
                const parsedPrice = parseFloat(price);

                if (parsedQuantity <= 0 || parsedPrice <= 0) {
                    message.error(`La línea "${line}" tiene valores inválidos. La cantidad y el precio deben ser mayores que cero.`);
                    return;
                }

                productsArray.push({
                    quantity: parsedQuantity,
                    name,
                    price: parsedPrice,
                });
            }

            setProducts(productsArray);
        }, 800);

        setTimeoutId(newTimeoutId)
    };
    
    const handleSwitchChange = (checked) => {
        setIsMultiple(checked);
        form.resetFields(["promotion_products"]); 
        setProducts([]); 
      };

    return {
        handleFormSubmit,
        handleCancelEdit,
        editorState,
        setEditorState,
        fileList,
        beforeUpload,
        products,
        addProductToPromotion,
        processMultipleProducts,
        simpleProduct,
        handleDeleteImage,
        isMultiple, setIsMultiple,
        handleSwitchChange
    };
};

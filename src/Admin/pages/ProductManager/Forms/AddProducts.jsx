import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, message, Button, Space, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../AppContext';
import { v4 as uuidv4 } from 'uuid';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';
import "react-quill/dist/quill.snow.css";

import ReactQuill from "react-quill"

function AddProducts() {
    const [form] = Form.useForm();
    const { categories, saveProduct, getProducts, editingProduct,
        productId, handleProducts, productsList, editProducts, getCategories

    } = useAppContext();

    const [fileList, setFileList] = useState([]);
    const [editorState, setEditorState] = useState("");

    const onEditorStateChange = (newState) => {
        setEditorState(newState);
    };

    const handleDeleteImage = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
    }

    const beforeUpload = async (file) => {
        const isImage = file.type.startsWith("image/")
        if (!isImage) {
            form.setFields([
                {
                    name: "product_images",
                    errors: ["Solo se permiten archivos de imagen"]
                }
            ]);
            return Upload.LIST_IGNORE
        } else {
            const [processedImages] = await resizeAndConvertImages([file])

            const newFileList = {
                uid: processedImages.uid,
                name: processedImages.name,
                originFileObj: processedImages,
                editing: false,
                thumbUrl: URL.createObjectURL(processedImages)
            }
            setFileList((prevList) => [...prevList, newFileList]);
        }
        return false
    }

    const [saving, setSaving] = useState(false);
    const onFinish = async (values) => {
        setSaving(true)
        console.log("Valores del formulario: ",values)
        console.log("Descripciones: ", editorState)

        const formData = new FormData();
        for (const key in values) {
            if (key !== "product_images" && key !== "product_description") {
                formData.append(key, values[key] || "");
            }
        }
        formData.append('product_description', editorState);

        const imagesWithEdit = fileList.map((file) => ({
            image_name: file.name,
            editing: file.editing || false
        }))


        fileList.forEach((file) => {
            if (!file.editing) {
                formData.append("images", file.originFileObj);
            }
        })

        formData.append("imagesWithEdit", JSON.stringify(imagesWithEdit));

        const result = editingProduct
            ? await editProducts(formData, productId)
            : await saveProduct(formData)

        if (result) {
            message.success(editingProduct
                ? 'Producto editado con éxito'
                : 'Producto registrado con éxito'
            );

            form.resetFields()
            setFileList([])
            setEditorState("")
            message.loading('Actualizando lista de productos...')
            await getProducts()
            handleProducts()
        }
        setSaving(false)
    };

    useEffect(() => {
        if (editingProduct && productId) {
            const selectedProduct = productsList.find(product => product.id === productId)
            form.setFieldsValue({
                product_name: selectedProduct.product_name,
                product_category: selectedProduct.product_category,
                product_price: selectedProduct.product_price,
                product_description: selectedProduct.product_description,
                product_stock: selectedProduct.stock,

            })
        
            setEditorState(selectedProduct.product_description)

            const formattedImages = selectedProduct.images.map((image) => ({
                uid: uuidv4(),
                name: image.image_name,
                status: 'done',
                editing: true,
                originFileObj: new File([image.image_data], image.image_name, { type: image.image_type }),
                thumbUrl: image.image_data
            }))

            setFileList(formattedImages)
            form.setFieldsValue({
                product_images: formattedImages
            })
        } else {
            form.resetFields()
            setFileList([])
            setEditorState("")

        }
    }, [editingProduct, productId])

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            autoComplete="off"
            style={{ width: "100%" }}
        >
            <Form.Item
                name="product_name"
                label="Nombre del producto"
                rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
            >
                <Input placeholder='Ingrese el nombre del producto' />
            </Form.Item>

            <Space wrap align='center'>
                <Form.Item
                    name="product_price"
                    label="Precio"
                    rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
                >
                    <Input placeholder='Ingrese el precio' />
                </Form.Item>

                <Form.Item
                    name={"product_stock"}
                    label="Stock disponible"
                    rules={
                        [
                            { required: true, message: 'Por favor ingrese el stock disponible' },
                            {
                                validator: (_, value) => {
                                    if (!/^(0|[1-9]\d*)$/.test(value)) return Promise.reject(new Error('El stock disponible no puede ser negativo ni incluir letras.'))

                                    return Promise.resolve()
                                }
                            }
                        ]
                    }
                >
                    <Input placeholder='Ingrese el stock disponible' />
                </Form.Item>
                <Button onClick={async () => {
                    const hiddenMessage = message.loading('Actualizando categorías...')
                    await getCategories()
                    hiddenMessage()
                }}>Re obtener categorías</Button>
                <Form.Item
                    name="product_category"
                    label="Categoría"
                    rules={[{ required: true, message: 'Por favor seleccione la categoría' }]}
                >
                    {categories.length > 0 ? (
                        <Select placeholder="Seleccione una categoría">
                            {categories.map((category) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.category_name}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        <p>No hay categorías disponibles.</p>
                    )}
                </Form.Item>
            </Space>
            
            <p>Ingresa una descripción</p>
            <div onTouchStart={(e)=> e.stopPropagation()}>
            
            <Form.Item>
                <ReactQuill
                    value={editorState}
                    onChange={onEditorStateChange}
                    theme='snow'
                    placeholder='Ingrese una descripción'
                />
            </Form.Item>

            </div>
            <Form.Item
                name="product_images"
                label="Imágenes"
                rules={[{ required: true, message: 'Por favor suba al menos una imagen' }]}
                valuePropName="fileList"

                getValueFromEvent={(e) => e && e.fileList}
            >
                <Upload
                    accept='image/jpeg, image/png'
                    listType='picture-card'
                    fileList={fileList}
                    onRemove={handleDeleteImage}
                    beforeUpload={beforeUpload}
                    multiple
                >
                    {fileList.length < 4 && <Button icon={<PlusOutlined />} />}
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={saving}>
                    Guardar Producto
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AddProducts;

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, message, Button, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../AppContext';
import { v4 as uuidv4 } from 'uuid';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';

import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Dragger } = Upload;

function AddProducts() {
    const [form] = Form.useForm();
    const { categories, saveProduct, getProducts, editingProduct, 
        productId, handleProducts, productsList, editProducts

    } = useAppContext();

    const [fileList, setFileList] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (newState) => {
        setEditorState(newState);
        const rawContext = convertToRaw(newState.getCurrentContent());
        const plainText = rawContext.blocks.map(block => block.text).join('\n');
        form.setFieldsValue({
            product_description: plainText,
        });
    };
    const [uploadProps, setUploadProps] = useState({name: 'file',
        multiple: true,
        beforeUpload: async (file) => {
            try {
                const [compressedFile] = await resizeAndConvertImages([file]);

                const newFileList = {
                    uid: uuidv4(),
                    name: compressedFile.name,
                    status: 'success',
                    originFileObj: compressedFile,
                    editing: false,
                    thumbUrl: URL.createObjectURL(compressedFile),
                };

                setFileList((prevList) => [...prevList, newFileList]);
            } catch (error) {
                message.error('Error al redimensionar la imagen');
                console.error('Error al redimensionar la imagen:', error);
            }

            return false; 
        },
        fileList,
        onRemove: (file) => {
            setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
        },});
    
        useEffect(()=>{
            setUploadProps((prevProps) => ({
                ...prevProps,
                fileList, 
            }));
        },[fileList])
    const [saving, setSaving] = useState(false);
    const onFinish = async (values) => {
        setSaving(true)
        const htmlDescription = stateToHTML(editorState.getCurrentContent());
        const formData = new FormData();
        for (const key in values) {
            if(key !== "product_images" && key !== "product_description") {
                formData.append(key, values[key] || "");
            }
        }
        formData.append('product_description', htmlDescription);

        const imagesWithEdit = fileList.map((file) => ({
            image_name: file.name,
            editing: file.editing || false
        }))


        fileList.forEach((file) => {
            if(!file.editing){
                formData.append("images", file.originFileObj);
            }
        })

        formData.append("imagesWithEdit", JSON.stringify(imagesWithEdit));

        const result = editingProduct 
        ? await editProducts(formData, productId) 
        : await saveProduct(formData)

        if(result){
            message.success(editingProduct 
                ? 'Producto editado con éxito' 
                : 'Producto registrado con éxito'
            );

            form.resetFields()
            setFileList([])
            setEditorState(EditorState.createEmpty())
            message.loading('Actualizando lista de productos...')
            await getProducts()
            handleProducts()
        }
        setSaving(false)
    };

    useEffect(()=>{
        if(editingProduct && productId){
            const selectedProduct = productsList.find(product => product.id === productId)
            form.setFieldsValue({
                product_name: selectedProduct.product_name,
                product_category: selectedProduct.product_category,
                product_price: selectedProduct.product_price,
                product_description: selectedProduct.product_description,
                product_stock: selectedProduct.stock
                
            })
            const blockFromHTML = convertFromHTML(selectedProduct.product_description);
            const contentState = ContentState.createFromBlockArray(blockFromHTML.contentBlocks, blockFromHTML.entityMap);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)

            const formattedImages = selectedProduct.images.map((image) => ({
                uid: uuidv4(),
                name: image.image_name,
                status: 'done',
                editing: true,
                originFileObj: new File([image.image_data], image.image_name, { type: image.image_type }),
                
            }))
    
            setFileList(formattedImages)
            
        }else{
            form.resetFields()
            setFileList([])
            setEditorState(EditorState.createEmpty())

        }
    },[editingProduct, productId])

useEffect(()=>{
    form.setFieldsValue({
        product_images: fileList
    })
},[fileList])


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
                        {validator:(_,value) => {
                            if(!/^(0|[1-9]\d*)$/.test(value)) return Promise.reject(new Error('El stock disponible no puede ser negativo ni incluir letras.'))

                            return Promise.resolve()
                        }}
                    ]
                }
            >
                <Input placeholder='Ingrese el stock disponible'/>
            </Form.Item>

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

            <Form.Item
                name="product_description"
                label="Descripción"
                
                rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
            >
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    placeholder='Ingrese la descripción del producto'
                    
                    toolbar={{
                        options: ['inline', 'list', 'textAlign', 'link', 'history'],
                    }}
                />
            </Form.Item>

            <Form.Item
                name="product_images"
                label="Imágenes"
                rules={[{ required: true, message: 'Por favor suba al menos una imagen' }]}
                valuePropName="fileList"
               
                getValueFromEvent={(e) => e && e.fileList}
            >
                <Dragger {...uploadProps} fileList={fileList} maxCount={3}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Haga clic o arrastre archivos a esta área para subir</p>
                    <p className="ant-upload-hint">
                        Soporte para una o varias imágenes. No suba archivos prohibidos o datos confidenciales.
                    </p>
                </Dragger>
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

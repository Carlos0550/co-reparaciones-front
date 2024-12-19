import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Button, message, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';
import { useAppContext } from '../../../../AppContext';
function BannersForm() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { saveBanner, editingBanner, handleBanner, bannerId, banners, editBanner } = useAppContext()
    const [saving, setSaving] = useState(false)

    const onFinish = async(values) => {
        const formData = new FormData();
        setSaving(true)

        if(fileList.length === 0) {
            return notification.error({
                message: "Error al guardar el banner",
                description: "Por favor ingrese al menos una imagen"
            })
        }

        if(editingBanner){
            formData.append("banner_name", values.banner_name || "");

            const imagesWithEdit = fileList.map((file) => ({
                image_name: file.name,
                editing: file.editing || false
            }))

            formData.append("imagesWithEdit", JSON.stringify(imagesWithEdit));

            fileList.forEach((file) => {
                formData.append("banner_images", file.originFileObj)
            })
    
            const result = await editBanner(formData)

            if(result){
                form.resetFields()
                setFileList([])
                handleBanner()
            }

        }else{
            formData.append("banner_name", values.banner_name || "");
    
            fileList.forEach((file) => {
                formData.append("banner_images", file.originFileObj);
            })
    
            const result = await saveBanner(formData)
    
            if(result){
                form.resetFields()
                setFileList([])
            }
        }
        setSaving(false)
    }

    const handleDeleteImage = (file) => {
        setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
    }
    

    const beforeUpload = async (file) => {
        const isImage = file.type.startsWith("image/")
        if (!isImage) {
            form.setFields([
                {
                    name: "banner_image",
                    errors: ["Solo se permiten archivos de imagen"]
                }
            ]);
            return Upload.LIST_IGNORE
        } else {
            

            const [compressedFiles] = await resizeAndConvertImages([file])

            const newFileList = {
                uid: compressedFiles.uid,
                name: compressedFiles.name,
                originFileObj: compressedFiles,
                editing: false,
                thumbUrl: URL.createObjectURL(compressedFiles)
            }
            setFileList((prevList) => [...prevList, newFileList]);
        }
        return false
    }


    useEffect(()=>{
        if(editingBanner && bannerId) {
            const banner = banners.find(banner => banner.banner_id === bannerId)
            form.setFieldsValue({
                banner_name: banner.banner_name
            })
            const images = banner.images.map(image => {
                return {
                    uid: image.image_id,
                    name: image.image_name,
                    originFileObj: image.image_data,
                    editing: true,
                    thumbUrl: image.image_data
                }
            })

            setFileList(images)
        }else{
            form.resetFields()
            setFileList([])
        }
    },[bannerId, editingBanner])

    return (
        <Form
            name='banners-form'
            layout='vertical'
            onFinish={onFinish}
            form={form}
            
        >
            <Form.Item
                name={"banner_name"}
                label="Nombre del Banner"
            >
                <Input placeholder='Ingrese el nombre del banner' />
            </Form.Item>

            <Form.Item
                label="Imagen del Banner"
                name={"banner_image"}
                rules={[
                    {
                        validator: () => {
                            if (fileList.length >= 3){
                                setFileList(fileList.slice(-2))
                                return Promise.reject("Solo puedes subir hasta 2 imagenes")
                            }
                            return Promise.resolve()
                        }
                    }
                ]}
            >
                <Upload
                    accept='image/*'
                    listType='picture-card'
                    fileList={fileList}
                    onRemove={handleDeleteImage}
                    beforeUpload={beforeUpload}
                    multiple
                >
                    {
                        fileList.length < 2 && (
                            <Button icon={<PlusOutlined />}>Subir</Button>
                        )
                    }
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit' loading={saving}>Guardar</Button>
            </Form.Item>
        </Form>
    )
}

export default BannersForm
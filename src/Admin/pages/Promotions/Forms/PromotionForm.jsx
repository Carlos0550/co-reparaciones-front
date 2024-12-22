import { Button, DatePicker, Form, Input, Space, Select, Switch } from "antd";

import { useAppContext } from "../../../../AppContext";
import { usePromotionLogic } from "./usePromotionLogic";
import ImageUploader from "./ImageUploader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import "./PromotionForm.css";

const { RangePicker } = DatePicker;

const PromotionForm = () => {
  const [form] = Form.useForm();
  
  const { productsList, savePromotion, editPromotion, editingPromotion, promotionID, promotions, handlePromotions } = useAppContext()
  const {
    handleFormSubmit,
    handleCancelEdit,
    editorState,
    setEditorState,
    fileList,
    beforeUpload,
    products,
    addProductToPromotion,
    processMultipleProducts,
    handleDeleteImage,
    isMultiple,
    handleSwitchChange,
    
  } = usePromotionLogic(form, savePromotion, editPromotion, editingPromotion, promotionID, promotions, handlePromotions);

  

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      style={{ width: "100%" }}
    >
      <Form.Item
        name="promotion_name"
        label="Nombre de la promoción"
        rules={[{ required: true, message: "El nombre es obligatorio" }]}
      >
        <Input placeholder="Ejemplo: Oferta de Verano" />
      </Form.Item>

      <Form.Item
        name="promotion_discount"
        label="Descuento (%)"
      >
        <Input type="number" placeholder="Ejemplo: 20" />
      </Form.Item>

      <Form.Item
        name="promotion_dates"
        label="Vigencia de la promoción"
        rules={[{ required: true, message: "Las fechas son obligatorias" }]}
      >
        <RangePicker
          format="DD/MM/YYYY"
          placeholder={["Inicio", "Fin"]}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
          getPopupContainer={(trigger) => trigger.parentNode} 
          style={{ width: "100%"}} 
        />
      </Form.Item>

      <Form.Item label="Descripción">
        <ReactQuill value={editorState} onChange={setEditorState} />
      </Form.Item>

      <Form.Item label="Tipo de Promoción">
        <Switch
          checked={isMultiple}
          onChange={handleSwitchChange}
          checkedChildren="Múltiple"
          unCheckedChildren="Simple"
        />
      </Form.Item>

      {isMultiple ? (
        <>
          <Form.Item
            name="promotion_products"
            label="Productos para promoción múltiple (escribir en formato 'cantidad | producto | precio')"
            rules={[{ required: true, message: "Debe ingresar los productos" }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Ejemplo: 5 | Producto A | 100"
              onChange={(e) => processMultipleProducts(e.target.value)}
            />
          </Form.Item>
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                {console.log(product)}
                x{product.quantity} {product.name} {parseFloat(product.price).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Form.Item
          name="promotion_product"
          label="Producto para promoción simple"
          rules={[{ required: true, message: "Debe seleccionar un producto" }]}
        >
          <Select
            placeholder="Selecciona un producto"
            options={productsList.map((product) => ({
              value: product.id,
              label: product.product_name,
            }))}
            onChange={(value) => addProductToPromotion(value)}
            style={{ width: "100%" }}
          />
        </Form.Item>
      )}

      <ImageUploader fileList={fileList} beforeUpload={beforeUpload} handleDeleteImage={handleDeleteImage}/>

      <Space style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit">
          Guardar Promoción
        </Button>
        {editingPromotion && <Button onClick={handleCancelEdit} danger>Cancelar edición</Button>}
      </Space>
    </Form>
  );
};

export default PromotionForm;

import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, ColorPicker, message, Row, Table } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../../../AppContext'
import getSecurityAdminColumns from './SecurityAccount/SecurityAdminCols'


// Función para convertir RGB a HEX
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

function SettingsManager() {
  const [hasChanged, setHasChanged] = useState(false)
  const [updatingValues, setUpdatingValues] = useState(false)

  const { editPageColors, headerColor, setHeaderColor, contentColor, setContentColor, footerColor, setFooterColor, titleColor, setTitleColor,
    subtitleColor, setSubtitleColor, paragraphColor, setParagraphColor, loginData } = useAppContext()

  const dinamicUpdateValues = async() => {
    setUpdatingValues(true)
    const hiddenMessage = message.loading("Guardando cambios...")
    const formData = new FormData()
    formData.append("headerColor", headerColor)
    formData.append("contentColor", contentColor)
    formData.append("footerColor", footerColor)
    formData.append("titleColor", titleColor)
    formData.append("subtitleColor", subtitleColor)
    formData.append("paragraphColor", paragraphColor)
    const result = await editPageColors(formData)
    setTimeout(() => {
      
      setUpdatingValues(false)
      hiddenMessage()
      if(result){
        message.success("Cambios guardados correctamente")
        setHasChanged(false)
      }
      
    }, 500);
  }

  const handleColorChange = (setColor) => (color) => {
    console.log(color)
    const { r, g, b } = color.metaColor
    const hexColor = rgbToHex(r, g, b)
    setColor(hexColor)
    setHasChanged(true)
  }


  const columns = getSecurityAdminColumns()
  
  const dataForTable = [
    {
      key: 0,
      admin_name: loginData?.admin_name ?? "No disponible",
      admin_email: loginData?.admin_email ?? "No disponible",
      expired_session: loginData?.expired_session ?? "No disponible",
    }
  ];

  return (
    <React.Fragment>
      <Title>Ajustes generales</Title>
      <Title level={3}>Administra aquí la configuración de tu tienda</Title>
      <Card title="Sesión y seguridad">
        <p><InfoCircleOutlined/> Estos son los ajustes de seguridad de tu cuenta como administrador</p>
        <Table
          columns={columns}
          dataSource={dataForTable}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
      <Card title="Diseño">
        <p><QuestionCircleOutlined /> Estos son los colores principales de tu tienda</p>

        <Row gutter={[16, 16]}>
          <Col xl={12} lg={12} md={12} xs={24}>
            <Title level={4}>Color del encabezado (header)</Title>
            <ColorPicker
              defaultValue={headerColor}
              onChange={handleColorChange(setHeaderColor, "headerColor")}
              defaultFormat='hex'
              disabled={updatingValues}
            />

            <Title level={4}>Color del contenido principal</Title>
            <ColorPicker
              defaultValue={contentColor}
              onChange={handleColorChange(setContentColor, "contentColor")}
              defaultFormat='hex'
              disabled={updatingValues}
            />

            <Title level={4}>Color del pie (footer) de la página</Title>
            <ColorPicker
              defaultValue={footerColor}
              onChange={handleColorChange(setFooterColor, "footerColor")}
              defaultFormat='hex'
              disabled={updatingValues}
            />
          </Col>


          <Col xl={12} lg={12} md={12} xs={24}>
            <Title level={4}>Color de los títulos</Title>
            <ColorPicker
              defaultValue={titleColor}
              onChange={handleColorChange(setTitleColor, "titleColor")}
              defaultFormat='hex'
              disabled={updatingValues}
            />

            <Title level={4}>Color de los subtítulos</Title>
            <ColorPicker
              defaultValue={subtitleColor}
              onChange={handleColorChange(setSubtitleColor, "subtitleColor")}
              defaultFormat='hex'
              disabled={updatingValues}
            />

            <Title level={4}>Color de los párrafos</Title>
            <ColorPicker
              defaultValue={paragraphColor}
              onChange={handleColorChange(setParagraphColor, "paragraphColor")}
              defaultFormat='hex'
              disabled={updatingValues}
            />
          </Col>
        </Row>
        <Button style={{ marginTop: "1rem" }} type='primary' onClick={dinamicUpdateValues} loading={updatingValues} disabled={updatingValues || !hasChanged}>Guardar cambios</Button>
      </Card>
    </React.Fragment>
  )
}

export default SettingsManager

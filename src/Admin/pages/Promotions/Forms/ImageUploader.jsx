import React from "react";
import { Button, Upload } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const ImageUploader = ({ fileList, beforeUpload, handleDeleteImage }) => (
  <Upload
    fileList={fileList}
    beforeUpload={beforeUpload}
    onRemove={handleDeleteImage}
    multiple
    listType='picture-card'
    accept="image/*"
  >
    <Button icon={<PlusCircleOutlined/>}/>
  </Upload>
);

export default ImageUploader;

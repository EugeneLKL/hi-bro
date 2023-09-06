import React, { useState } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    Upload,
    message,
    Radio,
    Modal,
    Space
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import axios from 'axios';



const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const EditProfilePhotoModal = ({ visible, onCancel, onSave }) => {
    const [fileList, setFileList] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
    const handleChange = ({ fileList: newFileList }) => {
        // Filter out non-image files
        const imageFiles = newFileList.filter(file => file.type.startsWith('image/'));

        // Update the fileList state with image files
        setFileList(imageFiles);

        if (imageFiles.length > 0) {
            setIsPhotoUploaded(true);
        }
        else {
            setIsPhotoUploaded(false);
        }
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);


    const uploadButton = (
        <div>
            <UploadOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        console.log(typeof (file));
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleUpload = async () => {
        if (fileList.length > 0) {
            setLoading(true);
            const file = fileList[0].originFileObj;

            // You can perform any necessary actions here before saving the file.
            // For example, you might want to resize the image, validate the format, etc.

            try {
                // Get the signed URL from the server
                const urlResponse = await axios.get('/api/s3Url', {
                    params: { contentType: selectedFile.type }
                  });



                console.log('URL: ', urlResponse.data.url);

                const s3SignedUrl = urlResponse.data.url;

                const profileImage = s3SignedUrl.split('?')[0];

                console.log(selectedFile.type);


                // Upload respons
                const uploadResponse = await axios.put(s3SignedUrl, selectedFile, {
                    headers: {
                        'Content-Type': selectedFile.type,
                    },
                });
                

                console.log(selectedFile);
                

                console.log('Image uploaded to S3:', uploadResponse);

                console.log(profileImage);

                onSave(profileImage);
                setLoading(false);



            } catch (error) {
                console.error('Modal Error uploading image to S3:', error);
      setLoading(false);

            }

        }
    };

    return (
        <Modal
            title="Edit Profile Photo"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="upload" type="primary" loading={loading} onClick={handleUpload}>
                    Upload
                </Button>,
            ]}
        >
            {/* Profile Photo */}
            <Form.Item label="Profile Picture" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"  // Replace with your actual upload endpoint
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={(file) => {
                        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                        if (!allowedTypes.includes(file.type)) {
                            message.error('You can only upload PNG, JPG, or JPEG images.');
                            return false;
                        }
                        // Clear the fileList and set the new selected file
                        setFileList([file]);
                        setSelectedFile(file);
                        return false;  // Prevent automatic upload
                    }}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>
        </Modal>
    );
};

export default EditProfilePhotoModal;

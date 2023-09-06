import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const EditNameModal = ({ visible, onCancel, initialValue, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values.name);
      form.resetFields();
      setLoading(false);
      onCancel();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Edit Name"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSubmit}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} initialValues={{ name: initialValue }}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditNameModal;

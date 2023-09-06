// EditGenderModal.js
import React, { useState } from 'react';
import { Modal, Form, Radio, Button } from 'antd';

const EditGenderModal = ({ visible, onCancel, initialValue, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values.gender);
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
      title="Edit Gender"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSubmit}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} initialValues={{ gender: initialValue }}>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select your gender' }]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGenderModal;

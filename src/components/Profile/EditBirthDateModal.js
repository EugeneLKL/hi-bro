import React, { useState } from 'react';
import { Modal, Form, DatePicker, Button } from 'antd';
import moment from 'moment'; // Import the moment library

const EditBirthDateModal = ({ visible, onCancel, initialValue, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Custom validator to check if the selected date is after today's date
  const birthDateValidator = (_, value) => {
    if (value && value.isAfter(moment(), 'day')) {
      return Promise.reject(new Error("Birthdate cannot be after today's date"));
    }
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values.birthDate.format('YYYY-MM-DD'));
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
      title="Edit Birthdate"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSubmit}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item
          name="birthDate"
          label="Birthdate"
          rules={[
            { required: true, message: 'Please select your birthdate' },
            { validator: birthDateValidator }, // Add the custom validator
          ]}
        >
          <DatePicker disabledDate={current => current.isAfter(moment(), 'day')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBirthDateModal;

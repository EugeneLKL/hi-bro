import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditPhoneModal = ({ visible, onCancel, initialValue, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [prefixNumber, setPrefixNumber] = useState('');

  const phoneNumValidator = async (_, value, prefixNumber) => {
    if (!value) {
      return Promise.reject(new Error('Please input your phone number!'));
    }
  
    if (value.length !== 9 && value.length !== 10) {
      return Promise.reject(new Error('Phone number must be 9 or 10 digits long!'));
    }
  
    const phoneNum = `${prefixNumber}${value}`; // Combine prefix with phone number
  
    try {
      const response = await axios.get('/api/checkPhone', {
        params: { userPhone: phoneNum },
      });
  
      if (response.data === false) {
        return Promise.reject(new Error('Phone number is already registered!'));
      }
  
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      return Promise.reject(new Error('An error occurred while checking phone number'));
    }
  };
  
  

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const phoneNum = `${values.prefix}${values.mainNumber}`;
      console.log('Phone number:', phoneNum);
      const validationError = await phoneNumValidator(null, values.mainNumber, values.prefix);
      if (validationError) {
        throw validationError;
      }
  
      onSave(phoneNum);
      form.resetFields();
      setLoading(false);
      onCancel();
    } catch (error) {
      console.error(error);
      setLoading(false);
      message.error(error.message); // Display error message to user
    }
  };
  

  const prefixSelector = (
    <Form.Item
      name="prefix"
      noStyle
      value={prefixNumber}
      onChange={(value) => setPrefixNumber(value)}
    >
      <Select style={{ width: 70 }}>
        <Option value="60">+60</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Edit Phone Number"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSubmit}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} initialValues={{ prefix: '60' }}>
        <Form.Item
          name="mainNumber"
          label="Phone Number"
          rules={[
            {
              validator: phoneNumValidator,
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            placeholder="Enter new phone number"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPhoneModal;

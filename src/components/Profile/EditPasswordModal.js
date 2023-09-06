import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';



const EditPasswordModal = ({ visible, onCancel, onSave }) => {

  // User id
  const { userId } = useAuth();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const passwordValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input your password!'));
    }

    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters long!'));
    }

    // Use regex to check for at least one uppercase, one lowercase, one digit, and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(value)) {
      return Promise.reject(new Error('Password must include uppercase, lowercase, digit, and special character!'));
    }

    return Promise.resolve();
  };

  // Original password validator
  const originalPasswordValidator = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input original password!'));
    }
    else {
      // Check whether the original password same as the database
      const response = await axios.get('/api/getUserPassword', {
        params: { userId: userId },
      });

      console.log("value: ", value);
      console.log("database: ", response.data.password)


      if (value !== response.data.password) {
        return Promise.reject(new Error('Original password is incorrect!'));
      }
      else {
        return Promise.resolve();
      }
    }

  };



  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log(values.originalPassword, values.newPassword);
      onSave(values.newPassword);
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
      title="Change Password"
      width={650} // Set the desired width of the modal
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSubmit}>
          Confirm
        </Button>,
      ]}
    >
      <Form 
      form={form} 
      labelCol={{ span: 7 }} 
      wrapperCol={{ span: 16 }}>
        <Form.Item
          label="Original Password"
          name="originalPassword"
          rules={[
            {
              validator: originalPasswordValidator,
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Enter original password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              validator: passwordValidator,
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            {
              validator(_, value) {
                if (!value || value === form.getFieldValue('newPassword')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The confirmed password does not match the new password.'));
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPasswordModal;

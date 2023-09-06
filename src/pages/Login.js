import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const { handleLogin } = useAuth(); // Get the handleLogin function from AuthContext

  const emailRef = useRef(null);
  const pwdRef = useRef(null);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const userEmail = values['email'];
    const userPwd = values['password'];

    const checkUserRegister = await axios.get('/api/checkUserRegister', {
      params: { userEmail: userEmail },
    });

    if (checkUserRegister.data) {
      if (checkUserRegister.data.password === userPwd) {
        message.success('Login Successfully!');

        const userId = checkUserRegister.data.userId;

        // Use handleLogin function to update authentication status and user ID
        handleLogin(userId);
        
        // Redirect to the profile page
        navigate(`/profile/${userId}`);
      } else {
        // If the password is incorrect
        message.error('Incorrect password');
        form.setFieldsValue({
          password: '',
        });
        pwdRef.current.focus();
      }
    } else {
      // If the user has not registered
      message.error('Please register first');
      // Clear all the fields
      form.setFieldsValue({
        email: '',
        password: '',
      });
    }
  };

    return (
        <div className='login-form'>
            <Form
                form={form}

                name="normal_login"
                className="login"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                // style={{ maxWidth: 600 }}    
                scrollToFirstError
            >
                <h1>Sign In</h1>
                <Form.Item
                    name="email"
                    className='login-form-input'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your Email!',
                        },
                    ]}
                >
                    {/* INput for email as login */}
                    <Input prefix={<MailOutlined className="site-form-item-icon" style={{marginRight: '10px'}}/>} placeholder="Email" ref={emailRef} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your Password!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" style={{marginRight: '10px'}}/>}
                        type="password"
                        placeholder="Password"
                        ref={pwdRef}
                    />
                </Form.Item>
                <Form.Item>
                    {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item> */}

                    {/* <a className="login-form-forgot" href="" style={{ color: '#243b55' }}>
                        Forgot password
                    </a> */}
                </Form.Item>

                {/* Button for login */}
                <div className='login-button'>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            SIGN IN
                        </Button>
                    </Form.Item>
                </div>
            </Form>

            <div className='form-design'>
                <h1>Hello, Buddy!</h1>
                <p>Enter your personal details and start journey with us</p>
                {/* Button for go to login page */}
                <Button type="primary" htmlType="submit" href="/register" className='form-design-button'>
                    SIGN UP
                </Button>
            </div>


        </div>
    );
}

export default Login;
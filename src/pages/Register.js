import { PlusOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

import React, { useState, useEffect, useRef, createContext } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import moment from "moment";
// import type { CascaderProps } from 'antd';
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
  Space,
} from "antd";
import { toast } from "react-toastify";
import "../Account.css";
import "../index.css";
import defaultProfilePicture from "../components/Profile/testingProfile.jpg"; // Update the path accordingly
import axios from "axios";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const Register = () => {
  const [modal, contextHolder] = Modal.useModal();

  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const [profileImg, setProfileImg] = useState(null);

  const [prefixNumber, setPrefixNumber] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [emailRegistered, setEmailRegistered] = useState(false);
  const [phoneRegistered, setPhoneRegistered] = useState(false);

  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  const handleFileChange = async (fileList) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        try {
          const base64 = await getBase64(file.originFileObj);
          setProfileImg(base64);
          setSelectedFile(file.originFileObj);
          setIsPhotoUploaded(true); // Set to true when a photo is uploaded
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      } else {
        message.error("Please upload a PNG, JPG, or JPEG image.");
      }
    }
  };

  const prefixSelector = (
    <Form.Item
      name="prefix"
      noStyle
      // set the value into prefixNumber when the page rendered
      value={prefixNumber}
      // onChange for combining prefix number and phone number entered
      onChange={(e) => setPrefixNumber(e.target.value)}
      style={{ height: 'auto' }}
    >
      <Select style={{ width: 70, height: 'auto' }}>
        <Option value="60">+60</Option>
      </Select>
    </Form.Item>
  );

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 20,
      },
      sm: {
        span: 16,
      },
    },
  };

  const [form] = Form.useForm();

  const formRef = React.useRef(null);

  const passwordRequirements = (
    <ul style={{ textAlign: "left", margin: 0, paddingInlineStart: "20px" }}>
      <li>Must be at least 8 characters long.</li>
      <li>Include both uppercase and lowercase letters.</li>
      <li>Include at least one digit (0-9).</li>
      <li>Include at least one special character.</li>
    </ul>
  );

  const passwordValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }

    if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long!")
      );
    }

    // Use regex to check for at least one uppercase, one lowercase, one digit, and one special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(value)) {
      return Promise.reject(
        new Error(
          "Password must include uppercase, lowercase, digit, and special character!"
        )
      );
    }

    return Promise.resolve();
  };

  const phoneNumValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your phone number!"));
    }

    if (value.length !== 9 && value.length !== 10) {
      return Promise.reject(
        new Error("Phone number must be 9 or 10 digits long!")
      );
    }

    return Promise.resolve();
  };

  const emailValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your email!"));
    }

    // Use regex to check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error("The input is not a valid email!"));
    }

    return Promise.resolve();
  };

  // Name validator
  const nameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your name!"));
    } else {
      return Promise.resolve();
    }
  };

  // Gender validator
  const genderValidator = (_, value, callback) => {
    if (!value) {
      return callback(new Error(`Please select one option from 'Gender'!`));
    } else {
      return callback();
    }
  };

  // Birthdate validator
  const birthdateValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please select your birthdate!"));
    } else {
      return Promise.resolve();
    }
  };

  // Confirm password validator
  const confirmPasswordValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please confirm your password!"));
    } else {
      return Promise.resolve();
    }
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    const userName = values["userName"];
    const userEmail = values["userEmail"];
    const phoneNum = values["prefix"] + values["phone"];
    const gender = values["gender"];
    const birthDate = values["birthDate"].format("DD-MM-YYYY");
    const password = values["password"];

    // console log each declared variable
    console.log("Name: ", userName);
    console.log("Email: ", userEmail);
    console.log("Phone: ", phoneNum);
    console.log("Password:", password);
    console.log("Gender: ", gender);
    console.log("Birthdate: ", birthDate);

    // Check whether the email has been existed in the database
    const checkEmail = await axios.get("/api/checkEmail", {
      params: { userEmail: userEmail },
    });

    if (checkEmail.data === true) {
      console.log("Email Not Existed");
      setEmailRegistered(false);
    } else {
      console.log("Email Existed");
      setEmailRegistered(true);
    }

    // Check whether the phone number has been existed in the database
    const checkPhone = await axios.get("/api/checkPhone", {
      params: { userPhone: phoneNum },
    });

    setPhoneRegistered(checkPhone.data);

    if (checkPhone.data === true) {
      console.log("Phone Not Existed");
    } else {
      console.log("Phone Existed");
      console.log("Checking1: ", phoneRegistered);
      setPhoneRegistered(true);
      console.log("Checking2: ", phoneRegistered);
    }

    if (checkPhone.data === false && checkEmail.data === false) {
      message.warning(
        " It looks like you already have an account. Please try log in instead."
      );
    } else if (checkEmail.data === false) {
      message.warning(" This email has already been registered.");
    } else if (checkPhone.data === false) {
      message.warning(" This phone number has already been registered.");
    } else {
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("userEmail", userEmail);
    formData.append("phoneNum", phoneNum);
    formData.append("gender", gender);
    formData.append("birthDate", birthDate);
    formData.append("password", password);

    // Sending the values get to the backend to be store in the database

    if (checkPhone.data === true && checkEmail.data === true) {
      const confirmed = await modal.confirm(config);

      console.log(confirmed);

      if (confirmed) {
        if (isPhotoUploaded) {
          try {
            // Get the signed URL from the server
            const urlResponse = await axios.get("/api/s3Url", {
              params: { contentType: selectedFile.type },
            });

            console.log("URL: ", urlResponse.data.url);

            const s3SignedUrl = urlResponse.data.url;

            const profileImage = s3SignedUrl.split("?")[0];

            formData.append("profileImage", profileImage);

            // Use the signed URL to upload the image directly to S3
            const uploadResponse = await axios.put(s3SignedUrl, selectedFile, {
              headers: {
                "Content-Type": selectedFile.type,
              },
            });

            console.log("Image uploaded to S3:", uploadResponse);
          } catch (error) {
            console.error("Error uploading image to S3:", error);
          }
        } else {
          // If no image was uploaded, use the default profile picture
          formData.append("profileImage", defaultProfilePicture);
        }

        const response = await axios.post("/api/register", formData);
        console.log("New user created:", response.data);

        message.success("Register successfully!");

        // Link to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.log("Not confirmed");
      }
    }
  };

  const [fileList, setFileList] = useState([]);

  // const handleChange = ({ fileList }) => {
  //     setFileList(fileList);
  // };

  useEffect(
    () => {
      if (emailRegistered && emailInputRef.current) {
        emailInputRef.current.focus();
        setEmailRegistered(false);
      } else if (phoneRegistered && phoneInputRef.current) {
        phoneInputRef.current.focus();
        setPhoneRegistered(false);
      }
    },
    [phoneRegistered],
    [emailRegistered]
  );

  // const handleConfirm = async () => {
  //     const confirmed = await modal.confirm(config);
  //     console.log('Confirmed: ', confirmed);

  //     if (confirmed) {
  //         console.log('hi'); // Log "hi" to the console
  //     }
  // };

  const config = {
    title: "Confirm register?",
    content: (
      <>
        {/* Display the welcoming message */}
        <p>Are you sure you want to register?</p>
      </>
    ),
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    console.log(typeof file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Filter out non-image files
    const imageFiles = newFileList.filter((file) =>
      file.type.startsWith("image/")
    );

    // Update the fileList state with image files
    setFileList(imageFiles);

    if (imageFiles.length > 0) {
      setIsPhotoUploaded(true);
    } else {
      setIsPhotoUploaded(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <div className="register-form">
      <div className="form-design">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personnal info</p>
        {/* text for go to login page */}
        <Button
          type="primary"
          htmlType="submit"
          href="/"
          className="form-design-button no-effect" // Apply the no-effect class here
        >
          SIGN IN
        </Button>
      </div>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        labelAlign="left"
        initialValues={{ prefix: "60" }}
        labelCol={{ span: 6 }}
        // style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <h1>Create Account</h1>

        {/* Name */}
        <Form.Item
          name="userName"
          label="Name"
          rules={[{ validator: nameValidator }]}
          labelCol={{ span: 6 }} // Set label width
          wrapperCol={{ span: 18 }} // Set input width
          style={{ marginBottom: 0 }} // Remove extra margin
        >
          <Input style={{ height: '50px', }} /> {/* Set a fixed height */}
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="userEmail"
          label="E-mail"
          rules={[
            {
              validator: emailValidator,
            },
          ]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <Input style={{ height: '50px' }} />
        </Form.Item>

        {/* Phone number */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              validator: phoneNumValidator,
            },
          ]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <Input
            addonBefore={prefixSelector}
            style={{ height: '30px', marginBottom: '10px' }}
          />
        </Form.Item>

        {/* Gender */}
        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              validator: genderValidator,
            },
          ]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <Radio.Group style={{ marginTop: '13px' }}>
            <Radio value="Male"> Male </Radio>
            <Radio value="Female"> Female </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Birthdate */}
        <Form.Item
          name="birthDate"
          label="Birthdate"
          rules={[
            {
              validator: birthdateValidator,
            },
          ]}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <DatePicker
            disabledDate={(current) =>
              current && current >= moment().endOf("day")
            }
            style={{ height: '50px', padding: 'auto' }}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          tooltip={{
            title: passwordRequirements,
          }}
          rules={[
            {
              validator: passwordValidator,
            },
          ]}
          hasFeedback
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <Input.Password
            style={{ height: '50px', padding: 'auto' }}
            iconRender={(visible) => (visible ? <EyeTwoTone style={{ fontSize: '16px', lineHeight: '40px' }} /> : <EyeInvisibleOutlined style={{ fontSize: '16px', lineHeight: '40px' }} />)}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            {
              validator: confirmPasswordValidator,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
          hasFeedback
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <Input.Password
            style={{ height: '50px' }}
            iconRender={(visible) => (visible ? <EyeTwoTone style={{ fontSize: '16px', lineHeight: '40px' }} /> : <EyeInvisibleOutlined style={{ fontSize: '16px', lineHeight: '40px' }} />)}
          />
        </Form.Item>



        {/* Profile Photo */}
        <Form.Item
          label="Profile Picture"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginBottom: 0, marginTop: '20px' }}
        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={(file) => {
              const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
              if (!allowedTypes.includes(file.type)) {
                message.error("You can only upload PNG, JPG, or JPEG images.");
                return false;
              }
              setFileList([file]);
              setSelectedFile(file);
              return false;
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>


        {/* Register Button */}
        <div className="register-button">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              SIGN UP
            </Button>
          </Form.Item>
        </div>
      </Form>
      {contextHolder}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default Register;

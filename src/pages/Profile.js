import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Button, Space, Image, Form, message, Modal } from 'antd';
import EditNameModal from '../components/Profile/EditNameModal';
import EditGenderModal from '../components/Profile/EditGenderModal';
import EditPhoneModal from '../components/Profile/EditPhoneModal';
import EditBirthdateModal from '../components/Profile/EditBirthDateModal';
import EditPasswordModal from '../components/Profile/EditPasswordModal';
import EditProfilePhotoModal from '../components/Profile/EditProfilePhotoModal';
import { BiLogOut, BiEditAlt } from 'react-icons/bi';
import { AiOutlineEye } from 'react-icons/ai'
// import AWS from 'aws-sdk';
// const generateUploadURL = require('../../../hi-bro-server/s3');




const Profile = () => {
    const navigate = useNavigate();
    const { userId, handleLogout, setProfileImageUrl, setUserName } = useAuth();
    const [userInfo, setUserInfo] = useState({});
    const [userImageUrl, setUserImageUrl] = useState('');
    const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
    const [isEditGenderModalVisible, setIsEditGenderModalVisible] = useState(false);
    const [isEditPhoneModalVisible, setIsEditPhoneModalVisible] = useState(false);
    const [isEditBirthdateModalVisible, setIsEditBirthdateModalVisible] = useState(false);
    const [isEditPasswordModalVisible, setIsEditPasswordModalVisible] = useState(false);
    const [isEditPhotoModalVisible, setIsEditPhotoModalVisible] = useState(false);


    const showEditNameModal = () => {
        setIsEditNameModalVisible(true);
    };

    const hideEditNameModal = () => {
        setIsEditNameModalVisible(false);
    };

    const showEditGenderModal = () => {
        setIsEditGenderModalVisible(true);
    };

    const hideEditGenderModal = () => {
        setIsEditGenderModalVisible(false);
    };

    const showEditPhoneModal = () => {
        setIsEditPhoneModalVisible(true);
    };

    const hideEditPhoneModal = () => {
        setIsEditPhoneModalVisible(false);
    };

    const showEditBirthdateModal = () => {
        setIsEditBirthdateModalVisible(true);
    };

    const hideEditBirthdateModal = () => {
        setIsEditBirthdateModalVisible(false);
    };

    const showEditPasswordModal = () => {
        setIsEditPasswordModalVisible(true);
    };

    const hideEditPasswordModal = () => {
        setIsEditPasswordModalVisible(false);
    };

    const handleSaveName = async (newName) => {
        try {
            // Send the updated name to the server and update state
            const updatedUserInfo = { ...userInfo, userName: newName };

            // Make a PATCH request to update the name in the database
            axios.patch(`/api/updateUserName/${userId}`, { newName: newName });
            message.success('Name Updated Successfully!');
            setUserName(newName);
            setUserInfo(updatedUserInfo);

            hideEditNameModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveGender = async (newGender) => {
        try {
            const updatedUserInfo = { ...userInfo, gender: newGender };

            axios.patch(`/api/updateUserGender/${userId}`, { newGender: newGender });
            message.success('Gender Updated Successfully!');

            setUserInfo(updatedUserInfo);
            hideEditGenderModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSavePhone = async (newPhone) => {
        try {
            // Send the updated name to the server and update state
            const updatedUserInfo = { ...userInfo, phoneNum: newPhone };

            axios.patch(`/api/updateUserPhone/${userId}`, { newPhone: newPhone });
            message.success('Phone Number Updated Successfully!');

            console.log(typeof (newPhone));

            setUserInfo(updatedUserInfo);
            hideEditPhoneModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveBirthdate = async (newBirthdate) => {
        try {
            // Send the updated name to the server and update state
            const updatedUserInfo = { ...userInfo, birthDate: newBirthdate };

            axios.patch(`/api/updateUserBirthdate/${userId}`, { newBirthDate: newBirthdate });
            message.success('Birthdate Updated Successfully!');

            console.log('TYPE OF: ', typeof (newBirthdate));
            console.log('TYPE OF: ', newBirthdate);

            setUserInfo(updatedUserInfo);
            hideEditBirthdateModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSavePassword = async (newPassword) => {
        try {
            // Send the updated name to the server and update state
            const updatedUserInfo = { ...userInfo, password: newPassword };

            axios.patch(`/api/updateUserPassword/${userId}`, { newPassword: newPassword });
            console.log(newPassword);
            message.success('Password Updated Successfully!');
            console.log("password changed");
            setUserInfo(updatedUserInfo);
            hideEditPasswordModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveProfilePhoto = async (newProfilePhoto) => {

        console.log('new profile photo:', newProfilePhoto);

        try {
            // Send the updated name to the server and update state
            const updatedUserInfo = { ...userInfo, profileImage: newProfilePhoto };

            axios.patch(`/api/updateUserProfileImage/${userId}`, { newProfilePhoto: newProfilePhoto });
            message.success('Profile Photo Updated Successfully!');

            setUserImageUrl(newProfilePhoto);
            console.log('set image success');
            setProfileImageUrl(newProfilePhoto);
            setUserInfo(updatedUserInfo);

            hideEditPhotoModal();
        } catch (error) {
            console.error(error);
        }
    };



    const handleLogoutClick = () => {
        handleLogout(); // Call the logout function from AuthContext
        navigate('/'); // Redirect to the login page
    };



    useEffect(() => {
        // Fetch user image URL and update state
        async function fetchUserImage() {
            try {
                console.log('refreash');
                console.log('User Image URL:', userImageUrl);

                const response = await axios.get(`/api/getUserInfo/${userId}`);
                setUserImageUrl(response.data.profileImage);
                setProfileImageUrl(response.data.profileImage);

                console.log('URL', response.data.profileImage)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserImage();
    }, [userImageUrl]);


    useEffect(() => {
        // Fetch user info and update state
        async function fetchUserInfo() {
            try {
                const result = await axios.get(`/api/getUserInfo/${userId}`);
                setUserName(result.data.userName);
                setUserInfo(result.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserInfo();
    }, []);

    const formItemLayout = {
        labelAlign: 'right', // Align label text to the right
    };

    const [isHovered, setIsHovered] = useState(false);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handlePreviewClick = () => {
        setIsPreviewModalVisible(true);
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalVisible(false);
    };

    const showEditPhotoModal = () => {
        setIsEditPhotoModalVisible(true);
    };

    const hideEditPhotoModal = () => {
        setIsEditPhotoModalVisible(false);
    };




    return (
        // Display all the information get
        <div className='profile-container'>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative', display: 'inline-block' }}
            >
                <Image
                    src={userImageUrl}
                    alt="profile"
                    className='profile-profilePic'
                    width={250}
                    height={250}
                    preview={false}
                    style={{
                        filter: isHovered ? 'brightness(30%)' : 'brightness(100%)',
                        transition: 'filter 0.3s',
                    }}
                />
                {isHovered && (
                    <div
                        style={{
                            // Place at the middle and center
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, 0%)',
                            display: 'flex',
                            alignItems: 'center'
                            // textAlign: 'left',
                        }}
                    >
                        <Button
                            onClick={handlePreviewClick}
                            style={{
                                marginRight: '8px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'color 0.3s', // Adding a smooth transition effect
                            }}
                            // Adding a hover style
                            onMouseEnter={(e) => e.currentTarget.style.color = 'grey'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <AiOutlineEye style={{ marginRight: '8px' }} /> View
                            </span>

                        </Button>
                        <Button
                            // onClick={handlePreviewClick}
                            onClick={showEditPhotoModal}
                            style={{
                                marginRight: '8px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'color 0.3s', // Adding a smooth transition effect
                            }}
                            // Adding a hover style
                            onMouseEnter={(e) => e.currentTarget.style.color = 'grey'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>

                                < BiEditAlt style={{ marginRight: '8px' }} /> Edit
                            </span>

                        </Button>

                    </div>
                )}
                <Modal
                    visible={isPreviewModalVisible}
                    onCancel={handleClosePreviewModal}
                    footer={null}
                    // Scale to smaller
                    width={550}
                    height={550}
                >
                    <Image
                        src={userImageUrl}
                        alt="profile"
                        preview={false}
                        style={{
                            marginTop: '30px',
                            borderRadius: '10px'
                        }}
                    // Make the scale smaller
                    />
                </Modal>

                <EditProfilePhotoModal
                    visible={isEditPhotoModalVisible}
                    onCancel={hideEditPhotoModal}
                    onSave={handleSaveProfilePhoto}
                />

            </div>


            <div className='profile-info'>

                <Form
                    {...formItemLayout}>
                    <div className='profile-form-item'>
                        <Form.Item
                            name="Email"
                            label="Email"
                        >
                            <p>{userInfo?.userEmail}</p>
                        </Form.Item>
                    </div>

                    <div className="profile-form-item">
                        <Form.Item
                            name="Name"
                            label="Name">
                            <p>{userInfo?.userName}</p>
                        </Form.Item>
                        <Button onClick={showEditNameModal}> <BiEditAlt style={{ marginRight: '8px' }} /> Edit</Button>
                    </div>

                    {/* Edit Name Modal */}
                    <EditNameModal
                        visible={isEditNameModalVisible}
                        onCancel={hideEditNameModal}
                        initialValue={userInfo?.userName}
                        onSave={handleSaveName}
                    />



                    <div className='profile-form-item'>
                        <Form.Item
                            name="Phone Number"
                            label="Phone Number"
                        >
                            <p>{userInfo?.phoneNum}</p>
                        </Form.Item>
                        <Button onClick={showEditPhoneModal}> <BiEditAlt style={{ marginRight: '8px' }} /> Edit</Button>
                    </div>

                    {/* Edit Phone Modal */}
                    <EditPhoneModal
                        visible={isEditPhoneModalVisible}
                        onCancel={hideEditPhoneModal}
                        initialValue={userInfo?.phoneNum}
                        onSave={handleSavePhone}
                    />


                    <div className='profile-form-item'>
                        <Form.Item
                            name="Gender"
                            label="Gender"
                        >
                            <p>{userInfo?.gender}</p>
                        </Form.Item>
                        {/* <Button onClick={showEditGenderModal}> <BiEditAlt style={{ marginRight: '8px' }} /> Edit</Button> */}
                    </div>

                    {/* Edit Gender Modal */}
                    <EditGenderModal
                        visible={isEditGenderModalVisible}
                        onCancel={hideEditGenderModal}
                        initialValue={userInfo?.gender}
                        onSave={handleSaveGender}
                    />

                    <div className='profile-form-item'>
                        <Form.Item
                            name="Birthdate"
                            label="Birthdate"
                        >
                            <p>{userInfo?.birthDate}</p>
                        </Form.Item>
                        {/* <Button onClick={showEditBirthdateModal}> <BiEditAlt style={{ marginRight: '8px' }} /> Edit</Button> */}
                    </div>

                    {/* Edit Birthdate Modal */}
                    <EditBirthdateModal
                        visible={isEditBirthdateModalVisible}
                        onCancel={hideEditBirthdateModal}
                        initialValue={userInfo?.birthDate}
                        onSave={handleSaveBirthdate}
                    />

                    <div className='profile-form-item'>
                        <Form.Item
                            name="Password"
                            label="Password"
                        >
                            <p>********</p>
                        </Form.Item>
                        <Button onClick={showEditPasswordModal}> <BiEditAlt style={{ marginRight: '8px' }} /> Edit</Button>
                    </div>

                    {/* Edit Password Modal */}
                    <EditPasswordModal
                        visible={isEditPasswordModalVisible}
                        onCancel={hideEditPasswordModal}
                        initialValue={userInfo?.password}
                        onSave={handleSavePassword}
                    />



                </Form>

            </div>

            <Button onClick={handleLogoutClick} className='logoutButton' style={{ marginTop: '18px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BiLogOut style={{ marginRight: '8px' }} />
                    Log Out
                </span>
            </Button>
        </div>
    );
};

export default Profile;

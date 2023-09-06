import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Image, Button, Modal } from 'antd';
import { useAuth } from '../../AuthContext';
import { BiSolidUser, BiDetail } from 'react-icons/bi'
import { SlCalender, SlLocationPin, SlInfo } from 'react-icons/sl'
import { AiFillDelete } from 'react-icons/ai'
import { MdOutlineDone } from 'react-icons/md'
import axios from 'axios';
import EditPostModal from './TravelPostEditModal';

const TravelPosted = () => {

    const history = useNavigate();
    const { userId, rerender, setRerender } = useAuth();
    const [posts, setPosts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [loadingStates, setLoadingStates] = useState({});
    const [isEditPostModalVisible, setIsEditPostModalVisible] = useState(false);
    const [editPostData, setEditPostData] = useState(null);

    const showEditPostModal = () => {
        setIsEditPostModalVisible(true);
    }

    const hideEditPostModal = () => {
        setIsEditPostModalVisible(false);
    }

    const handleEditPostModalCancel = () => {
        setIsEditPostModalVisible(false);
    }

    const handleSaveEditedPost = async (postEdited) => {
        try {
            const response = await axios.put('/api/editTravelBuddyPost', {
                params: {
                    postId: postEdited.id,
                    destination: postEdited.destination,
                    startDate: postEdited.startDate,
                    endDate: postEdited.endDate,
                    additionalInfo: postEdited.additionalInfo,
                    buddyPreference: postEdited.buddyPreference,
                }
            });
            console.log(response);
            setIsEditPostModalVisible(false);
            setRerender(!rerender);
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditClick = (post) => {
        console.log('handleEditClick ', post.travelPostId);
        setEditPostData(post.travelPostId);
        showEditPostModal(); // Show the modal
    }

    const handleDeleteClick = (post) => {
        console.log('Delete ID', post.travelPostId);

        Modal.confirm({
            title: 'Are you sure you want to delete this post?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete it',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deletePost(post.travelPostId); // Pass the travelPostId as an argument
            },
        });
    };

    const deletePost = async (id) => {
        try {
            const response = await axios.delete(`/api/deleteTravelBuddyPost/${id}`);
            console.log(response);
            setRerender(!rerender);
        } catch (error) {
            console.log(error);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const calculateTripDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInMilliseconds = end - start;
        const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
        return days;
    };

    useEffect(() => {
        const getPosts = async () => {
            try {
                const result = await axios.get('/api/getTravelBuddyPost');
                console.log(result);
                // Filter out the posts that belong to the logged-in user
                const nonUserPosts = result.data.filter(post =>
                    post.creator.userId !== userId &&
                    !post.buddyFound);

                // Fetch the post posted by the logged-in user
                const userPosts = result.data.filter(post =>
                    post.creator.userId === userId);
                if (nonUserPosts) {
                    setPosts(nonUserPosts);
                }
                if (userPosts) {
                    setPosts(userPosts);
                }
            } catch (error) { }
        };
        getPosts();
    }, [userId, rerender]);

    const { Meta } = Card;

    return (
        <div
            style={{
                // Display at the center of the screen
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                // border: '1px solid red'
            }}>
            <Row
                gutter={[16, 16]}
                style={{
                    display: 'flex',
                }}
            >
                {posts.map(post => (
                    <Col
                        key={post.id}
                        span={12}
                    >
                        <Card
                            style={{
                                minHeight: '200px',
                                maxHeight: '350px',
                                width: '600px'
                            }}>
                            <Meta
                                title={
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                        <SlLocationPin style={{ marginRight: '10px', marginLeft: '6px' }} />
                                        {post.destination}
                                    </span>
                                }
                                style={{
                                    borderBottom: '1px solid #dcdcdc',
                                    paddingBottom: '8px',
                                    marginBottom: '12px'
                                }}
                            />

                            <p
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '8px',

                                }}>
                                <SlCalender style={{
                                    marginRight: '10px',
                                    marginLeft: '8px',
                                }} />
                                {formatDate(post.startDate)} - {formatDate(post.endDate)}
                                {/* Make a space */}
                                {'  '}
                                ({calculateTripDuration(post.startDate, post.endDate)} Days)
                            </p>
                            <p
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '8px',

                                }}>
                                <BiSolidUser style={{
                                    marginRight: '10px',
                                    marginLeft: '8px',
                                }} />
                                10 Requester
                            </p>

                            {/* Display buddy preference which is an array line by line */}
                            {post.additionalInfo && (
                                <p
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: '8px',
                                    }}>
                                    <SlInfo style={{ marginRight: '10px', marginLeft: '8px' }} />
                                    {post.additionalInfo}
                                </p>
                            )}
                            <ul
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    listStyleType: 'none', // Remove bullet points
                                    padding: 0, // Remove default padding
                                    flexWrap: 'wrap', // Wrap items to the next line
                                }}
                                className='travel-post-preference'>
                                {post.buddyPreference.map((preference, index) => (
                                    <li key={index}>{preference}</li>
                                ))}
                            </ul>
                            <Button
                                onClick={() => handleEditClick(post)}>
                                Edit
                            </Button>



                            <Button
                                onClick={() => handleDeleteClick(post)}>
                                Delete
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>

            {isEditPostModalVisible &&
                <EditPostModal
                    visible={isEditPostModalVisible}
                    onCancel={hideEditPostModal}
                    onSave={handleSaveEditedPost}
                    postId={editPostData}
                />
            }
        </div>
    );
}

export default TravelPosted;
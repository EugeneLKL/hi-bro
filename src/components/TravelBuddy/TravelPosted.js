import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Image, Button, Modal, Pagination, Tooltip, message } from 'antd';
import { useAuth } from '../../AuthContext';
import { BiSolidUser, BiDetail } from 'react-icons/bi'
import { SlCalender, SlLocationPin, SlInfo } from 'react-icons/sl'
import { AiFillDelete } from 'react-icons/ai'
import { MdOutlineDone } from 'react-icons/md'
import axios from 'axios';
import EditPostModal from './TravelPostEditModal';

const TravelPosted = () => {

    const history = useNavigate();
    const { userId, rerender, setRerender, userName } = useAuth();
    const [posts, setPosts] = useState([]);
    const [postRequester, setPostRequester] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [loadingStates, setLoadingStates] = useState({});
    const [isEditPostModalVisible, setIsEditPostModalVisible] = useState(false);
    const [editPostData, setEditPostData] = useState(null);
    const [buddyInfo, setBuddyInfo] = useState(null);
    const [buddyNames, setBuddyNames] = useState({});
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);




    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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

            // Display a success message
        message.success('Post edited successfully!');
        } catch (error) {
            console.log(error);
            message.error('Failed to edit post.');
        }
    }

    const handleEditClick = (post) => {
        console.log('handleEditClick ', post.travelPostId);
        setEditPostData(post.travelPostId);
        showEditPostModal(); // Show the modal
    }

    const handleDeleteClick = (post) => {
        console.log('Delete ID', post.travelPostId);

        // Check if there are requesters
        if (post.requesterCount > 0) {
            Modal.confirm({
                title: 'Delete post?',
                content: `There are already ${post.requesterCount} requester(s) for this post. Deleting this will remove their requests as well. Are you sure you want to proceed?`,
                okText: 'Yes, Delete it',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    deletePost(post.travelPostId);
                },
            });
        } else {
            Modal.confirm({
                title: 'Delete post?',
                content: 'This action cannot be undone.',
                okText: 'Yes, Delete it',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    deletePost(post.travelPostId);
                },
            });
        }
    };


    const deletePost = async (id) => {
        try {
            const response = await axios.delete(`/api/deleteTravelBuddyPost/${id}`);
            console.log(response);
            setRerender(!rerender);

            // Display a success message
            message.success('Post deleted successfully!');
        } catch (error) {
            console.log(error);
            message.error('Failed to delete post.');
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

    const countRequesters = (postId, allRequests) => {
        return allRequests.filter(request => request.post.travelPostId === postId).length;
    };

    const handleContactBuddy = async (buddyId) => {
        try {
            // Assuming your API endpoint and the way you access the buddy's ID looks like this
            const response = await axios.get(`/api/getUserInfo/${buddyId}`);
            const buddyData = response.data;
            console.log(buddyData.phoneNum);
            const text = `Hi, I'm reaching out regarding our matched trip on the Hi-Bro (Travel Buddy) platform. Nice to meet you! I'm ${userName}!`;
            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/${buddyData.phoneNum}?text=${encodedText}`;
            window.open(whatsappUrl, '_blank');
            // Now, you can do whatever you want with the buddyData, 
            // e.g., open a modal to display the contact info or redirect to another page.

        } catch (error) {
            console.error("Failed to fetch buddy data:", error);
        }
    };



    useEffect(() => {
        const getPostsAndRequests = async () => {
            try {
                const postResult = await axios.get('/api/getTravelBuddyPost');
                const requestResult = await axios.get('/api/getAllBuddyRequests');

                // Filter out the posts that belong to the logged-in user
                const userPosts = postResult.data.filter(post => post.creator.userId === userId);

                // For each user post, add requesterCount
                userPosts.forEach(post => {
                    post.requesterCount = countRequesters(post.travelPostId, requestResult.data);
                });

                // Fetch buddy names if buddyFound is true
                const fetchedBuddyNames = {};
                for (let post of userPosts) {
                    if (post.buddyFound) {
                        fetchedBuddyNames[post.travelPostId] = await getBuddyInfo(post.buddyId);
                    }
                }

                // Set the posts with requester count to the state
                if (userPosts.length) {
                    setPosts(userPosts);
                    setBuddyNames(fetchedBuddyNames);  // Set the fetched buddy names
                }

            } catch (error) {
                console.error("Failed to fetch posts and requests:", error);
            }
        };

        getPostsAndRequests();
    }, [userId, rerender]);



    const getBuddyInfo = async (buddyId) => {
        try {
            const response = await axios.get(`/api/getUserInfo/${buddyId}`);
            return response.data.userName;
        } catch (error) {
            console.error("Failed to fetch buddy data:", error);
        }
    };



    const { Meta } = Card;

    const actionButtonsStyles = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        gap: '0px'  // Creates a gap between buttons
    };

    return (
        <div
            style={{
                // Display at the center of the screen

                width: '100%',
                // border: '1px solid red'
            }}>
            <Row
                gutter={[16, 16]}
                style={{
                    display: 'flex',
                }}
            >
                {currentPosts.map(post => (
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
                            <p style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '8px',
                            }}>
                                <BiSolidUser style={{
                                    marginRight: '10px',
                                    marginLeft: '8px',
                                }} />

                                {post.buddyFound ? buddyNames[post.travelPostId] : `${post.requesterCount} Requester(s)`}
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
                            <div style={actionButtonsStyles}>
                                {post.buddyFound ? (
                                    <Tooltip title="Try contacting your buddy if there is any changes.">
                                        <Button onClick={() => handleContactBuddy(post.buddyId)}>Contact</Button>

                                    </Tooltip>
                                ) : (
                                    <>
                                        <Button onClick={() => handleEditClick(post)}>Edit</Button>
                                        <Button danger onClick={() => handleDeleteClick(post)}>Delete</Button>
                                    </>
                                )}
                            </div>


                        </Card>
                    </Col>
                ))}
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    total={posts.length}
                    pageSize={postsPerPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>

            {
                isEditPostModalVisible &&
                <EditPostModal
                    visible={isEditPostModalVisible}
                    onCancel={hideEditPostModal}
                    onSave={handleSaveEditedPost}
                    postId={editPostData}
                />
            }
        </div >
    );
}

export default TravelPosted;
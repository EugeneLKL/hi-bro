import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Image, Button } from 'antd';
import { useAuth } from '../../AuthContext';
import { BiSolidUser, BiDetail } from 'react-icons/bi'
import { SlCalender, SlLocationPin, SlInfo } from 'react-icons/sl'
import { MdOutlineDone } from 'react-icons/md'
import axios from 'axios';

const TravelBuddyCardPost = () => {
    const { userId } = useAuth();
    const [posts, setPosts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [requestButton, setRequestButton] = useState('Request');
    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each post
    const [requestButtonStates, setRequestButtonStates] = useState({}); // Track button text for each post




    const { Meta } = Card;

    const calculateAge = (birthDate) => {
        const currentDate = new Date();
        const birthDateObj = new Date(birthDate);

        let age = currentDate.getFullYear() - birthDateObj.getFullYear();

        if (
            currentDate.getMonth() < birthDateObj.getMonth() ||
            (currentDate.getMonth() === birthDateObj.getMonth() &&
                currentDate.getDate() < birthDateObj.getDate())
        ) {
            age--;
        }

        return age;
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

                // Fetch requested posts for the logged-in user
                const requestedPosts = await axios.get('/api/getTravelBuddyRequestLog');
                const requestedPostIds = requestedPosts.data
                    .filter(request => request.requesterId === userId)
                    .map(request => request.postId);

                // Filter out posts that have been requested by the user
                const displayPosts = nonUserPosts.filter(
                    post => !requestedPostIds.includes(post.travelPostId)
                );

                setPosts(displayPosts);
            } catch (error) {
                console.log(error);
            }
        };

        getPosts();  // Call the getPosts function
    }, [userId]);

    useEffect(() => {
        // Fetch user image URL and update state
        async function fetchUserImage() {
            try {
                console.log('User Image URL:', imageUrl);

                const response = await axios.get(`/api/getUserInfo/${userId}`);
                // setImageUrl(response.data.profileImage);

                console.log('URL', response.data.profileImage)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserImage();
    }, [imageUrl]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const handleRequest = async (travelPostId) => {
        try {
            setLoadingStates((prevState) => ({
                ...prevState,
                [travelPostId]: true, // Set loading state for the current post
            }));

            const result = await axios.post('/api/createTravelBuddyRequest', {
                userId: userId,
                postId: travelPostId,
            });

            // Delay the loading indicator for 1 second
            setTimeout(() => {
                setLoadingStates((prevState) => ({
                    ...prevState,
                    [travelPostId]: false, // Clear loading state for the current post
                }));
                setRequestButtonStates((prevState) => ({
                    ...prevState,
                    [travelPostId]: 'Requested', // Set button text for the current post
                }));
            }, 1000);
        } catch (error) {
            console.log(error);
            setLoadingStates((prevState) => ({
                ...prevState,
                [travelPostId]: false, // Clear loading state for the current post on error
            }));
        }
    };

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
                                minHeight: '250px',
                                maxHeight: '350px',
                                width: '600px'
                            }}>
                            <Meta
                                avatar={
                                    <Image src={post.creator.profileImage}
                                        alt='Profile'
                                        className='profile-profilePic'
                                        width={100}
                                        height={100}
                                        preview={false}
                                        style={{
                                            marginLeft: 25
                                        }}
                                    />}
                                title={
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginTop: 20,
                                            marginLeft: 50
                                        }}>
                                        <BiSolidUser
                                            style={{
                                                marginRight: '8px'
                                            }} />
                                        {post.creator.userName}
                                    </span>
                                }
                                description={
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: 50
                                        }}>
                                        <BiDetail
                                            style={{ marginRight: '8px' }}
                                        />
                                        {post.creator.gender}
                                        <span
                                            style={{ marginLeft: '8px' }}
                                        >
                                            ({calculateAge(post.creator.birthDate)} years old)
                                        </span>
                                    </span>
                                }
                                style={{
                                    borderBottom: '1px solid #dcdcdc',
                                    paddingBottom: '5px',
                                    marginBottom: '12px'
                                }}
                            />
                            <p
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}><SlLocationPin style={{ marginRight: '10px', marginLeft: '8px' }} />{post.destination}
                                </p>
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
                                onClick={() => handleRequest(post.travelPostId)}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    margin: '18px',
                                }}
                                loading={loadingStates[post.travelPostId] || false} // Use loading state for the current post
                                disabled={requestButtonStates[post.travelPostId] === 'Requested'}
                            >
                                {requestButtonStates[post.travelPostId] === 'Requested' ? (
                                    <>
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <MdOutlineDone style={{ marginRight: '5px' }} />
                                            Requested
                                        </span>
                                    </>
                                ) : (
                                    requestButton
                                )}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default TravelBuddyCardPost;
import React, { useEffect, useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { BiSolidUser, BiDetail } from 'react-icons/bi'
import { SlCalender, SlLocationPin, SlInfo, } from 'react-icons/sl'
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb'
import { Card, Col, Row, Button, Avatar, Image } from 'antd'; // Import Button from antd
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const { Meta } = Card;

const BuddyRequester = () => {
    const { userId } = useAuth();
    const [requestedPosts, setRequestedPosts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

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

    const fetchRequestedPosts = async () => {
        try {
            const result = await axios.get('/api/getRequestedPosts');
            // Filter the requested posts that belong to the logged-in user
            const userRequestedPosts = result.data.filter(requestedPost => requestedPost.post.creator.userId === userId);
            console.log(userRequestedPosts);
            setRequestedPosts(userRequestedPosts);
            setImageUrl(userRequestedPosts.requester.profileImage);

            console.log('Image URL:', userRequestedPosts.post.creator.userId);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRequestedPosts();
    }, []);

    const handleAccept = async (postId, requesterId) => {
        try {
            const result = await axios.post('/api/acceptBuddyRequest', {
                userId: requesterId,
                postId: postId
            });
            console.log(result);
            // After accepting the request, you can update the state or fetch data again if needed
            // fetchRequestedPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleReject = async (postId, requesterId) => {
        try {
            const result = await axios.post('/api/rejectBuddyRequest', {
                userId: requesterId,
                postId: postId,
            });
            console.log(result);
            // After rejecting the request, you can update the state or fetch data again if needed
            fetchRequestedPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const groupedPostsByDestination = {};
    
    requestedPosts.forEach(requestedPost => {
        const destination = requestedPost.post.destination;
        if (!groupedPostsByDestination[destination]) {
            groupedPostsByDestination[destination] = [];
        }
        groupedPostsByDestination[destination].push(requestedPost);
    });

    const groupedPostsByDestinationAndDate = {};

    requestedPosts.forEach(requestedPost => {
        const destination = requestedPost.post.destination;
        const startDate = formatDate(requestedPost.post.startDate);
        const endDate = formatDate(requestedPost.post.endDate);
        const duration = calculateTripDuration(requestedPost.post.startDate, requestedPost.post.endDate);

        if (!groupedPostsByDestinationAndDate[destination]) {
            groupedPostsByDestinationAndDate[destination] = {};
        }

        if (!groupedPostsByDestinationAndDate[destination][startDate]) {
            groupedPostsByDestinationAndDate[destination][startDate] = [];
        }

        groupedPostsByDestinationAndDate[destination][startDate].push({
            ...requestedPost,
            endDate,
            duration,
        });
    });

    return (
        <div>

            <h2>See who wanna be your buddy:</h2>
            {Object.keys(groupedPostsByDestinationAndDate).map(destination => (
                <div key={destination}>
                    <h3>{destination}</h3>
                    {Object.keys(groupedPostsByDestinationAndDate[destination]).map(date => (
                        <div key={date}>
                            <h4>{date}</h4>
                            <Row
                                gutter={[24, 24]}
                                style={{
                                    display: 'flex',
                                }}
                            >
                                {groupedPostsByDestinationAndDate[destination][date].map(requestedPost => (
                                    <Col
                                        key={requestedPost.post.travelPostId}
                                        span={8}
                                    >
                                        <Card
                                            style={{
                                                width: 350,
                                            }}
                                            cover={
                                                <Image
                                                    src={requestedPost.requester.profileImage}
                                                    alt="example"
                                                    width={350}
                                                    height={200}
                                                    // Hide overflow
                                                    style={{
                                                        objectFit: 'cover',
                                                        overflow: 'hidden',
                                                    }}

                                                />
                                            }
                                            actions={[
                                                <SlCalender onClick={() => handleAccept(requestedPost.post.travelPostId, requestedPost.requester.userId)} />,
                                                <Button onClick={() => handleReject(requestedPost.post.travelPostId)}>Reject</Button>,
                                            ]}
                                        >
                                            <Meta
                                                // avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                                                title={
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}>

                                                        <BiSolidUser
                                                            style={{
                                                                marginRight: '8px'
                                                            }} />
                                                        {requestedPost.requester.userName}

                                                        {requestedPost.requester.gender === 'Male' ? (
                                                            <TbGenderMale
                                                                style={{
                                                                    marginLeft: '8px'
                                                                }}
                                                            />
                                                        ) : (
                                                            <TbGenderFemale
                                                                style={{
                                                                    marginLeft: '8px'
                                                                }}
                                                            />
                                                        )}
                                                    </span>
                                                }
                                                description={
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}>
                                                        <SlCalender style={{
                                                            marginRight: '10px',
                                                        }} />
                                                        {formatDate(requestedPost.post.startDate)} - {formatDate(requestedPost.post.endDate)}
                                                        {/* Make a space */}
                                                        {'  '}
                                                        ({calculateTripDuration(requestedPost.post.startDate, requestedPost.post.endDate)} Days)
                                                    </span>
                                                }
                                            />
                                        </Card>
                                        <p>Post ID: {requestedPost.post.travelPostId}</p>
                                        <p>Requester: {requestedPost.requester.userName}</p>
                                        <p>Destination: {requestedPost.post.destination}</p>
                                        <p>Buddy Found: {requestedPost.post.buddyFound ? 'Yes' : 'No'}</p>
                                        {/* Add buttons for accept and reject */}
                                        {!requestedPost.post.buddyFound && (
                                            <div>
                                                <Button onClick={() => handleAccept(requestedPost.post.travelPostId, requestedPost.requester.userId)}>Accept</Button>
                                                <Button onClick={() => handleReject(requestedPost.post.travelPostId, requestedPost.requester.userId)}>Reject</Button>
                                            </div>
                                        )}
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default BuddyRequester;

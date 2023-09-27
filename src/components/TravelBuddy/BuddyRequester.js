import React, { useEffect, useState } from 'react';
import { BiSolidUser, BiDetail } from 'react-icons/bi';
import { SlCalender, SlLocationPin, SlInfo } from 'react-icons/sl';
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';
import { Card, Col, Row, Button, Avatar, Image, Tabs, Modal } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const { Meta } = Card;
const { TabPane } = Tabs;

const cardStyle = {
    width: 350,
    marginBottom: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',  // Add shadow
    borderRadius: '8px',  // Rounded corners
};

const dateStyle = {
    backgroundColor: '#f7f8fc',  // Light background
    padding: '5px 10px',  // Padding around the date
    borderRadius: '15px',  // Rounded corners for date
    fontWeight: '600',  // Bold the font
    display: 'inline-block',  // For the padding to take effect
    marginRight: '10px'
};

const iconStyle = {
    fontSize: '20px',  // Increase icon size slightly
    color: '#555',  // Uniform color for icons
};


const avatarIconStyle = {
    marginRight: '20px',
};

const genderIconStyle = {
    marginLeft: '8px',
};

const buttonStyle = {
    borderRadius: '4px',
    margin: '5px',
};

const BuddyRequester = () => {
    const { userId } = useAuth();
    const [requestedPosts, setRequestedPosts] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [acceptedPosts, setAcceptedPosts] = useState([]);
    const [rejectedPosts, setRejectedPosts] = useState([]);
    const [acceptModalVisible, setAcceptModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [currentPostInfo, setCurrentPostInfo] = useState(null); // Store post and requester info


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

    const handleAccept = (postId, requesterId) => {
        // Store the post and requester info
        setCurrentPostInfo({ postId, requesterId });
        // Open the Accept confirmation modal
        setAcceptModalVisible(true);
    };

    const handleReject = (postId, requesterId) => {
        // Store the post and requester info
        setCurrentPostInfo({ postId, requesterId });
        // Open the Reject confirmation modal
        setRejectModalVisible(true);
    };

    const handleAcceptConfirmation = async () => {
        try {
            // Make an API call to accept the buddy request using currentPostInfo
            const result = await axios.post('/api/acceptBuddyRequest', {
                userId: currentPostInfo.requesterId,
                postId: currentPostInfo.postId,
            });
            console.log(result);

            // Close the Accept confirmation modal
            setAcceptModalVisible(false);
            // Update the acceptedPosts state
            setAcceptedPosts((prev) => [...prev, currentPostInfo.postId]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRejectConfirmation = async () => {
        try {
            // Make an API call to reject the buddy request using currentPostInfo
            const result = await axios.post('/api/rejectBuddyRequest', {
                userId: currentPostInfo.requesterId,
                postId: currentPostInfo.postId,
            });
            console.log(result);

            // Close the Reject confirmation modal
            setRejectModalVisible(false);
            // Update the rejectedPosts state
            setRejectedPosts((prev) => [...prev, currentPostInfo.postId]);
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

    const renderCard = (requestedPost) => (
        <Col key={requestedPost.post.travelPostId} span={8} style={{ marginLeft: '50px' }}>
            <Card
                style={cardStyle}
                cover={
                    <Image
                        src={requestedPost.requester.profileImage}
                        alt="Profile"
                        width={350}
                        height={200}
                        style={{ objectFit: 'cover', overflow: 'hidden' }}
                    />
                }
            >
                <Meta
                    title={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <BiSolidUser style={avatarIconStyle} />
                            {requestedPost.requester.userName}
                            {requestedPost.requester.gender === 'Male' ? <TbGenderMale style={genderIconStyle} /> : <TbGenderFemale style={genderIconStyle} />}
                        </span>
                    }
                    description={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <SlCalender style={{ ...iconStyle, marginRight: '10px' }} />
                            <span style={dateStyle}>
                                {formatDate(requestedPost.post.startDate)} - {formatDate(requestedPost.post.endDate)}
                            </span>
                            ({calculateTripDuration(requestedPost.post.startDate, requestedPost.post.endDate)} Days)
                        </span>
                    }
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>

                    {acceptedPosts.includes(requestedPost.post.travelPostId) ? (
                        <Button disabled style={{ ...buttonStyle, flex: 1, lineHeight: 'normal' }}>
                            Accepted
                        </Button>
                    ) : (
                        <Button
                            style={{ ...buttonStyle, flex: 1, marginRight: '5px', lineHeight: 'normal' }}
                            onClick={() => handleAccept(requestedPost.post.travelPostId, requestedPost.requester.userId)}
                            disabled={rejectedPosts.includes(requestedPost.post.travelPostId)}  // Disable if post is rejected
                        >
                            Accept
                        </Button>
                    )}

                    {rejectedPosts.includes(requestedPost.post.travelPostId) ? (
                        <Button disabled style={{ ...buttonStyle, flex: 1, lineHeight: 'normal' }}>
                            Rejected
                        </Button>
                    ) : (
                        <Button
                            style={{ ...buttonStyle, flex: 1, marginLeft: '5px', lineHeight: 'normal' }}
                            onClick={() => handleReject(requestedPost.post.travelPostId, requestedPost.requester.userId)}
                            disabled={acceptedPosts.includes(requestedPost.post.travelPostId)}  // Disable if post is accepted
                        >
                            Reject
                        </Button>
                    )}
                </div>
            </Card>
        </Col>
    );


    const sortByDate = (a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(num => parseInt(num, 10));
        const [dayB, monthB, yearB] = b.split('-').map(num => parseInt(num, 10));

        if (yearA !== yearB) return yearB - yearA;
        if (monthA !== monthB) return monthB - monthA;
        return dayB - dayA;
    };



    return (
        <>
            <Modal
                title="Confirm Acceptance"
                visible={acceptModalVisible}
                onOk={handleAcceptConfirmation}
                onCancel={() => setAcceptModalVisible(false)}
            >
                Are you sure you want to accept this buddy request?
            </Modal>

            <Modal
                title="Confirm Rejection"
                visible={rejectModalVisible}
                onOk={handleRejectConfirmation}
                onCancel={() => setRejectModalVisible(false)}
            >
                Are you sure you want to reject this buddy request?
            </Modal>

            <div>
                <Tabs tabPosition="left">
                    {Object.keys(groupedPostsByDestinationAndDate).map(destination => (
                        <TabPane tab={<span style={{
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block'
                        }} className="tab-title">{destination}</span>} key={destination}
                        >
                            {Object.keys(groupedPostsByDestinationAndDate[destination])
                                .sort(sortByDate)  // Use the custom sorting function
                                .map(date => (
                                    <div key={date}>
                                        <h4
                                            style={{
                                                marginBottom: '30px',
                                                marginTop: '10px',
                                                backgroundColor: '#f7f8fc',
                                                padding: '5px 15px',
                                                borderRadius: '10px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {date}
                                        </h4>
                                        {groupedPostsByDestinationAndDate[destination][date] &&
                                        groupedPostsByDestinationAndDate[destination][date].length > 0 ? (
                                            <Row gutter={[24, 24]} style={{ display: 'flex' }}>
                                                {groupedPostsByDestinationAndDate[destination][date].map(requestedPost => renderCard(requestedPost))}
                                            </Row>
                                        ) : (
                                            <p style={{ marginLeft: '20px' }}>No buddy requests for this date.</p>
                                        )}
                                    </div>
                                ))}
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        </>
    );


}

export default BuddyRequester;

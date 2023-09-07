import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Icon } from 'antd';
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineClockCircle } from 'react-icons/ai';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const RequestingPost = () => {
    const { userId } = useAuth();
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const result = await axios.get('/api/getPendingRequests');
                const userPendingRequests = result.data.filter(pendingRequest => pendingRequest.requester.userId === userId);
                setPendingRequests(userPendingRequests);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPendingRequests();
    }, [userId]);

    const handleCancelRequest = (requestId) => {
        // Handle the cancellation logic here, 
        // perhaps making an API call to remove the request.
        console.log("Cancelling request:", requestId);
    };

    const getStatusIcon = (requestStatus) => {
        switch (requestStatus) {
            case 'Accepted':
                return <AiFillCheckCircle style={{ color: 'green' }} />;
            case 'Rejected':
                return <AiFillCloseCircle style={{ color: 'red' }} />;
            default:
                return <AiOutlineClockCircle style={{ color: 'orange' }} />;
        }
    };



    const { Meta } = Card;

    return (
        <div style={{  width: '100%' }}>
            <Row gutter={[16, 16]} style={{ display: 'flex' }}>
                {pendingRequests.map((request) => (
                    <Col key={request.post.travelPostId} span={12}>
                        <Card style={{ minHeight: '200px', maxHeight: '350px', width: '600px' }}>
                            <Meta
                                title={`Post ID: ${request.post.travelPostId}`}
                                description={`Owner: ${request.post.creator.userName}`}
                            />
                            <p>Destination: {request.post.destination}</p>
                            <p>Buddy Found: {request.post.buddyFound ? 'Yes' : 'No'}</p>
                            <p>Status:
                                {request.requestStatus === 'Accepted'
                                    ? 'Accepted'
                                    : (request.requestStatus === 'Rejected'
                                        ? 'Rejected'
                                        : 'Still Pending')
                                }
                                {getStatusIcon(request.requestStatus)}
                            </p>


                            <Button
                                onClick={() => handleCancelRequest(request.post.travelPostId)}
                                disabled={request.requestStatus === 'Rejected' || request.requestStatus === 'Accepted'}
                            >
                                Cancel
                            </Button>

                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}


export default RequestingPost;

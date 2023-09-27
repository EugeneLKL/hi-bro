import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Modal, Pagination, Avatar, Space, Image, message } from 'antd';
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { CiCalendarDate, CiSquareInfo, CiUser } from 'react-icons/ci';
import { HiMagnifyingGlass } from 'react-icons/hi2'
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import ViewRequestingDetailsModal from './viewRequestingDetailsModal'; // Adjust the path as needed



const RequestingPost = () => {
    const { userId } = useAuth();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [cancelledRequests, setCancelledRequests] = useState([]); // New state to track cancelled requests
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDetails, setCurrentDetails] = useState(null);
    const [requestStatus, setRequestStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = pendingRequests.slice(indexOfFirstPost, indexOfLastPost);




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
        // Confirmation before canceling the request
        console.log('ID:', requestId);
        Modal.confirm({
            title: 'Cancel requesting?',
            content: 'Once canceled, you will be required to make a new requestment again.',
            onOk: async () => {
                try {
                    await axios.delete(`/api/deleteBuddyRequest/${requestId}`);
                    setCancelledRequests(prev => [...prev, requestId]);
                    message.success("Successfully cancelled the request!"); // This line displays the success message.
                } catch (error) {
                    console.log("Error while cancelling the request:", error);
                }
            },
        });
    };
    

    const handleViewUserDetails = (travelDetails, requestStatus) => {
        setCurrentDetails(travelDetails);
        setRequestStatus(requestStatus);
    };


    const handleCloseModal = () => {
        setCurrentDetails(null);
        setRequestStatus('');
    };

    const getStatusIcon = (requestStatus) => {
        switch (requestStatus) {
            case 'Accepted':
                return <AiFillCheckCircle style={{ color: '#90EE90', marginRight: '5px' }} />;
            case 'Rejected':
                return <AiFillCloseCircle style={{ color: 'red', marginRight: '5px' }} />;
            default:
                return <AiOutlineClockCircle style={{ color: 'orange', marginRight: '5px' }} />;
        }
    };

    const { Meta } = Card;

    return (
        <div style={{ width: '100%' }}>
            <Row gutter={[16, 16]} style={{ display: 'flex' }}>
                {currentPosts.map((request) => (
                    <Col key={request.post.travelPostId} span={12}>
                        <Card
                            style={{
                                minHeight: '230px',
                                maxHeight: '350px',
                                width: '600px',
                            }}
                        >
                            <Meta
                                title={
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}>
                                        {/* Title */}
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <MdOutlineTravelExplore
                                                style={{
                                                    marginRight: '8px'
                                                }} />
                                            {` ${request.post.destination}`}
                                        </span>

                                        {/* Description */}
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '0.85rem',
                                                color: 'rgba(0, 0, 0, 0.35)'
                                            }}>
                                            {getStatusIcon(request.requestStatus)}
                                            {cancelledRequests.includes(request.buddyRequestId)
                                                ? 'Cancelled'
                                                : (request.requestStatus === 'Accepted'
                                                    ? 'Accepted'
                                                    : (request.requestStatus === 'Rejected'
                                                        ? 'Rejected'
                                                        : 'Pending')
                                                )
                                            }
                                        </span>

                                    </div>
                                }
                            />
                            <hr style={{
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                borderWidth: '0.5px',
                                margin: '15px 0'
                            }} />

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                <CiUser
                                    style={{
                                        marginRight: '10px'
                                    }} />
                                {request.post.creator.userName}
                            </span>

                            {/* Displaying start and end dates */}
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '8px',
                                }}>
                                <CiCalendarDate
                                    style={{
                                        marginRight: '10px'
                                    }} />
                                {` ${new Date(request.post.startDate).toLocaleDateString()} - ${new Date(request.post.endDate).toLocaleDateString()}`}
                            </span>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '8px',
                                }}>
                                <CiSquareInfo
                                    style={{
                                        marginRight: '10px'
                                    }} />
                                {request.post.buddyFound ?
                                    'He/She seems to have found a buddy already . . .' :
                                    'He/She is still searching for a buddy . . .'}
                            </span>

                            <Button
                                onClick={() => handleViewUserDetails(request.post, request.requestStatus)}
                                style={{ position: 'absolute', right: '120px', bottom: '10px' }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>

                                    View Details
                                    <HiMagnifyingGlass
                                        style={{
                                            marginLeft: '10px'
                                        }} />
                                </span>

                            </Button>

                            <Button
                                danger
                                onClick={() => handleCancelRequest(request.buddyRequestId)}
                                disabled={cancelledRequests.includes(request.buddyRequestId) || request.requestStatus === 'Rejected' || request.requestStatus === 'Accepted'}
                                style={{ position: 'absolute', right: '20px', bottom: '10px' }}

                            >
                                {cancelledRequests.includes(request.buddyRequestId) ? 'Cancelled' : 'Cancel'}
                            </Button>






                        </Card>

                    </Col>
                ))}
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}>

                <Pagination
                    current={currentPage}
                    total={pendingRequests.length}
                    pageSize={postsPerPage}
                    onChange={(page) => setCurrentPage(page)}
                    style={{
                        marginTop: '20px',
                    }}
                />
            </div>

            {
                currentDetails && (
                    <ViewRequestingDetailsModal
                        visible={!!currentDetails}
                        onClose={handleCloseModal}
                        travel={currentDetails}
                        status={requestStatus}
                    />
                )
            }
        </div>
    );
}

export default RequestingPost;

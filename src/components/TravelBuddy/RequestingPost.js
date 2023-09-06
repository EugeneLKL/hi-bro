import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const RequestingPost = () => {
    const { userId } = useAuth();
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const result = await axios.get('/api/getPendingRequests');
                // Filter the requested posts that belong to the logged-in user
                const userPendingRequests = result.data.filter(pendingRequest => pendingRequest.requester.userId === userId);
                setPendingRequests(userPendingRequests);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPendingRequests()
    }, [userId]);

    return (
        <div>
            <h2>Pending Buddy Requests:</h2>
            {pendingRequests.map((request) => (
                <div key={request.post.travelPostId}>
                    <h3>Post ID: {request.post.travelPostId}</h3>
                    <p>Owner: {request.post.creator.userName}</p>
                    <p>Destination: {request.post.destination}</p>
                    {/* Display the buddyfound value */}
                    <p>Buddy Found: {request.post.buddyFound ? 'Yes' : 'No'}</p>
                    {request.post.buddyFound ? (
                        request.requestStatus === 'Accepted' ? (
                            <p>Status: Accepted</p>
                        ) : (
                            <p>Status: Rejected</p>
                        )
                    ) : (
                        <p>Status: Still Pending</p>
                    )}

                </div>
            ))}
        </div>
    );
}

export default RequestingPost;

import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const BuddyMatched = () => {
    const { userId } = useAuth();
    const [matchedBuddies, setMatchedBuddies] = useState([]);

    useEffect(() => {
        const fetchBuddyMatched = async () => {
            try {
                const response = await axios.get('/api/getBuddyFoundPosts');
                // Filter the result based on creator ID or buddy ID
                const filteredBuddies = response.data.filter(buddy =>
                    buddy.creator.userId === userId || buddy.buddyId === userId
                );

                setMatchedBuddies(filteredBuddies);
            } catch (error) {
                console.log(error);
            }
        }

        fetchBuddyMatched();
    }, []);

    const handleUnpair = async (buddyId) => {
        try {
            const response = await axios.post('/api/unpairBuddy', { buddyId });

            if (response.status === 200) {
                // Remove the unpaired buddy from the local state
                setMatchedBuddies(prevBuddies =>
                    prevBuddies.filter(buddy => buddy.id !== buddyId)
                );
            } else {
                console.log("Failed to unpair:", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <h2>Matched Buddies</h2>
            <Row gutter={[16, 16]}>
                {matchedBuddies.map(buddy => (
                    <Col key={buddy.id} xs={24} sm={12} md={8} lg={6}>
                        <Card title={buddy.name}>
                            <p>Name: {buddy.creator.userName}</p>
                            <p>Email: {buddy.creator.userEmail}</p>
                            {/* Other buddy information */}


                            <Button type="primary" onClick={() => handleUnpair(buddy.id)}>
                                Unpair Buddy
                            </Button>

                        </Card>

                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default BuddyMatched;

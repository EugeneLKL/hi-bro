import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const BuddyMatched = () => {
    const { userId, userName } = useAuth();
    const [matchedBuddies, setMatchedBuddies] = useState([]);

    useEffect(() => {
        const fetchBuddyMatched = async () => {
            try {
                const response = await axios.get('/api/getBuddyFoundPosts');
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

    const redirectToWhatsApp = (phoneNumber) => {
        console.log(userName);
        const text = `Hi, I'm reaching out regarding our matched trip on the Hi-Bro (Travel Buddy) platform. Nice to meet you! I'm ${userName}!`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    }
    

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

                            <Button 
                                style={{ marginRight: '10px' }} 
                                type="primary" 
                                onClick={() => redirectToWhatsApp(buddy.creator.phoneNum)}>
                                Contact on WhatsApp
                            </Button>

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
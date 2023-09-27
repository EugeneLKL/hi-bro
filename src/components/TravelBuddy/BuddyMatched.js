import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, Row, Button, Tabs, Image, message, Modal, Empty } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { AiOutlineWhatsApp, AiOutlineMail } from 'react-icons/ai'
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';
import { BiSolidUser, BiDetail } from 'react-icons/bi'

const { Meta } = Card;

const BuddyMatched = () => {
    const { userId, userName } = useAuth();
    const [matchedBuddies, setMatchedBuddies] = useState([]);
    const [searchBuddies, setSerachBuddies] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentBuddyToUnpair, setCurrentBuddyToUnpair] = useState(null);

    const showModal = (buddy) => {
        setCurrentBuddyToUnpair(buddy);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        if (currentBuddyToUnpair) {
            handleUnpair(currentBuddyToUnpair);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentBuddyToUnpair(null);
    };


    const avatarIconStyle = {
        marginRight: '20px',
    };

    const genderIconStyle = {
        marginLeft: '8px',
    };

    useEffect(() => {
        const fetchBuddyMatched = async () => {
            try {
                const response = await axios.get('/api/getBuddyFoundPosts');
                const filteredBuddies = response.data.filter(buddy =>
                    buddy.creator.userId !== userId && buddy.buddyId === userId
                );

                setMatchedBuddies(filteredBuddies);

                const filteredPost = response.data.filter(buddy =>
                    buddy.creator.userId === userId && buddy.buddyFound === true
                );

                setSerachBuddies(filteredPost);

            } catch (error) {
                console.log(error);
            }
        }

        fetchBuddyMatched();
    }, []);

    useEffect(() => {
        const fetchBuddyMatched = async () => {
            try {
                const response = await axios.get('/api/getTravelBuddyRequest');
                // const filteredBuddies = response.data.filter(buddy =>
                //     buddy.creator.userId !== userId && buddy.buddyId === userId
                // );

                // setMatchedBuddies(filteredBuddies);
                console.log('request response', response.data);

                // filter the data by the requesterid is me and the status should be 'accepted'
                const filteredBuddies = response.data.filter(buddy =>
                    buddy.requesterId === userId && buddy.requestStatus === 'Accepted'
                );

                console.log('filter: ', filteredBuddies);

                // if (!!response?.data[0]) {
                //     let newArray = [];
                //     for (let i = 0; i < filteredBuddies.length; i++) {
                //         const response = await axios.get(`/api/getTravelBuddyPost/${filteredBuddies[i].postId}`);
                //         newArray.push(response.data);
                //     }
                //     setMatchedBuddies(newArray);
                // }

            } catch (error) {
                console.log(error);
            }
        }

        fetchBuddyMatched();
    }, []);

    console.log('MatchedBuddies: ', matchedBuddies);
    console.log('SearchBuddies: ', searchBuddies);

    const { TabPane } = Tabs;

    const handleUnpair = async (buddy) => {
        try {
            // Unpairing action (you've commented it out in the provided code)
            await axios.put(`/api/unpair/${buddy.travelPostId}`, {
                buddyFound: false,
                buddyId: null,
            });

            // Delete the record from the buddyRequest
            await axios.delete(`/api/unpairBuddyRequest`, {
                data: {
                    postId: buddy.travelPostId,
                    requesterId: userId,
                }
            });

            // Show a success message for 2 seconds
            message.success('Successfully unpaired!', 2);

            // Use setTimeout to wait for 2 seconds before filtering out the matchedBuddies
            setTimeout(() => {
                const newMatchedBuddies = matchedBuddies.filter(matchedBuddy => matchedBuddy.travelPostId !== buddy.travelPostId);
                setMatchedBuddies(newMatchedBuddies);
            }, 2000);

        } catch (error) {
            console.log(error);
            message.error('Error occurred while unpairing. Please try again.', 2);
        }
    };



    const redirectToWhatsApp = (phoneNumber) => {
        console.log(userName);
        const text = `Hi, I'm reaching out regarding our matched trip on the Hi-Bro (Travel Buddy) platform. Nice to meet you! I'm ${userName}!`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    };


    const groupedBuddiesByDestinationAndDate = {};

    matchedBuddies.forEach(buddy => {
        const destination = buddy.destination;
        const startDate = formatDate(buddy.startDate);

        if (!groupedBuddiesByDestinationAndDate[destination]) {
            groupedBuddiesByDestinationAndDate[destination] = {};
        }

        if (!groupedBuddiesByDestinationAndDate[destination][startDate]) {
            groupedBuddiesByDestinationAndDate[destination][startDate] = [];
        }

        groupedBuddiesByDestinationAndDate[destination][startDate].push(buddy);
    });

    const renderCard = (buddy) => (
        <Col key={buddy.id} span={8}>
            <Card title={buddy.name}>

                <Meta
                    avatar={
                        <Image src={buddy.creator.profileImage}
                            alt='Profile'
                            className='profile-profilePic'
                            width={70}
                            height={70}
                            preview={false}
                            style={{
                                // marginLeft: 25
                            }}
                        />}
                    title={
                        <span style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <BiSolidUser style={avatarIconStyle} />
                            {buddy.creator.userName}
                            {buddy.creator.gender === 'Male' ? <TbGenderMale style={genderIconStyle} /> : <TbGenderFemale style={genderIconStyle} />}
                        </span>
                    }
                    description={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <AiOutlineMail style={{ marginRight: '20px' }} /> {buddy.creator.userEmail}
                        </span>
                    }
                />


                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>

                    <Button
                        style={{ display: 'flex', alignItems: 'center', }}
                        onClick={() => redirectToWhatsApp(buddy.creator.phoneNum)}
                        icon={<AiOutlineWhatsApp style={{ color: '#25D366' }} />}>
                        Contact
                    </Button>

                    <Button type="primary" danger onClick={() => showModal(buddy)}>
                        Unpair Buddy
                    </Button>

                </div>
            </Card>
        </Col>
    );

    for (const destination in groupedBuddiesByDestinationAndDate) {
        const sortedDates = Object.keys(groupedBuddiesByDestinationAndDate[destination]).sort((a, b) => {
            const dateA = new Date(a.split('-').reverse().join('-'));
            const dateB = new Date(b.split('-').reverse().join('-'));
            return dateB - dateA;
        });

        const sortedBuddiesForDestination = {};
        sortedDates.forEach(date => {
            sortedBuddiesForDestination[date] = groupedBuddiesByDestinationAndDate[destination][date];
        });

        groupedBuddiesByDestinationAndDate[destination] = sortedBuddiesForDestination;
    }

    const confirmationModal = (
        <Modal
            title="Confirm Action"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p>Are you sure you want to unpair?</p>
        </Modal>
    );
    
// Define the message to display when there are no matched buddies
const noBuddiesMatchedMessage = (
    <Empty description="No buddies matched yet. Try exploring the posts more." />
);

return (
    <div>
        {confirmationModal}
        <Tabs tabPosition="left">
            {Object.keys(groupedBuddiesByDestinationAndDate).map(destination => (
                <TabPane tab={<span style={{
                    maxWidth: '150px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-block'
                }} className="tab-title">{destination}</span>} key={destination}>
                    {Object.keys(groupedBuddiesByDestinationAndDate[destination]).map(date => (
                        <div key={date}>
                            <h4 style={{
                                marginBottom: '30px',
                                marginTop: '10px',
                                backgroundColor: '#f7f8fc',
                                padding: '5px 15px',
                                borderRadius: '10px',
                                fontWeight: '600'
                            }}>
                                {date}
                            </h4>
                            {groupedBuddiesByDestinationAndDate[destination][date].length > 0 ? (
                                <Row gutter={[16, 16]}>
                                    {groupedBuddiesByDestinationAndDate[destination][date].map(buddy => renderCard(buddy))}
                                </Row>
                            ) : (
                                noBuddiesMatchedMessage
                            )}
                        </div>
                    ))}
                </TabPane>
            ))}
        </Tabs>
    </div>
);

}

export default BuddyMatched;
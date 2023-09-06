import React from 'react';
import { Tabs } from 'antd';
import TravelBuddyModalForm from "../components/TravelBuddy/TravelBuddyModalForm";
import { RiAddBoxFill } from "react-icons/ri";
import { useAuth } from "../AuthContext";
import TravelBuddyCardPost from "../components/TravelBuddy/TravelBuddyCardPost";
import TravelPosted from "../components/TravelBuddy/TravelPosted";
import { RiPassPendingLine, RiUserAddLine } from 'react-icons/ri';

const { TabPane } = Tabs;

const TravelPost = () => {
    return (
        <div className="Travel-Post-Container" style={{ width: '80%', marginLeft: '1%', marginBottom: '5%' }}>
            <h1>Travel Posts</h1>
            {/* TODO: Change to 1 for dicover more */}
            <Tabs defaultActiveKey="2">
                <TabPane tab={<span style={{ display: 'flex', alignItems: 'center' }}><RiAddBoxFill style={{ marginRight: '8px' }} /> Discover Post</span>} key="1">
                    <TravelBuddyModalForm />
                    
            {/* Content goes here */}
            <div style={{ marginTop: '20px', marginLeft: '20px' }}>
                <TravelBuddyCardPost />
            </div>
                </TabPane>
                <TabPane tab={<span style={{ display: 'flex', alignItems: 'center' }}><RiPassPendingLine style={{ marginRight: '8px' }} /> My Post</span>} key="2">
                    <TravelPosted />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default TravelPost;

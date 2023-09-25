import React from 'react';
import { Tabs, Layout, Space } from 'antd';
import TravelBuddyModalForm from "../components/TravelBuddy/TravelBuddyModalForm";
import { RiAddBoxFill } from "react-icons/ri";
import { useAuth } from "../AuthContext";
import TravelBuddyCardPost from "../components/TravelBuddy/TravelBuddyCardPost";
import TravelPosted from "../components/TravelBuddy/TravelPosted";
import { RiPassPendingLine, RiUserAddLine } from 'react-icons/ri';
import SideBar from "../components/common/sideBarCK";

const { TabPane } = Tabs;

const TravelPost = () => {
    return (
        <div
            className="Travel-Post-Container "
            style={{
                width: '100%',
                display: 'flex'
            }}
        >
            <SideBar />

            <div
                style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '1%',
                    marginBottom: '5%',
                }}
            >
                <Tabs defaultActiveKey="1">
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
        </div>
    );
}

export default TravelPost;

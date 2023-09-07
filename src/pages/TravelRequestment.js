import React from 'react';
import { Tabs } from 'antd';
import BuddyMatched from "../components/TravelBuddy/BuddyMatched";
import BuddyRequester from "../components/TravelBuddy/BuddyRequester";
import RequestingPost from "../components/TravelBuddy/RequestingPost";
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import { RiPassPendingLine, RiUserAddLine } from 'react-icons/ri'
import { TbUsers } from 'react-icons/tb'
import SideBar from "../components/common/sideBarCK";


const { TabPane } = Tabs;

const TravelRequestment = () => {
    return (
        <div
            className="Travel-Requestment-Container"
            style={{
                width: '100%',
                display: 'flex',
            }}>
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
                    <TabPane tab={<span style={{ display: 'flex', alignItems: 'center' }}><RiUserAddLine style={{ marginRight: '8px' }} /> Requester</span>} key="1">
                        <BuddyRequester />
                    </TabPane>
                    <TabPane tab={<span style={{ display: 'flex', alignItems: 'center' }}><RiPassPendingLine style={{ marginRight: '8px' }} /> Requesting</span>} key="2">
                        <RequestingPost />
                    </TabPane>
                    <TabPane tab={<span style={{ display: 'flex', alignItems: 'center' }}><TbUsers style={{ marginRight: '8px' }} /> Buddy</span>} key="3">
                        <BuddyMatched />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default TravelRequestment;

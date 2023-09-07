import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Modal, Form, Checkbox, Col, Row, Input, Tooltip } from 'antd';
import { PiPuzzlePieceLight } from 'react-icons/pi';
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { AiOutlinePlus } from 'react-icons/ai'
import moment from 'moment'; // Import the moment library
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const CheckboxGroup = Checkbox.Group;

const TravelPostEditModal = (props) => {

    const { userId } = useAuth();
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [loading, setLoading] = useState(false);
    const [travelPost, setTravelPost] = useState({});

    // Get travelPost Details
    const [initialFormValues, setInitialFormValues] = useState({});

    useEffect(() => {
        const fetchTravelPost = async () => {
            try {
                const response = await axios.get(`/api/getTravelBuddyPostDetails/${props.postId}`, {
                    params: { travelPostId: props.postId },
                });
                setTravelPost(response.data);
                console.log(travelPost);
                // Modify this part to handle the format
                setTimeout(() => {
                form.setFieldsValue({
                    buddyPreference: response.data.buddyPreference,
                    additionalInfo: response.data.additionalInfo,
                    destination: response.data.destination, 
                });
            }, 0);
                console.log(response.data.destination);
            } catch (error) {
                console.error("Error fetching travel post details:", error);
                // Consider giving feedback to the user here.
            }
        };
        fetchTravelPost();
    }, [props.postId, form]);
    





    const { RangePicker } = DatePicker;

    const disabledDate = current => {
        return current && current < moment().startOf('day');
    };

    const rangePickerValidator = (rule, value) => {
        if (!value || value.length !== 2) {
            return Promise.reject('Please select a date range!');
        }
        if (value[0] >= value[1]) {
            return Promise.reject('Start date cannot be later than or equal to end date!');
        }
        if (value[0] < moment().startOf('day')) {
            return Promise.reject('Start date cannot be earlier than today!');
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        // TODO: Implement form submission logic
        setLoading(true);
        // e.g., await saveTravelPost(values);
        setLoading(false);
    };
    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            title={travelPost.destination}
            width={650}
            footer={[
                <Button key="cancel" onClick={props.onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" loading={loading} onClick={() => form.submit()}>
                    Confirm
                </Button>,
            ]}
        >
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 25 }}
                layout="vertical"
                scrollToFirstError
            >
                <Form.Item
                    name="date"
                    label={
                        <span
                            style={{
                                marginTop: '10px',
                                marginLeft: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: "0.5rem",
                            }}
                        >
                            <CiCalendarDate size={24} />
                            Date
                        </span>
                    }
                    rules={[
                        {
                            validator: rangePickerValidator,
                        },
                    ]}
                >
                    <RangePicker format="DD-MM-YYYY" disabledDate={disabledDate} />
                </Form.Item>


                <Form.Item
    name="destination"
    label={
        <span
            style={{
                marginTop: '10px',
                marginLeft: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: "0.5rem",
            }}
        >
            <CiLocationOn size={24} />
            Destination
        </span>
    }
>
<Tooltip title="You cannot change your destination">
    <Input 
        style={{
            backgroundColor: '#f5f5f5',
            borderColor: '#d9d9d9',
            cursor: 'not-allowed',
            '&:hover': {
                borderColor: '#d9d9d9'
            }
        }} 
        readOnly 
        value={travelPost.destination}
    />
</Tooltip>

</Form.Item>




                <Form.Item
                    name="buddyPreference"
                    label={
                        <span
                            style={{
                                marginTop: '10px',
                                marginLeft: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: "0.5rem",
                            }}
                        >
                            <PiPuzzlePieceLight size={24} />
                            Preference
                        </span>
                    }
                >
                    <CheckboxGroup
                        style={{ marginLeft: '3px', width: 600 }}
                    >
                        <Row>
                            <Col span={7}>
                                <Checkbox value="Shopping" style={{ lineHeight: '32px' }} defaultChecked >
                                    Shopping
                                </Checkbox>
                            </Col>
                            <Col span={7}>
                                <Checkbox value="Energy" style={{ lineHeight: '32px' }} defaultChecked>
                                    Energy
                                </Checkbox>
                            </Col>
                            <Col span={7}>
                                <Checkbox value="Safety Consciousness" style={{ lineHeight: '32px' }}>
                                    Safety Consciousness
                                </Checkbox>
                            </Col>
                            <Col span={7}>
                                <Checkbox value="Photography" style={{ lineHeight: '32px' }}>
                                    Photography
                                </Checkbox>
                            </Col>
                            <Col span={7}>
                                <Checkbox value="Food" style={{ lineHeight: '32px' }}>
                                    Food
                                </Checkbox>
                            </Col>

                            <Col span={7}>
                                <Checkbox value="Languages" style={{ lineHeight: '32px' }}>
                                    Languages
                                </Checkbox>
                            </Col>
                        </Row>
                    </CheckboxGroup>
                </Form.Item>

                <Form.Item
                    name='additionalInfo'
                    label={
                        <span
                            style={{
                                marginTop: '10px',
                                marginLeft: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: "0.5rem",
                            }}
                        >
                            <IoIosInformationCircleOutline size={24} />
                            Others
                        </span>
                    }>
                    <TextArea
                        rows={3}
                        placeholder={'Add any additional information here...'}
                        defaultValue={travelPost.additionalInfo}
                    />
                </Form.Item>
            </Form>
        </Modal>

    );
}

export default TravelPostEditModal;
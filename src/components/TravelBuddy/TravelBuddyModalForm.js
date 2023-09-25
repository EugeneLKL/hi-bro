import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Modal, Form, Cascader, Checkbox, Col, Row, Input, AutoComplete } from 'antd';
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { PiPuzzlePieceLight } from 'react-icons/pi';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { AiOutlinePlus } from 'react-icons/ai'
import Confirmation from '../common/Confirmation';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const CheckboxGroup = Checkbox.Group;

const TravelBuddyModalForm = () => {

    // Get user id
    const { userId, rerender, setRerender } = useAuth();

    const [modal, contextHolder] = Modal.useModal();

    const config = {
        title: 'Confirm posting?',
        content: (
            <>
                {/* Display the welcoming message */}
                <p>Are you sure you want to post it?</p>
            </>
        ),
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();

    const { TextArea } = Input;


    const [selectedValues, setSelectedValues] = useState();

    const handleCheckboxChange = (checkedValues) => {
        setSelectedValues(checkedValues);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const { RangePicker } = DatePicker;

    const disabledDate = current => {
        return current && current < Date.now();
    };

    const rangePickerValidator = (rule, value) => {
        if (!value) {
            return Promise.reject('Please select a date!');
        }
        if (value[0] > value[1]) {
            return Promise.reject('Start date cannot be later than end date!');
        }
        if (value[0] < Date.now()) {
            return Promise.reject('Start date cannot be earlier than today!');
        }
        return Promise.resolve();
    };

    const destinationValidator = (rule, value) => {
        if (!value) {
            return Promise.reject('Please select a destination!');
        } else {
            return Promise.resolve();
        }
    };

    const flattenDestinations = (arr) => {
        let result = [];
        for (const item of arr) {
            if (item.children) {
                const childItems = flattenDestinations(item.children).map(child => ({
                    value: `${item.label} - ${child.label}`,
                    label: `${item.label} - ${child.label}`
                }));
                result.push(...childItems);
            } else {
                result.push({
                    value: item.label,
                    label: item.label
                });
            }
        }
        return result;
    };


    const destinations = [
        {
            value: 'Kuala Lumpur',
            label: 'Kuala Lumpur',
        },
        {
            value: 'Johor',
            label: 'Johor',
            children: [
                {
                    value: 'Johor Bahru',
                    label: 'Johor Bahru',
                },
                {
                    value: 'Batu Pahat',
                    label: 'Batu Pahat',
                },
                {
                    value: 'Muar',
                    label: 'Muar',
                },
                {
                    value: 'Kluang',
                    label: 'Kluang',
                },
                {
                    value: 'Pontian',
                    label: 'Pontian',
                },
            ],
        },
        {
            value: 'Kedah',
            label: 'Kedah',
            children: [
                {
                    value: 'Alor Setar',
                    label: 'Alor Setar',
                },
                {
                    value: 'Sungai Petani',
                    label: 'Sungai Petani',
                },
                {
                    value: 'Kulim',
                    label: 'Kulim',
                },
                {
                    value: 'Langkawi',
                    label: 'Langkawi',
                }
            ],
        },
        {
            value: 'Kelantan',
            label: 'Kelantan',
            children: [
                {
                    value: 'Kota Bharu',
                    label: 'Kota Bharu',
                },
                {
                    value: 'Pasir Mas',
                    label: 'Pasir Mas',
                },
                {
                    value: 'Tanah Merah',
                    label: 'Tanah Merah',
                },
                {
                    value: 'Machang',
                    label: 'Machang',
                }
            ],
        },
        {
            value: 'Malacca',
            label: 'Malacca (Melaka)',
            children: [
                {
                    value: 'Malacca City',
                    label: 'Malacca City (Bandaraya Melaka)',
                },
                {
                    value: 'Alor Gajah',
                    label: 'Alor Gajah',
                }
            ],
        },
        {
            value: 'Negeri Sembilan',
            label: 'Negeri Sembilan',
            children: [
                {
                    value: 'Seremban',
                    label: 'Seremban',
                },
                {
                    value: 'Port Dickson',
                    label: 'Port Dickson',
                },
                {
                    value: 'Nilai',
                    label: 'Nilai',
                }
            ],
        },
        {
            value: 'Pahang',
            label: 'Pahang',
            children: [
                {
                    value: 'Kuantan',
                    label: 'Kuantan',
                },
                {
                    value: 'Temerloh',
                    label: 'Temerloh',
                },
                {
                    value: 'Bentong',
                    label: 'Bentong',
                },
                {
                    value: 'Raub',
                    label: 'Raub',
                }
            ]
        },
        {
            value: 'Perak',
            label: 'Perak',
            children: [
                {
                    value: 'Ipoh',
                    label: 'Ipoh',
                },
                {
                    value: 'Taiping',
                    label: 'Taiping',
                },
                {
                    value: 'Teluk Intan',
                    label: 'Teluk Intan',
                },
                {
                    value: 'Lumut',
                    label: 'Lumut',
                }
            ]
        },
        {
            value: 'Perlis',
            label: 'Perlis',
            children: [
                {
                    value: 'Kangar',
                    label: 'Kangar',
                },
                {
                    value: 'Arau',
                    label: 'Arau',
                }
            ]
        },
        {
            value: 'Penang',
            label: 'Penang (Pulau Pinang)',
            children: [
                {
                    value: 'George Town',
                    label: 'George Town',
                },
                {
                    value: 'Butterworth',
                    label: 'Butterworth',
                },
                {
                    value: 'Bayan Lepas',
                    label: 'Bayan Lepas',
                }
            ],
        },
        {
            value: 'Sarawak',
            label: 'Sarawak',
            children: [
                {
                    value: 'Kuching',
                    label: 'Kuching',
                },
                {
                    value: 'Miri',
                    label: 'Miri',
                },
                {
                    value: 'Sibu',
                    label: 'Sibu',
                },
                {
                    value: 'Bintulu',
                    label: 'Bintulu',
                }
            ],
        },
        {
            value: 'Sabah',
            label: 'Sabah',
            children: [
                {
                    value: 'Kota Kinabalu',
                    label: 'Kota Kinabalu',
                },
                {
                    value: 'Sandakan',
                    label: 'Sandakan',
                },
                {
                    value: 'Tawau',
                    label: 'Tawau',
                },
                {
                    value: 'Lahad Datu',
                    label: 'Lahad Datu',
                }
            ],
        },
        {
            value: 'Selangor',
            label: 'Selangor',
            children: [
                {
                    value: 'Shah Alam',
                    label: 'Shah Alam',
                },
                {
                    value: 'Petaling Jaya',
                    label: 'Petaling Jaya',
                },
                {
                    value: 'Subang Jaya',
                    label: 'Subang Jaya',
                },
                {
                    value: 'Klang',
                    label: 'Klang',
                }
            ],
        },
        {
            value: 'Terengganu',
            label: 'Terengganu',
            children: [
                {
                    value: 'Kuala Terengganu',
                    label: 'Kuala Terengganu',
                },
                {
                    value: 'Kuala Nerus',
                    label: 'Kuala Nerus',
                },
                {
                    value: 'Kemaman',
                    label: 'Kemaman',
                },
                {
                    value: 'Dungun',
                    label: 'Dungun',
                }
            ],
        }
    ];

    const flatDestinations = flattenDestinations(destinations);

    // Useefftc for getting trails name from hiking database
    const [trails, setTrails] = useState([]);
    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await axios.get('/api/trails');
                setTrails(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTrails();
    }, []);

    const trailOptions = trails.map(trail => ({
        value: trail.trailName,
        label: trail.trailName
    }));

    const combinedOptions = [...flattenDestinations(destinations), ...trailOptions];



    // onFinish
    const onFinish = async (values) => {
        console.log('Success:', values);
        // Console log each values
        console.log(values.date[0].format('YYYY-MM-DD'));
        console.log(values.date[1].format('YYYY-MM-DD'));
        console.log(values.destination);
        console.log(values.buddyPreference);
        console.log(values.additonalInfo);

        // Get the destination
        let destination = values.destination;

        const startDate = values.date[0].format('YYYY-MM-DD');
        const endDate = values.date[1].format('YYYY-MM-DD');

        let preference = values.buddyPreference || [];

        const additionalInfo = values.additonalInfo;

        // if additional info is empty
        if (values.additonalInfo === undefined) {
            values.additonalInfo = "None";
        }

        // if preference is empty
        if (preference === undefined) {
            preference = [];
        }
        console.log("preference", preference);


        const newPost = {
            startDate,
            endDate,
            destination,
            buddyPreference: JSON.stringify(preference),
            additionalInfo,
            userId
        };

        console.log("newpost: ", newPost);
        // Check the type of startdate in the newPost
        console.log(typeof newPost.startDate);

        modal.confirm({
            title: 'Confirm posting?',
            content: 'Are you sure you want to post it?',
            onOk: async () => {
                try {
                    // If user confirms, then make the API call
                    const response = await axios.post('/api/createTravelBuddyPost', newPost);
                    console.log(response);
                    setIsModalOpen(false);
                    setRerender(!rerender);
                } catch (error) {
                    console.error('Error creating post:', error);
                    // Handle error. E.g. show notification to user
                }
            },
            onCancel: () => {
                console.log('User cancelled the operation');
                // Optionally reset form or other actions
            }
        });


        // Close the modal

    }

    return (
        <>
            <Button
                type="primary"
                onClick={showModal}
                style={{ marginLeft: '20px' }}>
                <AiOutlinePlus style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }} />
            </Button>
            <Modal
                title="Let's Travel Together!"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
                footer={null}
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
                        // tooltip="Plan your trip start from next day!"
                        rules={[
                            {
                                validator: rangePickerValidator,
                            },
                        ]}
                    >
                        < RangePicker disabledDate={disabledDate} />
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
                        rules={[
                            {
                                validator: destinationValidator,
                            },
                        ]}
                    >
                        <AutoComplete
                            options={combinedOptions.map(option => ({ value: option.label }))}
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().includes(inputValue.toUpperCase())
                            }
                        />
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
                        name='additonalInfo'
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
                        />
                    </Form.Item>

                    <Row>
                        <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* Clear fields button */}
                            <Form.Item>
                                <Button onClick={() => form.resetFields()} style={{ marginRight: '8px' }}>
                                    Clear
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Post!
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>



                </Form>
                {contextHolder}

            </Modal>
        </>
    );
};

export default TravelBuddyModalForm;
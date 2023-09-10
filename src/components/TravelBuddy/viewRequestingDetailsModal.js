import { Modal, Image, Col, Row, Divider, Space, Tag } from 'antd';
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';

import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { CiCalendarDate, CiSquareInfo, CiUser, CiLocationArrow1 } from 'react-icons/ci';
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { PiGenderFemaleThin, PiGenderMaleThin, PiCakeThin } from 'react-icons/pi'

const ViewRequestingDetailsModal = ({ visible, onClose, travel }) => {

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const calculateAge = (birthDateStr) => {
        const today = new Date();
        const birthDate = new Date(birthDateStr);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const calculateDuration = (startDateStr, endDateStr) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        const durationInMilliseconds = endDate - startDate;
        const durationInDays = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));

        return durationInDays;
    };



    return (
        <Modal
            title="Post Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <h4>User Information</h4>
            <Row gutter={18}
                style={{
                    alignItems: 'center',
                    marginTop: '10px',
                    marginBottom: '30px',
                    borderRadius: '5px',
                    padding: '20px 0',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                <Col
                    span={8}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <div
                        style={{
                            borderRadius: '50%',
                            overflow: 'hidden',
                        }}>
                        <Image
                            width={100}
                            height={100}
                            src={travel.creator.profileImage}
                            style={{
                                borderRadius: '50%',
                                overflow: 'hidden',
                            }}
                        />
                    </div>
                </Col>

                <Col span={10}>
                    {/* Right column for Travel Details (uncomment when needed) */}
                    <Row gutter={24}>
                        <Col span={24}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                <CiUser
                                    style={{
                                        marginRight: '10px'
                                    }} />
                                {travel.creator.userName}
                            </span>
                        </Col>
                    </Row>

                    <Row gutter={24}
                        style={{
                            marginTop: '8px',
                        }}>
                        <Col
                            span={24}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                {travel.creator.gender === 'Male' ?
                                    <PiGenderMaleThin
                                        style={{
                                            marginRight: '10px'
                                        }}
                                    /> :
                                    <PiGenderFemaleThin
                                        style={{
                                            marginRight: '10px'
                                        }}
                                    />
                                }
                                {travel.creator.gender === 'Male' ? "Male" : "Female"}

                            </span>
                        </Col>
                    </Row>

                    <Row gutter={24}
                        style={{
                            marginTop: '8px',
                        }}>
                        <Col span={24}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                <PiCakeThin
                                    style={{
                                        marginRight: '10px'
                                    }}
                                />
                                {formatDate(travel.creator.birthDate)} (Age: {calculateAge(travel.creator.birthDate)})
                            </span>
                        </Col>
                    </Row>
                </Col>




            </Row>

            <h4>Travel Information</h4>
            <Row gutter={18}
                style={{
                    alignItems: 'center',
                    marginTop: '10px',
                    marginBottom: '30px',
                    borderRadius: '5px',
                    padding: '20px 0',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>

                <Col span={24}>
                    <Row
                        gutter={24}>
                        <Col span={24}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '20px',
                                }}>
                                <CiLocationArrow1
                                    style={{
                                        marginRight: '12px'
                                    }} />
                                {travel.destination}
                            </span>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '20px',
                                }}>
                                <CiCalendarDate
                                    style={{
                                        marginRight: '12px'
                                    }} />
                                {` ${new Date(travel.startDate).toLocaleDateString()} - ${new Date(travel.endDate).toLocaleDateString()}`}

                            </span>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '20px',
                                }}>
                                <CiCalendarDate
                                    style={{
                                        color: 'rgb(0,0,0,0)',
                                        marginRight: '12px'
                                    }} />
                                {calculateDuration(travel.startDate, travel.endDate)} day(s)

                            </span>

                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={24}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '20px',
                                }}>
                                <CiCalendarDate
                                    style={{
                                        marginRight: '12px'
                                    }} />
                                {` ${new Date(travel.startDate).toLocaleDateString()} - ${new Date(travel.endDate).toLocaleDateString()}`}

                            </span>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '20px',
                                }}>
                                <CiCalendarDate
                                    style={{
                                        color: 'rgb(0,0,0,0)',
                                        marginRight: '12px'
                                    }} />
                                {calculateDuration(travel.startDate, travel.endDate)} day(s)

                            </span>

                        </Col>
                    </Row>
                </Col>
                <Divider orientation="left">Preferences</Divider>
<Space size={[0, 8]} wrap>
    {travel.buddyPreference.map((preference, index) => (
        <Tag key={index} color="cyan">{preference}</Tag>
    ))}
</Space>

{travel.additionalInfo && (
    <>
        <Divider orientation="left">Additional Information</Divider>
        <p>{travel.additionalInfo}</p>
    </>
)}





            </Row>






            <p>Start Date: {new Date(travel.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(travel.endDate).toLocaleDateString()}</p>
        </Modal>
    );
}

export default ViewRequestingDetailsModal;

import { Modal } from 'antd';
const Confirmation = ( { title, content }) => {

    const [modal, contextHolder] = Modal.useModal();
    const { confirm } = Modal;
    
    const showConfirm = () => {
        confirm({
          title: {title},
          content: {content},
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };


    return ( 
        <h1>{title}
        {contextHolder}
        </h1>
     );
}
 
export default Confirmation;
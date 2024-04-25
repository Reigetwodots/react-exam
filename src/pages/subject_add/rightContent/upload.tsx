import { InboxOutlined } from '@ant-design/icons';
import { Upload, } from 'antd';

const { Dragger } = Upload;



function UploadPhoto(props: any) {

    const config = {
        name: 'file',
        // multiple: true,
        onChange(info: any) {
            console.log('onchange', info)
            props.change(info)
        },
        // 拖拽上传
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        customRequest(option: any) {
            const urlData = URL.createObjectURL(option.file); // 生成一个url
            console.log('urlData', urlData)
            option.onSuccess();
        },
        maxCount: 1, // 最大上传数量
        beforeUpload() {
            return false;
        },
        multiple: true,
    }
    return (
        <div>
            <Dragger {...config}>
                <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                </p>
                <p className='ant-upload-text'>点击或者拖拽上传</p>
                <p className='ant-upload-hint'>支持单个或者批量上传</p>
            </Dragger>
        </div>
    )
}

export default UploadPhoto;
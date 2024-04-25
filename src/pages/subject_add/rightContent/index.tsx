import { Form, Input, Button, } from "antd";
import styles from './index.module.css'
import UploadPhoto from './upload'
import { useRef } from "react";
import { upload_imgs } from "@/util";
import { useSelector } from 'react-redux'
import { select_active_two } from '@/store/slice/subject'
import axios from "axios";




const { TextArea } = Input;


function RightContent() {
    const two_obj: any = useSelector(select_active_two)
    const [form] = Form.useForm();
    let active_file: any = useRef({})

    function file_change(file_info: any) {

        console.log('file_change', file_info)
        active_file.current = file_info
    }

    async function submit_click() {
        const form_data = await form.validateFields()

        if (form_data) {
            if (active_file.current?.fileList?.length) {
                // 上传图片
                console.log('active_file', active_file)
                // 有file对象 => cdn地址
                const imgs_url_arr = await upload_imgs(active_file.current.fileList);
                form_data.imgs = imgs_url_arr
            }
            form_data.two_id = two_obj.value
        }

        await axios.post('/api/topic', form_data) // 提交表单
        form.resetFields()
    }

    return (
        <Form
            name="basic"
            labelCol={{ span: 2 }} //label占据的宽度
            wrapperCol={{ span: 16 }} //输入框占据的宽度
            initialValues={{ remember: true }} //初始值
            autoComplete="off" //关闭自动填充
            form={form}
        >
            <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="描述"
                name="dec"
                rules={[{ required: true, message: '请输入' }]}
            >
                <TextArea />
            </Form.Item>
            <UploadPhoto change={file_change} />
            <Button onClick={submit_click} danger type="primary" className={styles.add_button}>保存</Button>
        </Form>
    )
}

export default RightContent;
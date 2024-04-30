import { Table, Form, Button, Input } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import { get_admin_async, select_user_admin_list } from "@/store/slice/user";
import { useState, useEffect } from "react";
import styles from './index.module.css'
import { addAdminRequest } from "@/util/request";

function AdminManage() {
    const dispatch = useAppDispatch()
    const admin_datas = useAppSelector(select_user_admin_list)
    const [form] = Form.useForm()
    const [data, setData] = useState(admin_datas.map((item, index) => ({ index: index + 1, ...item })))

    useEffect(() => {
        dispatch(get_admin_async())
        setData(admin_datas.map((item, index) => ({ index: index + 1, ...item })));
    }, [dispatch, admin_datas]);

    async function add_admin() {
        const form_data = await form.validateFields()
        Object.keys(form_data).forEach((key) => {
            if (!form_data[key]) {
                delete form_data[key]
            }
        })

        await addAdminRequest(form_data)
        dispatch(get_admin_async())
        setData(admin_datas.map((item, index) => ({ index: index + 1, ...item })))

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            sorter: (a: any, b: any) => a.index - b.index,
        },
        {
            title: '花名',
            dataIndex: 'name',
        },
        {
            title: '当前薪资',
            dataIndex: 'money',
        },
        {
            title: '技术栈',
            dataIndex: 'techStack',
        },
        {
            title: '学历',
            dataIndex: 'edu',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
        },
    ]

    return (
        <div>
            <div className={styles.search_wrap}>
                <Form
                    form={form}
                    layout='inline'
                >
                    <Form.Item name="phone" label="电话">
                        <Input
                            className={styles.input}
                            width={200}
                            placeholder="请输入phone"
                        ></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button className={styles.btn} type="primary" onClick={add_admin}>新增管理员</Button>
                    </Form.Item>
                </Form>
            </div>
            <Table
                columns={columns}
                dataSource={data}
            ></Table>
        </div>
    )
}

export default AdminManage;
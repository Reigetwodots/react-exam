import { useEffect, } from 'react';
import { Table, Input, Button } from 'antd';
import { useAppDispatch } from '@/store'
import styles from './index.module.css'
import { useSelector } from 'react-redux';
import { get_admin_async, select_user_admin_list } from '@/store/slice/user';
import { useState } from 'react';
import { addAdminRequest } from '@/util/request';

function AdminManage() {
    const dispatch = useAppDispatch();
    const admin_list = useSelector(select_user_admin_list)
    const data = admin_list.map((item, index) => ({ index: index + 1, ...item }));
    const [phone, set_phone] = useState('')

    useEffect(() => {
        dispatch(get_admin_async())
    }, [dispatch])

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
            title: '微信',
            dataIndex: 'vChat',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
        },
    ];

    function input_change(e: any) {
        set_phone(e.target.value)
    }

    async function add_admin() {
        if (!phone) {
            return
        }
        await addAdminRequest({
            phone
        })

        dispatch(get_admin_async())
    }
    return (
        <div>
            <div className={styles.search_wrap}>
                <Input
                    value={phone}
                    onChange={input_change}
                    width="200px"
                    className={styles.input}
                    placeholder='请输入phone'
                />
                <Button className={styles.btn} type='primary' onClick={add_admin}>新增</Button>
            </div>
            <Table
                dataSource={data} columns={columns} rowKey='_id'
            />
        </div>
    )
}

export default AdminManage
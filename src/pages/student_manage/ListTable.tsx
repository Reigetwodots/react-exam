import React, { useEffect, } from 'react';
import { Table, Divider, Pagination, Space } from 'antd';
import { useAppDispatch } from '@/store'
import { set_is_show_user_edit_modal, set_current_edit_userinfo, get_student_async, select_user_student_list_data, select_student_list_search_params, select_student_list_current_page, set_student_list_current_page } from '../../store/slice/user';
import { get_subject_tree_async } from '@/store/slice/subject';
import { userDelete } from '@/util/request';
import dayjs from 'dayjs'
import { useAppSelector } from '../../store/index';
import styles from './index.module.css'

const PAGE_COUNT = 10

const ListTable = () => {
    const dispatch = useAppDispatch()
    const data = useAppSelector(select_user_student_list_data) // 学生列表数据
    const search_params = useAppSelector(select_student_list_search_params) // 搜索参数
    const current_page = useAppSelector(select_student_list_current_page) // 当前页码
    const student_list = data.list
    const count = data.count

    useEffect(() => {
        dispatch(get_subject_tree_async()) // 获取学科树
        dispatch(get_student_async({})) // 获取学生列表
        dispatch(set_student_list_current_page(1)) // 设置当前页码
    }, [dispatch])

    function edit_click(record: any) {
        dispatch(set_current_edit_userinfo(record))
        dispatch(set_is_show_user_edit_modal(true))
    }
    async function delete_click(record: any) {
        await userDelete(record._id)
        dispatch(get_student_async({
            ...search_params,
            skip: (current_page - 1) * PAGE_COUNT, // 跳过条数
            limit: PAGE_COUNT // 每页条数
        }))
    }

    function page_change(val: any) {
        dispatch(set_student_list_current_page(val)) // 设置当前页码
        dispatch(get_student_async({
            ...search_params,
            skip: (val - 1) * PAGE_COUNT, // 跳过条数
            limit: PAGE_COUNT // 每页条数
        }))
        console.log('page_change', val)
    }

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (dom: any, entity: any) => {
                return (
                    <a
                        onClick={() => {
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '当前薪资',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '技术栈',
            dataIndex: 'techStack',
            key: 'techStack',
        },
        {
            title: '学历',
            dataIndex: 'edu',
            key: 'edu',
        },
        {
            title: '微信',
            dataIndex: 'vChat',
            key: 'vChat',
        },
        {
            title: '号码',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '课程权限',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '注册时间',
            dataIndex: 'created',
            key: 'created',
            render: (_: any, record: any) => {
                return <span>{dayjs(record.created).format('YYYY MM-DD')}</span>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle" >
                    <a key='jurisdictionEdit' onClick={() => edit_click(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a key='delete' onClick={() => delete_click(record)}>删除</a>
                </Space>
            ),
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                dataSource={student_list}
                pagination={false}
            ></Table>
            <Pagination
                className={styles.pagination}
                pageSize={PAGE_COUNT} // 每页条数
                current={current_page} // 当前页码
                total={count} // 总条数
                onChange={page_change} // 页码改变的回调
            ></Pagination>
        </>
    )
}

export default ListTable;

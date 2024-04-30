import React, { useEffect } from 'react'
import { Table, Pagination } from 'antd';
// import { tableDefaultData, tableColumns } from './interface'
import styles from './index.module.css'
import { useAppSelector, useAppDispatch } from '@/store';
import { get_exam_history, select_corret_exam_list_loading, select_exam_history_data, set_exam_list_data } from '../../store/slice/subject';
import { Tag, Space, Badge } from 'antd'
import { useNavigate } from 'react-router';
import dayjs from 'dayjs'
import Search from './search'

const PAGE_COUNT = 10; // 每页显示的条数

function CorretExamList() {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const loading = useAppSelector(select_corret_exam_list_loading) // 获取loading状态
    const exam_list_data = useAppSelector(select_exam_history_data) // 获取考试历史数据

    let exam_list = exam_list_data.list.map((item: any) => { // 处理数据
        return {
            ...item, // 展开原有数据
            key: item._id // 设置key值
        }
    })

    useEffect(() => {
        dispatch(get_exam_history({})) // 获取考试历史数据
    }, [dispatch])

    function read_exam_click(item: any) { // 阅卷点击
        if (item.is_judge) { // 如果已经批阅
            const exam_id = item._id // 获取考试id
            navigate(`/read_exam/${exam_id}`) // 跳转到阅卷页面
        } else {
            const exam_id = item._id // 获取考试id
            navigate(`/corret_exam/${exam_id}`) // 跳转到批阅页面
        }
    }

    function page_change(count: number) { // 页码改变
        dispatch(set_exam_list_data({
            current_page: count // 设置当前页
        }))
        dispatch(get_exam_history({
            ...exam_list_data.search_params, // 保留搜索参数
            skip: PAGE_COUNT * (count - 1) // 计算跳过的条数
        }))
    }

    const tableColumns = [
        {
            title: '试卷名称',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: '学生姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '考试时间',
            dataIndex: 'created',
            key: 'created',
            render: (_: any, record: any) => {
                return <span>{dayjs(record.created).format('YYYY MM-DD hh:mm:ss')}</span>
            }
        },
        {
            title: '是否阅卷',
            dataIndex: 'is_judge',
            key: 'is_judge',
            render: (status: boolean) => {
                const statusObj = !status ? {
                    status: 'default',
                    text: '未阅卷'
                } : {
                    status: 'success',
                    text: '已阅卷'
                }
                return (
                    <Space>
                        <Badge
                            status={statusObj.status as "default" | "error" | "success" | "processing" | "warning" | undefined}
                            text={statusObj.text}></Badge>
                    </Space>
                )
            }
        },
        {
            title: '操作',
            dataIndex: '_id',
            key: '_id',
            render: (row: any, record: any) => {
                return (
                    <Tag
                        color={record.is_judge ? 'green' : 'blue'}
                        onClick={() => {
                            read_exam_click(record) // 阅卷点击

                        }}
                        style={{
                            cursor: 'pointer' // 设置鼠标样式
                        }}
                    >
                        {record.is_judge ? "查看" : "阅卷"}
                    </Tag >
                )
            }
        }
    ]

    return (
        <div className={styles["exam-history"]}>
            <div className={styles.search_wrap}>
                <Search />
            </div>
            <div className='table-list-wrapper'>
                <Table
                    loading={loading} // 加载状态
                    dataSource={exam_list} // 数据源
                    columns={tableColumns} // 列配置 
                    pagination={false} // 分页配置
                />
                <Pagination
                    className={styles.pagination}
                    pageSize={PAGE_COUNT} // 每页显示的条数
                    current={exam_list_data.current_page} // 当前页
                    total={exam_list_data.count} // 总数
                    onChange={page_change} // 页码改变的回调
                />
            </div>
        </div>
    );
}

export default CorretExamList;
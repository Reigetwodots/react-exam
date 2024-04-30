import React, { FC, useEffect } from 'react'
import { Table } from 'antd'
import styles from './index.module.css'
import { useAppSelector, useAppDispatch } from '@/store';
import { get_exam_history, select_exam_history_data } from '../../store/slice/subject';
import { Tag, Space, Badge } from 'antd'
import { useNavigate } from 'react-router';


const ExamHistory: FC = () => {

    const exam_list_data = useAppSelector(select_exam_history_data)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    /**
     * 监视地址栏的page pageSize变化，发请求
     */
    useEffect(() => {
        dispatch(get_exam_history({}))
    }, [dispatch])

    function read_exam_click(item: any) {
        if (item.is_judge) {
            const exam_id = item._id
            navigate(`/read_exam/${exam_id}`)
        }
    }

    const tableColumns = [{
        title: '试卷名称',
        dataIndex: 'subject_name',
        key: '_id',
    }, {
        title: '考试时间',
        dataIndex: 'created',
        key: '_id',
    }, {
        title: '是否阅卷',
        dataIndex: 'is_judge',
        key: '_id',
        render: (status: boolean) => {
            const statusObj = !status ? {
                status: 'default',
                text: "未阅卷"
            } : {
                status: 'error',
                text: "已阅卷"
            }
            return (
                <Space>
                    <Badge status={statusObj.status as "default" | "error" | "success" | "processing" | "warning" | undefined} />
                    {statusObj.text}
                </Space>
            )
        }
    }, {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (row: any) => {
            return <Tag onClick={() => {
                read_exam_click(row)
            }} style={{ fontSize: "12px", color: "#1880FF", borderRadius: "12px", opacity: row.is_judge ? '1' : '0.2', background: "#F2F4F7", cursor: row.is_judge ? "pointer" : "none" }}>查看</Tag>
        },
    }]

    return <div className={styles["exam-history"]}>
        <div className='table-list-wrapper'>
            <Table dataSource={exam_list_data.list} columns={tableColumns} pagination={false} />
        </div>
    </div>;
}

export default ExamHistory
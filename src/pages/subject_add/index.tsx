import styles from './index.module.scss';
import React, { useEffect } from 'react';
import {
    get_subject_tree_async,
    set_subject_active_two
} from '../../store/slice/subject';
import { useAppDispatch } from '@/store';
import SubjectDetail from './components/TopicDetail';
import SubjectList from './components/TopicList';
import { SubjectData } from '@/util/request';
import TreeSelectCp from './components/TreeSelectCopy';
import EditOrAdd from './components/EditOrAdd'


function StudentAdd() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(get_subject_tree_async()).then((res: any) => {
            dispatch(set_subject_active_two(res.payload?.[0]?.children?.[0] as SubjectData))
        })
    }, [dispatch])




    return (
        <div className={styles.wrap}>
            <TreeSelectCp />
            <div className="content">
                <div className="left">
                    <SubjectList />
                </div>
                <div className="right">
                    <EditOrAdd />
                    {/* <p className="title">题目详情{currentTopic ? <Tag color="orange">编辑</Tag> : <Tag color="blue">新增</Tag>}</p> */}
                    <SubjectDetail />
                </div>
            </div>
        </div>
    )
}

export default StudentAdd;
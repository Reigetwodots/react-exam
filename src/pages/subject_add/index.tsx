import styles from './index.module.css';
import React, { useEffect } from 'react';
import { Button, TreeSelect } from 'antd';
import { useSelector } from 'react-redux';
import { get_subject_tree_async, get_topic_two_list } from '../../store/slice/subject';
import { useAppDispatch } from '@/store';
import { select_subject_tree, select_active_two } from '@/store/slice/subject';
import { set_active_two } from '../../store/slice/subject';
import RightContent from '@/pages/subject_add/rightContent';
import LeftContent from '@/pages/subject_add/leftContent';


function StudentAdd() {
    const dispatch = useAppDispatch();
    const treeData = useSelector(select_subject_tree);
    const activeTwo: any = useSelector(select_active_two);

    useEffect(() => {
        dispatch(get_subject_tree_async()).then((res) => {
            console.log('res', res)
            const activeTwoSubject = res.payload[0].children[0];
            dispatch(set_active_two(activeTwoSubject))
        });
    }, [dispatch]);

    useEffect(() => {
        dispatch(get_topic_two_list(activeTwo.value))
    }, [dispatch, activeTwo.value])


    const onChange = (newValue: string, nameArr: any) => {
        console.log(newValue, nameArr);
        dispatch(set_active_two({
            title: nameArr[0],
            value: newValue,
        }));
    };


    return (
        <div className={styles.wrap}>
            <div className={styles.top}>
                <div className={styles.top_left}>
                    {activeTwo.title}
                </div>
                <div className={styles.top_right}>
                    <TreeSelect
                        style={{ width: '100%' }}
                        value={activeTwo.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder="Please select"
                        treeDefaultExpandAll
                        onChange={onChange}
                    />
                </div>
                <Button type='primary' className={styles.add_button}>新增题目</Button>
            </div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <LeftContent />
                </div>
                <div className={styles.right}>
                    <RightContent />
                </div>
            </div>

        </div>
    )
}

export default StudentAdd;
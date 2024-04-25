import styles from './index.module.css';
import React, { useEffect } from 'react';
import { Button, TreeSelect } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectTreeAsync } from '../../store/slice/subject';
import { AppDispatch } from '@/store';
import { selectSubjectTree, selectSubjectActiveTwo } from '@/store/slice/subject';
import { setSubjectActiveTwo } from '../../store/slice/subject';


function StudentAdd() {
    const dispatch: AppDispatch = useDispatch();
    const treeData = useSelector(selectSubjectTree);
    const activeTwo = useSelector(selectSubjectActiveTwo);

    useEffect(() => {
        dispatch(getSubjectTreeAsync()).then((res) => {
            console.log('res', res)
            const activeTwoSubject = res.payload[0].children[0];
            dispatch(setSubjectActiveTwo(activeTwoSubject))
        });
    }, [dispatch]);


    const onChange = (newValue: string, nameArr: any) => {
        console.log(newValue, nameArr);
        dispatch(setSubjectActiveTwo({
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
                    <h1>left</h1>
                </div>
                <div className={styles.right}>
                    <h1>right</h1>
                </div>
            </div>

        </div>
    )
}

export default StudentAdd;
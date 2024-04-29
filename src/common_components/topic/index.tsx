import { TopicData } from '../../util/request';
import styles from './index.module.scss'
import { Input, Button, Tag } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';

type Iprops = { // 考试 批阅 查看
    type: 'exam' | 'read' | 'corret'
    topic: TopicData
    pass_cb?: any,
    no_pass_cb?: any,
    answer_cb?: any
}


const TopicCp: React.FC<Iprops> = (props) => {
    const [corret, setCorret] = useState(''); // 是否批阅
    const [answer, setAnswer] = useState(''); // 当前题目的答案
    // function corret_change(e: any) {
    //     setCorret(e.target.value) // 设置是否批阅
    // }

    function answer_change(e: any) {
        setAnswer(e.target.value) // 设置答案
    }

    useEffect(() => {
        setCorret(props.topic.comment) // 设置是否批阅
    }, [props.topic.comment])

    useEffect(() => {
        setAnswer(props.topic.answer) // 设置答案
    }, [props.topic.answer])

    function submit_answer() {
        if (answer.trim()) {
            props.answer_cb({
                answer,
                _id: props.topic._id
            })
        }
        setAnswer('')
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.title}>
                题目
            </div>
            <p className={styles.content}>
                {props.topic.title}
            </p>
            <div className={styles.title}>
                详细描述
            </div>
            <p className={styles.content}>
                {props.topic.dec}
            </p>
            <div className={styles.title}>
                答案
            </div>
            <p className={styles.content}>
                <Input.TextArea
                    value={answer}
                    rows={4} // 设置行数
                    placeholder="请作答"
                    className={styles.customInput}
                    disabled={props.type !== 'exam'} // 是否禁用
                    onChange={answer_change} // 输入框改变
                />
            </p>
            {
                props.type === 'exam' ?
                    <Button
                        type='primary'
                        className={styles.answer_btn}
                        onClick={submit_answer}
                        size='large'
                    >
                        保存作答
                    </Button> : null
            }
        </div>
    )
}

export default TopicCp;
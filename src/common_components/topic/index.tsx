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

    const [corret, set_corret] = useState('')
    const [answer, set_answer] = useState('')
    function corret_change(e: any) {
        set_corret(e.target.value)
    }

    function answer_change(e: any) {
        set_answer(e.target.value)
    }

    useEffect(() => {
        set_corret(props.topic.comment)
    }, [props.topic.comment])


    useEffect(() => {
        set_answer(props.topic.answer)
    }, [props.topic.answer])


    function pass() {
        props.pass_cb({
            _id: props.topic._id,
            pass: true,
            is_corret: true,
            comment: corret
        })
        set_corret('')
    }

    function no_pass() {
        props.no_pass_cb({
            _id: props.topic._id,
            pass: false,
            is_corret: true,
            comment: corret
        })
        set_corret('')
    }

    function submit_answer() {
        console.log(1111111111)
        if (answer && answer.trim()) {
            props.answer_cb({
                answer,
                _id: props.topic._id,
            })
        }

        set_answer('')
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.title}>
                题目
                {
                    props.type === 'read' ?
                        (
                            <span className={styles.span_tag}>
                                {
                                    props.topic.pass ?
                                        (
                                            <Tag color="green">通过</Tag>
                                        ) : (
                                            <Tag color="red">不通过</Tag>
                                        )
                                }
                            </span>
                        ) : null
                }
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
                    rows={4}
                    placeholder="请作答"
                    className={styles.customInput}
                    disabled={props.type !== 'exam'}
                    onChange={answer_change}
                />
            </p>
            {
                props.type === 'exam' ?
                    <Button
                        type="primary"
                        className={styles.answer_btn}
                        onClick={submit_answer}
                        size="large"
                    >
                        保存作答
                    </Button> : null
            }

            {
                props.type !== 'exam' ?
                    (
                        <>
                            <div className={styles.title}>
                                我的批阅
                            </div>
                            <p className={styles.content}>
                                <Input.TextArea
                                    value={corret}
                                    rows={4}
                                    placeholder="请作答"
                                    className={styles.customInput}
                                    onChange={corret_change}
                                    disabled={props.type !== 'corret'}
                                />
                            </p></>
                    ) : null
            }
            {
                props.type === 'corret' ?
                    (
                        <div className={styles.submit_wrap}>
                            <Button
                                type="primary"
                                className={styles.btn}
                                onClick={pass}
                                size="large"
                            >
                                通过
                            </Button>
                            <Button
                                type="primary"
                                danger
                                className={styles.btn}
                                onClick={no_pass}
                                size="large"
                            >
                                不通过
                            </Button>
                        </div>
                    ) : null
            }
        </div>
    )
}

export default TopicCp
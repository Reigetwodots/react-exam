import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Button, } from 'antd';
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/store';
import {
    get_exam_async,
    select_exam_topic_list,
    set_current_exam_topic_id,
    select_current_exam_topic,
    set_exam_answer
} from '../../store/slice/subject';
import { examPost } from '../../util/request';
import TopicCp from "@/common_components/topic";

function Exam() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate() // 路由跳转
    const [, set_answer] = useState('') // 答案
    const [can_submit, set_can_submit] = useState(false) // 是否可以提交
    const params: any = useParams() // 获取路由参数

    // 题目列表
    const topic_list: any[] = useAppSelector(select_exam_topic_list)
    // 当前选中的题目id
    const current_exam_topic: any = useAppSelector(select_current_exam_topic)

    useEffect(() => {
        let flag = false
        flag = topic_list.every((item) => { // 检测topic_list中的answer是否都是true
            return item.answer
        })
        set_can_submit(flag) // 如果所有的answer都是true，那么就可以提交
    }, [topic_list])

    useEffect(() => {
        dispatch(get_exam_async(params.exam_id)) //在页面加载的时候，获取考试的题目列表，即是获取二级课程分类下的题目列表
    }, [dispatch, params.exam_id])

    function topic_click(item: any) {
        if (item._id !== current_exam_topic._id) {
            set_answer('')
        }
        dispatch(set_current_exam_topic_id(item._id))
    }

    function submit_answer(data: any) {
        dispatch(set_exam_answer(data))
    }

    async function submit_click() {
        await examPost({
            topic_list,
            two_id: params.exam_id
        })
        navigate('/exam_history')
    }

    return (
        <div className={styles.exam}>
            <div className={styles.exam_left}>
                <div className={styles.title}> 考题列表</div>
                <div className={styles.exam_left_content}></div>
                {topic_list.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`${styles.questiontab}`}
                            onClick={() => {
                                topic_click(item)
                            }}
                        >
                            <div
                                className={`${styles.question} ${current_exam_topic._id === item._id ? styles.alreadyselect : ""
                                    }`}
                            >
                                {index + 1}. {item.title}
                            </div>
                            <div
                                className={`${styles.circle}  ${item.answer ? styles.alreadykeep : ""
                                    }`}
                            ></div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.exam_right}>
                <TopicCp
                    type="exam" // 试卷
                    topic={current_exam_topic} // 当前题目
                    answer_cb={submit_answer} // 提交答案
                />
                <Button
                    type="primary"
                    className={styles.summitbtn}
                    disabled={!can_submit}
                    onClick={submit_click}
                >
                    点击交卷
                </Button>
            </div>
        </div>
    );
}

export default Exam;

import styles from "./index.module.scss";
import { useEffect } from "react";
import React from "react";
import classnames from "classnames";
import {
    get_subject_tree_async, set_current_two_subject,
} from "@/store/slice/subject";
import colorsData from "./color.json";
import { useNavigate } from "react-router-dom";
import { select_subject_tree, select_current_two_subject } from '../../store/slice/subject';
import { useAppDispatch, useAppSelector } from '@/store';


function ExamSelect() {
    const data = useAppSelector(select_subject_tree); // 科目树
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); // 路由跳转
    const current_two_subject = useAppSelector(select_current_two_subject); // 当前二级科目

    useEffect(() => {
        dispatch(get_subject_tree_async()); // 获取科目树
    }, [dispatch]);

    // 选择二级科目 跳转可以选择的考试题目
    const handleJump = () => {
        if (!current_two_subject) {
            alert('请选择题目再作答');
        } else {
            navigate({
                pathname: `/exam/${current_two_subject}` // 跳转到考试页面
            })
        }
    }
    // 点击科目
    function item_click(item: any) {
        if (!item.can_exam) {
            return
        }
        dispatch(set_current_two_subject(item.value)); // 设置当前二级科目
    }

    return (
        <>
            <div className={styles.wrap}>
                <div className={styles.content}>
                    <div>
                        {data.map((item, index) => (
                            <React.Fragment key={item.title}>
                                <div
                                    style={{ color: colorsData.colors[index % colorsData.colors.length].value }} // 颜色
                                    className={styles.title}
                                >
                                    <div>{item.title}</div>
                                </div>
                                <div className={styles.topic_section}>
                                    {
                                        item.children.map((_item) => (
                                            <div
                                                key={_item.title}
                                                onClick={() => { item_click(_item) }}
                                                className={classnames(styles.topic_section_content, {
                                                    topic_section_content_selected: // 选中
                                                        _item.value === current_two_subject, // 当前二级科目
                                                    topic_section_content_disabled:     // 禁用
                                                        _item.can_exam === false      // 不能考试
                                                })}
                                            >
                                                <p>{_item.title}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div
                    className={styles.footer}>
                    <button onClick={handleJump}>开始答题</button>
                </div>
            </div>
        </>
    )
}

export default ExamSelect;
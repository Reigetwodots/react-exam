import styles from "./index.module.scss";
import { Table, Button, TableColumnsType } from "antd";
import { useEffect } from "react";
import CourseAdd from "./components/course";
import {
    handleTransform,
    isDelete,
    handleDelete,
    TransformCourse,
} from "./data";
import {
    get_subject_tree_async,
    select_subject_tree,
} from "@/store/slice/subject";
import { useAppDispatch, useAppSelector } from "@/store";

function SubjectManage() {
    const dispatch = useAppDispatch();
    const lessonList = useAppSelector(select_subject_tree);


    const columns: TableColumnsType<TransformCourse> = [
        {
            title: "排序",
            dataIndex: "value",
            key: "value",
            width: 120,
            render(a, b, c) // a: 是根据dataindex来显示的，如果是value那就是显示_id,如果的title那就是显示children b: 是数据对象 c: 当前行索引
            {
                return <span>{c + 1}</span>;
            },
        },
        {
            title: "课程类别",
            dataIndex: "title",
            key: "title",
            render(a, b, c) {
                return <div>{b.parent || b.title}</div>;
            },
        },
        {
            title: "名称",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "操作",
            render(a, b, c) {
                return isDelete(b) ? (
                    <Button
                        onClick={handleDelete.bind(null, b.value, b.title, getRemoteData)}
                        danger
                        ghost
                        type="link">
                        删除
                    </Button>
                ) : null;
            },
        },
    ];

    const transformData = handleTransform(lessonList) // 新增一个parent字段 等于父级课程title

    function getRemoteData() {
        dispatch(get_subject_tree_async()); // 获取课程列表 在useEffect中调用
    }

    useEffect(getRemoteData, [dispatch]);

    return (
        <div className={`${styles.wrap} subject_manage_wrap`}>
            <div className={styles["my-4"]}>
                <CourseAdd handleSuccess={getRemoteData}>
                    <Button type="primary" style={{ borderRadius: "2px" }}>
                        新增课程
                    </Button>
                </CourseAdd>
            </div>
            {transformData.length > 0 ? (
                <Table
                    expandable={{
                        defaultExpandAllRows: true
                    }}
                    dataSource={transformData}
                    columns={columns}
                />
            ) : null}
        </div>
    );
}

export default SubjectManage;

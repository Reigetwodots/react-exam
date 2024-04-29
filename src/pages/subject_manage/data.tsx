import { Modal } from "antd";
import { subject2Delete } from '../../util/request';

export interface Course { // 课程
    title: string;
    value: string;
}
export type CourseList = Course[]; // 课程列表
export type CourseRequestResult = Course & { // 课程请求结果
    children?: CourseRequestResult[]; // 二级课程
};
export type TransformCourse = Course & { // 转换后的课程
    parent?: string; // 父级课程
    children?: TransformCourse[]; // 二级课程
};
export function isDelete(data: CourseRequestResult) { // 是否删除
    return !data.children
}
export function handleTransformSub(data: CourseRequestResult[], parent: string): TransformCourse[] { // 处理转换子级
    return data.map((item) => {
        return {
            ...item,
            parent,
        }
    })
}
export function handleTransform(data: CourseRequestResult[],): TransformCourse[] { // 处理转换
    let d = JSON.parse(JSON.stringify(data)); // 深拷贝
    return d.map((item: any) => {
        if (item.children) {
            item.children = handleTransformSub(item.children, item.title); // 处理转换子级
        }
        return item;
    })
}
export function handleDelete(id: string, name: string, cb?: (data?: any) => void) { // 处理删除
    Modal.confirm({
        type: 'error',
        content: `是否删除：${name}`,
        title: '系统提醒！',
        onOk() {
            subject2Delete(id).then((res) => { // 删除课程
                cb && cb(); // 回调
            })
        },
        okText: "确定",
        cancelText: "取消"
    })
}

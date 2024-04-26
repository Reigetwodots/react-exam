import { TreeSelect, Button } from 'antd'
import { ReactNode, useEffect } from 'react'

import {
    select_subject_tree,
    set_subject_active_two,
    select_active_two,
    get_topic_two_list,
    set_subject_active_topic,
} from '@/store/slice/subject'
import { useAppDispatch, useAppSelector } from '@/store'
import { SubjectData } from '../../../util/request';



// 禁用含有children字段的项
const disableHasChildrenItem = (items: SubjectData[]) => {
    const _items = JSON.parse(JSON.stringify(items))
    return _items.map((item: SubjectData) => {
        if (item.children?.length > 0) {
            // @ts-ignore
            item.disabled = true
            item.children = disableHasChildrenItem(item.children)
        }
        return item
    })
}

function TreeSelectCp() {

    const dispatch = useAppDispatch()

    // 学科列表
    const lessonList = useAppSelector(select_subject_tree)
    // 学科列表memo 使父级不能选择
    const lessonListMemo = lessonList.length ? disableHasChildrenItem(lessonList) : []

    // 当前学科
    const currentlesson = useAppSelector(select_active_two)

    // 获取题目列表
    useEffect(() => {
        if (!currentlesson?.value) return
        dispatch(get_topic_two_list(currentlesson.value))
    }, [currentlesson?.value])

    // 选择学科
    const handleLessonChange = (value: string, labelList: ReactNode[]) => {
        dispatch(set_subject_active_topic(null))
        dispatch(
            set_subject_active_two({
                title: labelList[0],
                value: value,
            })
        )
    }
    // 新增题目
    const addTopic = () => dispatch(set_subject_active_topic(null))

    return (
        <div className="title-bar">
            <p className="title">{currentlesson?.title}</p>
            <div className="lesson-select">
                <TreeSelect
                    popupClassName={'subject-add-tree-select'}
                    style={{ width: 320 }}
                    treeDefaultExpandAll
                    treeData={lessonListMemo}
                    value={currentlesson?.value}
                    onChange={handleLessonChange}
                />
                <Button type="primary" onClick={addTopic}>
                    新增题目
                </Button>
            </div>
        </div>
    )
}

export default TreeSelectCp
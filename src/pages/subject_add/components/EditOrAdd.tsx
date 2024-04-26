import { useAppSelector } from '../../../store/index';
import { select_active_topic } from '../../../store/slice/subject';
import { Tag } from 'antd'
function EditOrAdd() {

    // 当前选择题目
    const currentTopic = useAppSelector(select_active_topic) // 状态变化
    return (
        <p className="title">题目详情{currentTopic ? <Tag color="orange">编辑</Tag> : <Tag color="blue">新增</Tag>}</p>
    )
}

export default EditOrAdd;
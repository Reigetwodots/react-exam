import { Modal, Checkbox } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { select_is_show_user_edit_modal, select_current_edit_userinfo, set_is_show_user_edit_modal, set_edit_user_topic_role, get_student_async } from '@/store/slice/user';
import { select_subject_tree } from '@/store/slice/subject';
import { userInfoPatch } from '@/util/request';

function EditModal() {

    const dispatch = useAppDispatch()
    const is_show = useAppSelector(select_is_show_user_edit_modal) // 是否显示编辑弹窗
    const subject_tree = useAppSelector(select_subject_tree) // 学科树
    const edit_userinfo = useAppSelector(select_current_edit_userinfo) // 当前编辑的用户信息


    // checkbox选项 需要{label: 'xxx', value: 'xxx'}格式
    let checkbox_options: any = []
    subject_tree.forEach((item: any) => {
        item.children.forEach((child: any) => {
            checkbox_options.push({
                label: child.title,
                value: child.value
            })
        })
    })

    async function handleOk() {
        await userInfoPatch(edit_userinfo._id, {
            topic_role: edit_userinfo.topic_role
        })
        dispatch(set_is_show_user_edit_modal(false))
        dispatch(get_student_async({}))
    }

    function onCancel() {
        dispatch(set_is_show_user_edit_modal(false))
    }

    function onChange(value: any) {
        dispatch(set_edit_user_topic_role(value))
    }

    return (
        <Modal
            title="编辑课程权限"
            open={is_show} // 是否显示
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Checkbox.Group
                options={checkbox_options}
                onChange={onChange}
                value={edit_userinfo.topic_role}
            ></Checkbox.Group>
        </Modal>
    );
}

export default EditModal;
import { useAppDispatch } from "@/store"
import { set_student_list_search_params, set_student_list_current_page, get_student_async } from "@/store/slice/user"
import { Form, Input, Button } from "antd"
import styles from './index.module.css'

function Search() {

    const dispatch = useAppDispatch()
    const [form] = Form.useForm()


    async function search_click() {
        const form_data = await form.validateFields()

        Object.keys(form_data).forEach((key: string) => {
            if (!form_data[key]) {
                delete form_data[key]
            }
        })
        dispatch(set_student_list_search_params(form_data))
        dispatch(set_student_list_current_page(1))
        dispatch(get_student_async(form_data))
    }

    return (
        <div className={styles.wrap}>
            <Form
                layout="inline"
                form={form}
            >
                <Form.Item name="name" label="花名">
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="phone" label="电话">
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={search_click}>
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        </div>
    )
}

export default Search
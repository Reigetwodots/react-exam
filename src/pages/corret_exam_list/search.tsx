import { Button, Input, Select, Form } from "antd";
import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { get_subject_one, get_exam_history, set_exam_list_data } from '../../store/slice/subject';
import styles from './index.module.css'

const judge_options = [
    {
        label: '是', value: true
    },
    {
        label: '否', value: false
    }
]


function Search() {

    const [form] = Form.useForm()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(get_subject_one()) // 获取一级科目列表
    }, [dispatch])

    async function search_click() {
        const form_data = await form.validateFields() // 获取表单数据
        // console.log('@@@@@@form_data', form_data) // 返回的是一个对象，有user_name="xxx"，is_judge="xxx"

        Object.keys(form_data).forEach((key: string) => {
            if (!form_data[key] && form_data[key] !== false) {
                delete form_data[key]
            }
        })

        dispatch(get_exam_history({ // 获取考试历史
            ...form_data
        }))

        dispatch(set_exam_list_data({ // 
            search_params: form_data,
            current_page: 1
        }))
    }


    return (
        <div className={styles.wrap}>
            <Form
                form={form}
                layout="inline" // 行内表单
            >
                <Form.Item name="user_name" label="花名">
                    <Input />
                </Form.Item>
                <Form.Item name='is_judge' label='是否阅卷'>
                    <Select options={judge_options} style={{ width: 130 }}></Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={search_click}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Search;
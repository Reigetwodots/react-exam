import { Button, Form, Input, message } from 'antd'
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import { useEffect, useState } from 'react'
import { upload_imgs } from '@/util'
import request from '@/util/http'
import { get_topic_two_list, select_active_topic, select_active_two, set_subject_active_two, set_subject_active_topic } from '@/store/slice/subject'
import CustomUpload from '@/common_components/Upload'
import { useAppDispatch, useAppSelector } from '@/store'

export default function TopicDetail() {
    const [loading, setLoading] = useState(false) // 提交按钮loading状态
    const [fileList, setFileList] = useState<UploadFile[]>([]) // 图片列表
    const currentlesson = useAppSelector(select_active_two)
    const currentTopic = useAppSelector(select_active_topic)
    const dispatch = useAppDispatch()
    const [form] = Form.useForm()

    // 组件卸载时把当前选择的数据删除
    useEffect(() => {
        return () => {
            dispatch(set_subject_active_two(null))
            dispatch(set_subject_active_topic(null))
        }
    }, [dispatch])
    useEffect(() => {
        if (!currentTopic) {
            reset() // 重置表单
        } else {
            form.setFieldsValue(currentTopic)
            if (currentTopic.img?.length) { // 如果有图片
                setFileList(
                    currentTopic.img.map((url) => {
                        // console.log('@@@@@url', url)
                        const fileName = url.split('/').at(-1)!
                        // console.log('@@@@@fileName', fileName)
                        return {
                            uid: fileName,
                            name: fileName,
                            status: 'done',
                            url: '//' + url,
                        }
                    })
                )
                // console.log('@@@@@currentTopic', currentTopic)
            } else {
                setFileList([])
            }
        }
    }, [currentTopic, form])

    // 重置表单
    const reset = () => {
        form.resetFields()
        setFileList([])
    }
    // 图片上传
    const handleImgChange: UploadProps['onChange'] = async (fileInfo: UploadChangeParam) => {
        setFileList(fileInfo.fileList.map((item) => ({ ...item, status: 'done' }))) // 上传中的状态改为上传完成
    }
    const submit = async (data: any) => {
        setLoading(true)

        if (fileList.length) {
            // 需要上传的图片文件（如果没有则不用处理）
            const needUploadImgs = fileList.filter((file) => !file.url)
            if (needUploadImgs.length) {
                const imgURLs = (await upload_imgs(fileList)) as string[]
                data.img = imgURLs
            }
        } else {
            data.img = []
        }
        try {
            // 编辑时 todo：
            if (currentTopic) {
                // 提交数据
                await request.patch(`/api/topic/${currentTopic._id}`, {
                    title: data.title,
                    dec: data.dec,
                    img: data.img,
                })
            } else {
                // 新增时
                // 提交数据
                await request.post(`/api/topic`, { ...data, two_id: currentlesson!.value })
                reset()
            }
            dispatch(get_topic_two_list(currentlesson!.value))
            message.success('操作成功')
        } catch {
            message.error('操作失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form form={form} autoComplete="off" name="subject-detail-form" labelCol={{ span: 2 }} scrollToFirstError onFinish={submit}>
            <Form.Item label="题干" name="title" rules={[{ required: true, message: '题干必填' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="描述" name="dec">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="图片" name="img">
                <CustomUpload
                    fileList={fileList}
                    uploadProps={{
                        onChange: handleImgChange,
                    }}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
                {/* disabled 1.提交时防止重复提交 2.没有课程id保存数据出错 */}
                <Button disabled={loading || !currentlesson?.value} type="primary" htmlType="submit">
                    保存题目
                </Button>
            </Form.Item>
        </Form>
    )
}

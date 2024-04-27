import React, { useEffect, useMemo, useState } from 'react'
import { DatePicker, Form, Input, Select, Button, message, UploadProps } from 'antd'
import type { FormInstance } from 'antd/es/form'
import styles from './index.module.scss'
import { useNavigate } from 'react-router'
import CustomUpload from '@/common_components/Upload'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { useAppDispatch, useAppSelector } from '@/store'
import { select_user_info } from '@/store/slice/user'
import { getImgUrl, upload_imgs } from '@/util'
import dayjs from 'dayjs'
import { get_user_info } from '../../store/slice/user';
import { userInfoPatch } from '../../util/request';

const eduOptions = ['初中', '高中', ' 大专', '成人本科', '专升本', '二本', '一本', '研究生'] // 学历选项

type initUserType = {
    name: string            // 学生花名
    vChat: string          // 微信名字
    avatar?: string        // 头像
    graduation_time: Date    // 毕业时间
    money: number         // 现在薪资
    edu: string,          // 学历
    techStack: string,    // 技术栈
}

function PersonInfo() {

    const [form] = Form.useForm() // 表单
    const navigate = useNavigate() // 路由跳转
    const dispatch = useAppDispatch()
    const userInfo = useAppSelector(select_user_info) // 用户信息
    const [loading, setLoading] = useState(false) // 上传头像loading
    const [fileList, setFileList] = useState<UploadFile[]>([]) // 头像文件列表
    const formRef = React.useRef<FormInstance<any>>(null) // 表单ref

    // 是否是编辑状态
    const isEdit = useMemo(() => !!userInfo?.has_person_info, [userInfo]) // 是否有个人信息

    useEffect(() => {
        if (isEdit && userInfo) {
            form.setFieldsValue({
                ...userInfo, // 用户信息
                graduation_time: dayjs(userInfo.graduation_time), // 毕业时间
            })
            const avatar = userInfo.avatar // 头像
            const fileName = avatar!.split('/').at(-1)! // 头像文件名
            setFileList([{
                uid: fileName,
                name: fileName,
                status: 'done',
                url: getImgUrl(avatar), // 头像地址
            }
            ])

        }
    }, [isEdit]);


    const onFinishFailed = () => {
        if (!isEdit) {
            message.error('表单信息缺失')
        } else {
            message.error('修改失败')
        }
    }

    function back() {
        navigate(-1) // 返回上一页
    }

    const onFinish = async (params: initUserType) => {
        try {
            setLoading(true)
            if (fileList.length) {
                const needUploadImgs = fileList.filter((file) => !file.url) // 需要上传的图片
                if (needUploadImgs.length) {
                    const imgURLs = (await upload_imgs(fileList)) as string[] // 上传图片
                    params.avatar = imgURLs[0] // 头像
                }
            } else {
                delete params.avatar    // 删除头像
            }

            await userInfoPatch(userInfo._id, params) // 修改用户信息
            if (!isEdit) {
                message.success('个人信息填写成功')
                if (userInfo.role === 'student') {
                    navigate('/exam_select')
                }
            } else {
                message.success('修改成功')
                if (userInfo.role === 'student') {
                    navigate('/exam_select')
                }
            }
            dispatch(get_user_info()) // 获取用户信息
        } catch {
            message.error('修改失败')
        } finally {
            setLoading(false) // 关闭loading
        }
    }

    const handleImgChange: UploadProps['onChange'] = async (fileInfo: UploadChangeParam) => {
        setFileList(fileInfo.fileList.map((item) => ({ ...item, status: 'done' }))) // 设置文件列表
    }

    return (
        <div className={styles.wrap}>
            <div className="info-content">
                {!isEdit ? (
                    <div className="info-title">
                        欢迎进入<span className="text-blue">请先填写个人信息</span>
                    </div>
                ) : (
                    <div className="info-title">
                        <span className="text-blue">个人中心</span>
                    </div>
                )}
                <Form
                    disabled={loading} // 是否禁用表单
                    form={form} // 表单
                    labelCol={{ style: { width: 80 } }} // label布局
                    wrapperCol={{ span: 14 }} // 表单布局
                    layout='horizontal' // 表单布局
                    ref={formRef} // 表单ref
                    onFinish={onFinish} // 提交表单
                    onFieldsChange={onFinishFailed} // 表单字段变化
                    labelAlign='left' // label对齐方式
                >
                    <Form.Item
                        label="头像" // label
                        valuePropName="fileList" // 表单值
                    >
                        <CustomUpload
                            fileList={fileList} // 文件列表
                            uploadProps={{
                                onChange: handleImgChange, // 文件改变
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="花名"
                        name="name"
                        rules={[
                            {
                                required: true, // 必填
                                message: '请输入花名', // 提示信息
                            },
                        ]}
                    >
                        <Input placeholder="请输入花名" />
                    </Form.Item>

                    <Form.Item
                        label="当前薪资"
                        name="money"
                        rules={[
                            {
                                required: true,
                                message: '请输入当前薪资',
                            },
                        ]}
                    >
                        <Input placeholder="请输入当前薪资" />
                    </Form.Item>

                    <Form.Item
                        label="技术栈"
                        name="techStack"
                        rules={[
                            {
                                required: true,
                                message: '请输入技术栈',
                            },
                        ]}
                    >
                        <Input placeholder="请输入技术栈" />
                    </Form.Item>

                    <Form.Item
                        label="学历"
                        name="edu"
                        rules={[
                            {
                                required: true,
                                message: '请选择学历',
                            },
                        ]}
                    >
                        <Select
                            placeholder="请选择学历"
                            options={eduOptions.map((item) => ({
                                value: item,
                                label: item,
                            }))}
                        ></Select>
                    </Form.Item>

                    <Form.Item
                        label="毕业时间"
                        name="graduation_time"
                        rules={[
                            {
                                required: true,
                                message: '请选择毕业时间',
                            },
                        ]}
                    >
                        <DatePicker placeholder="请选择毕业时间" />
                    </Form.Item>

                    <Form.Item
                        label="v"
                        name="vChat"
                        rules={[
                            {
                                required: true,
                                message: '请输入v',
                            },
                        ]}
                    >
                        <Input placeholder="请输入v" />
                    </Form.Item>

                    <Form.Item>
                        <div className="btn-container">
                            {!isEdit ? (
                                <Button type="primary" htmlType="submit" className="btn">
                                    保存信息
                                </Button>
                            ) : (
                                <>
                                    <Button type="primary" htmlType="submit" className="btn">
                                        确认修改
                                    </Button>
                                    <Button onClick={back} type="default" className="btn gray-btn">
                                        返回
                                    </Button>
                                </>
                            )}
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}


export default PersonInfo;
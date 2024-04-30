import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import style from './index.module.scss'
import login_desc from './assets/login_desc.png'
import login_logo from './assets/login_logo.png'
import login_title_cn from './assets/login_title_cn.png'
import login_title_en from './assets/login_title_en.png'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/store/index';
import { set_user_info } from '@/store/slice/user';
import { loginPost, LoginBody } from '@/util/request';



const COUNT = 60; // 倒计时时间

const LoginPage: FC = () => {

    const [count, setCount] = useState(0); // 倒计时
    const [form] = Form.useForm(); // 表单
    const [, contextHolder] = message.useMessage(); // 全局提示
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); // 路由跳转

    // 开始倒计时
    useEffect(() => {
        setTimeout(() => {
            if (count === 0) {
                return
            } else {
                setCount(count - 1)
            }
        }, 1000)
    }, [count]);

    const startCode = () => {
        if (count !== 0) return
        form
            .validateFields(['phone'])
            .then(() => {
                setCount(COUNT)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onFinishFailed = (errorInfo: any) => {
    }

    async function onLogin(values: LoginBody) {
        const user_info = await loginPost(values); // 登录
        dispatch(set_user_info(user_info)); // 保存用户信息

        if (!user_info.has_person_info) {
            return navigate('/person_info');
        } else {
            if (user_info.role === 'student') {
                return navigate('/exam_select');
            }

            if (user_info.role === 'admin') {
                navigate('/corret_exam_list')
            }

            if (user_info.role === 'super_admin') {
                navigate('/corret_exam_list')
            }
        }
    }

    return (
        <div className={style.page_container}>
            {contextHolder}
            <div className={style.login_container}>
                <div className={style.login_left}>
                    <div className={style.left_title}>
                        <img src={login_desc} alt="" />
                    </div>
                </div>
                <div className={style.login_right}>
                    <div className={style.right_title}>
                        <div>
                            <img src={login_logo} alt="" />
                        </div>
                        <div className={style.title_container}>
                            <div>
                                <img src={login_title_cn} alt="" />
                            </div>
                            <div>
                                <img src={login_title_en} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={style.right_form}>
                        <Form
                            onFinish={onLogin} // 提交表单
                            size='large' // 大小
                            labelCol={{ span: 5 }} // label占比
                            wrapperCol={{ span: 20 }} // input占比
                            labelAlign='left' // label对齐方式
                            onFinishFailed={onFinishFailed} // 提交失败
                            form={form} // 表单
                        >
                            <Form.Item
                                label='用户名' // label
                                name='phone' // 字段
                                rules={[
                                    { required: true, message: '请输入手机号' },
                                    { pattern: new RegExp(/^1[3456789]\d{9}$/), message: '请输入正确的手机号' } // 规则
                                ]} // 规则
                            >
                                <Input
                                    placeholder='请输入' // 提示
                                />
                            </Form.Item>
                            <div style={{ position: 'relative' }}>
                                <Form.Item
                                    label='验证码' // label
                                    name='code' // 字段
                                    rules={[
                                        { required: true, message: '请输入验证码' }
                                    ]} // 规则
                                >
                                    <Input
                                        placeholder='请输入验证码' // 提示
                                        style={{ padding: '7px 100px 7px 11px' }} // 样式
                                    />
                                </Form.Item>
                                <div className={[style.form_code_btn, count !== 0 ? style.form_code_btn_disabled : ''].join(' ')} onClick={startCode}>
                                    {count === 0 ? '获取验证码' : `${count}秒`}
                                </div>
                            </div>
                            <div className={style.form_btn}>
                                <Button
                                    type='primary' // 类型
                                    htmlType='submit' // 提交
                                >
                                    登录
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginPage;
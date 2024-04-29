import { Modal, Form, Select, Input } from "antd";
import React, { useState, useEffect } from "react";
import axios from "@/util/http";
import styles from "./course.module.scss";
import { subjectAddPost } from '../../../util/request';

interface CourseAddProps {
  children: React.ReactElement; // 子元素
  handleSuccess?: () => void; // 成功回调
  handleOk?: () => void; // 确定
  handleCancel?: () => void; // 取消
}

type Course = {
  name: string; // 课程名
  key: string; // 课程id
}

export default function CourseAdd(props: CourseAddProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 是否打开模态框
  const [loading, setLoading] = useState<boolean>(false); // 是否加载中
  const [submitLoading, setSubmitLoading] = useState<boolean>(false); // 是否提交中
  const [option, setOption] = useState<Course[]>([]); // 课程列表
  const [formRef] = Form.useForm(); // 表单
  const _handleOpen = () => { // 打开
    setIsModalOpen(true); // 设置打开
    props.handleOk && props.handleOk(); // 有确定回调就执行，没有就不执行
  }
  const handleOk = () => {// 确定
    setSubmitLoading(true); // 设置提交中
    formRef.validateFields().then(async (formData) => {
      //console.log('@@@@@formData', formData) // formData是一个对象，里面是表单的值返回one_key："webpack"和two_name:"w1"
      await subjectAddPost(formData); // axios post表单数据，新增课程
      props.handleSuccess && props.handleSuccess(); // 有成功回调就执行，没有就不执行
      setIsModalOpen(false); // 设置关闭
    })
      .catch(console.error)
      .finally(() => {
        setSubmitLoading(false); // 设置提交中
      }
      )
    return;
  }
  const handleCancel = () => { // 取消
    setIsModalOpen(false); // 设置关闭
    props.handleCancel && props.handleCancel();
  }
  const withOpen = (node: React.ReactElement) => {
    return <span onClick={_handleOpen}>{node}</span> // 点击打开
  }
  const getData = () => {
    setLoading(true); // 设置加载中
    setTimeout(() => {
      axios.get('/api/subject/one').then((res) => { // 获取一级课程
        return res.data.data
      }).then(setOption) // 返回是array，里面是对象，对象是name和key
      setLoading(false);
    }, 1)
  }
  useEffect(() => {
    if (isModalOpen) {
      getData();
      formRef.resetFields(); // 重置表单
    }
  }, [isModalOpen, formRef])

  return (
    <>
      {
        withOpen(props.children) // 打开
      }
      <Modal
        confirmLoading={submitLoading} // 确认加载中
        className={styles.modal}
        title="新增课程"
        open={isModalOpen} // 打开
        onOk={handleOk} // 确定
        onCancel={handleCancel} // 取消
        okText="确定"
        cancelText="取消"
      >
        <Form form={formRef}>
          <Form.Item
            name="one_key" // 一级课程
            label="课程类别"
            rules={[{ required: true, message: '请选择课程类别' }]} // 规则
          >
            <Select
              fieldNames={{ label: 'name', value: 'key' }} //在option中的只有name和key，label是选项的显示文本，value是选项的实际值
              loading={loading} // 加载中
              aria-label="name" // 如果一个使用屏幕阅读器的用户访问这个 Select 组件，屏幕阅读器会读出 "name"，以帮助用户理解这个组件的功能。
              options={option} // 选择框的选项数据
            ></Select>
          </Form.Item>
          <Form.Item
            name={"two_name"}
            label="课程名称"
            rules={[{ required: true, message: "请填写课程名称！" }]}>
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
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
    props.handleOk && props.handleOk();
  }
  const handleOk = () => { // 确定
    setSubmitLoading(true); // 设置提交中
    formRef.validateFields().then(async (formData) => {
      await subjectAddPost(formData); // 新增课程
      props.handleSuccess && props.handleSuccess(); // 成功回调
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
  const withOpen = (node: React.ReactElement) => { // 打开
    return <span onClick={_handleOpen}>{node}</span> // 点击打开
  }
  const getData = () => {
    setLoading(true); // 设置加载中
    setTimeout(() => {
      axios.get('/api/subject/one').then((res) => { // 获取一级课程
        return res.data.data
      }).then(setOption) // 设置课程列表
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
        confirmLoading={submitLoading} // 确认加载
        className={styles.modal}
        title="新增课程"
        open={isModalOpen} // 打开
        onOk={handleOk} // 确定
        onCancel={handleCancel} // 取消
      >
        <Form form={formRef}>
          <Form.Item
            name="one_key" // 一级课程
            label="课程类别"
            rules={[{ required: true, message: '请选择课程类别' }]} // 规则
          >
            <Select
              fieldNames={{ label: 'name', value: 'key' }} // 字段名
              loading={loading} // 加载中
              airia-label="name" // 名称
              options={option} // 选项
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
import { Button, Empty, List, message, Popconfirm, Spin } from 'antd'
import classNames from 'classnames'
import { select_topic_two_list, select_active_two, get_topic_two_list, select_subject_loading, set_subject_active_topic, select_active_topic } from '@/store/slice/subject'
import request from '@/util/http'
import { useAppDispatch, useAppSelector } from '@/store'
import { useCallback } from 'react'
import useRenderCheck from '../../../hooks/renderCheck'


export default function TopicList() {

    let list = useAppSelector(select_topic_two_list)




    const loading = useAppSelector(select_subject_loading)

    // 还要优化空间
    const currentlesson = useAppSelector(select_active_two)

    const currentTopic = useAppSelector(select_active_topic)

    const dispatch = useAppDispatch()

    useRenderCheck('TopicList')

    // 删除题目
    const deleteTopic = async (id: string) => {
        try {
            // 删除接口
            await request.delete(`/api/topic/${id}`)
            message.success('删除成功')

            // 如果当前选择的题目id和删除的id一致 则在删除成功后清空当前题目数据
            if (currentTopic?._id === id) {
                dispatch(set_subject_active_topic(null))
            }

            dispatch(get_topic_two_list(currentlesson!.value))
        } catch {
            message.error('删除失败')
        }
    }

    function testClick() { }

    // 同理，useMemo
    const memoCb = useCallback(testClick, [])

    return (
        <Spin spinning={loading}>
            {/* <TestMemo handleClick={memoCb} /> */}
            {/* <TestRenderList list={list} /> */}
            {list.length ? (
                <List
                    split={false}
                    className="topic-list"
                    dataSource={list}
                    rowKey={'_id'}
                    renderItem={(item, index) => (
                        <List.Item
                            className={classNames('topic-item', { active: currentTopic?._id === item._id })}
                            onClick={() => dispatch(set_subject_active_topic(item))}
                            actions={[
                                <Popconfirm
                                    title="提示"
                                    description="确定要删除吗？"
                                    onConfirm={(e) => {
                                        e?.stopPropagation()
                                        deleteTopic(item._id)
                                    }}
                                    onCancel={(e) => e?.stopPropagation()}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="link" danger onClick={(e) => e.stopPropagation()}>
                                        删除
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            {index + 1}、{item.title}
                        </List.Item>
                    )}
                />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Spin>
    )
}

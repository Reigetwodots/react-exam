import styles from './index.module.scss'
import logo from './assets/logo.png'
import avatar from './assets/avatar.png'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Typography, Dropdown, List, Popover, Button, message } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { select_user_info } from '@/store/slice/user'
import { getImgUrl } from '@/util'
import axios from '@/util/http'
import { logoutRequest } from '../../util/request';
import { useState } from 'react';

const { Text } = Typography



export default function Header() {

    const navigate = useNavigate() // 路由跳转
    const userinfo = useAppSelector(select_user_info) // 用户信息

    async function logout() {
        await logoutRequest()
        navigate('/login')
    }

    function logo_click() {
        if (userinfo.role === 'student') {
            navigate('/exam_select')
        }
        if (userinfo.role === 'admin') {
            navigate('/corret_exam_list')
        }
        if (userinfo.role === 'super_admin') {
            navigate('/corret_exam_list')
        }
    }

    const [hovered, setHovered] = useState(false);
    const handleHoverChange = (open: boolean) => {
        setHovered(open);
    };

    const hoverContent = <List
        style={{ width: '240px', userSelect: 'none' }} // 设置宽度
        dataSource={[{}]} // 数据源
        renderItem={(item) => (
            <List.Item style={{ fontSize: '12px' }}>
                您于2023-06-15 13:45进行的React源码考试已批阅，请前往
                <a
                    href='/'
                    style={{ color: '#1677ff' }}
                    type='link'
                    onClick={(e) => {
                        e.preventDefault()
                        navigate('/subject_add')
                    }}
                >查看</a>
            </List.Item>
        )}
    >

    </List>;

    return (
        <div className={styles.wrap}>
            <div className="logo" onClick={logo_click}>
                <img src={logo} alt="logo" />
            </div>
            <div className='info'>
                <Popover
                    placement='bottomRight' // 弹出位置
                    style={{ width: 500 }}
                    content={hoverContent}
                    title="Hover title"
                    trigger="hover"
                    open={hovered}
                    onOpenChange={handleHoverChange}
                >
                    <Badge
                        size='small'  // 大小
                        count={10} // 数量
                        overflowCount={99} // 超过99显示99+
                        offset={[-5, 5]} // 偏移量
                    >
                        <div className="message" />
                    </Badge>
                </Popover>

                <div className="profile">
                    <Dropdown
                        placement="bottomRight" // 弹出位置
                        arrow // 是否显示箭头
                        menu={{
                            items: [{
                                key: 'uesr',
                                label: (
                                    <Button
                                        style={{ color: 'unset' }}
                                        type='link'
                                        onClick={() => {
                                            navigate('/person_info')
                                        }
                                        }
                                    >
                                        个人中心
                                    </Button>
                                )
                            },
                            {
                                key: 'logout',
                                label: (
                                    <Button
                                        style={{ color: 'unset' }}
                                        type='link'
                                        onClick={logout}
                                    >
                                        退出登录
                                    </Button>
                                )
                            }
                            ]
                        }}
                    >
                        <Avatar
                            className='avatar'
                            size={44} // 大小
                            src={getImgUrl(userinfo.avatar) || avatar}  // 头像
                            draggable={false} // 是否可拖拽
                        ></Avatar>
                    </Dropdown>
                    <div className="name">
                        <Text
                            style={{ width: '100px' }}
                            ellipsis={{ tooltip: userinfo?.name }} // 文字超出显示省略号
                        >
                            {userinfo?.name}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}


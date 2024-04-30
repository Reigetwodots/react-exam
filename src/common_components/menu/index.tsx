import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import usePathKey from '@/hooks/usePathKey';
import { useAppSelector } from '@/store/index';
import { select_menu } from '@/store/slice/user';

type MenuItem = {
    label: string
    key: string
    path: string
}

const App: React.FC = () => {

    const [current, setCurrent] = useState('');
    const Navigate = useNavigate()
    const path_key = usePathKey()
    let menus: MenuItem[] = useAppSelector(select_menu)
    menus = menus.map((item) => {
        return {
            label: item.label,
            key: item.key,
            path: item.path
        }
    })

    useEffect(() => {
        if (path_key) {
            setCurrent(path_key)
        }
    }, [path_key]) // 需要传入依赖才解决跳转问题

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        const path = menus.find((item) => {
            return item.key === e.key
        })?.path as string
        Navigate(path)
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menus} >
    </Menu>;

};

export default App;
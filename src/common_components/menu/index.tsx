import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { type RouterKey, routersData, superAdminMenus } from '@/config';
import { useNavigate } from 'react-router-dom';
import usePathKey from '@/hooks/usePathKey';

const App: React.FC = () => {
    const [current, setCurrent] = useState('');
    const navigate = useNavigate();
    const path_key = usePathKey();
    const menus = superAdminMenus;
    useEffect(() => {
        if (path_key) {
            setCurrent(path_key);
        }
    }, [path_key]);
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navigate(routersData[e.key as RouterKey].path);
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menus} />;
};

export default App;
import { Outlet } from "react-router-dom";
import Header from "./header";
import Menu from "./menu";
import useIsShowMenu from "../hooks/useIsShowMenu";
import useIsShowHeader from "../hooks/useIsShowHeader";
import { useAppDispatch, useAppSelector } from '../store/index';
import { select_user_info, get_menu_async } from "@/store/slice/user";
import { useEffect } from "react";
import classnames from 'classnames'

function Layout() {
    const dispatch = useAppDispatch();
    const UserInfo = useAppSelector(select_user_info);
    const is_show_menu = useIsShowMenu();
    const is_show_header = useIsShowHeader();

    useEffect(() => {
        dispatch(get_menu_async())
    }, [])

    return (
        <div className={classnames({
            layout: true,
            hide: !UserInfo._id
        })}>
            {
                is_show_header ? (
                    <div className="header_wrap">
                        <Header />
                    </div>
                ) : null
            }

            <div className="outlet_wrap">
                {
                    is_show_menu ? (
                        <div className="nav_wrap">
                            <Menu />
                        </div>
                    ) : null
                }
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;
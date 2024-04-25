import { Outlet } from "react-router-dom";
import Header from "./header";
import Menu from "./menu";
import useIsShowMenu from "../hooks/useIsShowMenu";
import useIsShowHeader from "../hooks/useIsShowHeader";


function Layout() {

    const is_show_menu = useIsShowMenu();
    const is_show_header = useIsShowHeader();
    return (
        <div className="layout">
            {is_show_header ? <div className="header_wrap">
                <Header></Header>
            </div> : null}

            {is_show_menu ? (<div className="menu_wrap">
                <Menu></Menu>
            </div>) : null}

            <div className="outlet_wrap">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;
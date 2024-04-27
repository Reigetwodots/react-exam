import { useLocation } from "react-router-dom";
import { type RouterKey } from "../config";
import { useAppSelector } from "@/store";
import { select_menu } from "@/store/slice/user";

function useIsShowMenu() {
    const location = useLocation();
    const menus = useAppSelector(select_menu) // 获取菜单
    const key: RouterKey = location.pathname.split('/')[1] as RouterKey

    if (!key || !menus.length) {
        return false
    }

    const menu = menus.find((item) => {
        return item.key === key
    })

    if (menu?.hasMenu) {
        return true
    } else {
        return false
    }
}

export default useIsShowMenu;
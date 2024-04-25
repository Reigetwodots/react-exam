import { useLocation } from "react-router-dom";
import { type RouterKey, routersData } from "../config";

function useIsShowMenu() {
    const location = useLocation();
    console.log('location', location)

    const key: RouterKey = location.pathname.split('/')[1] as RouterKey

    if (!key) {
        return false
    }

    if (routersData[key].hasMenu) {
        return true
    } else {
        return false
    }
}

export default useIsShowMenu;
import { useLocation } from 'react-router-dom';
import { type RouterKey } from '@/config';

function usePathKey() {
    const location = useLocation();
    const key: RouterKey = location.pathname.split('/')[1] as RouterKey;

    return key;
}

export default usePathKey;
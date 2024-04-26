import { useRef } from 'react';

function useRenderCheck(cp_name: string) {
  // 组件名称
  const ref = useRef(0);
  ref.current++;
  console.log(`${cp_name}渲染次数`, ref.current);
}

export default useRenderCheck;

import ListTable from "./ListTable"
import Search from "./Search"
import Modal from "./Modal"
import useRenderCheck from '@/hooks/renderCheck';



function StudentManage() {

    useRenderCheck('StudentManage')

    return (
        <div className="wrap" >
            <Search></Search>
            <ListTable></ListTable>
            <Modal />
        </div>
    )
}

export default StudentManage
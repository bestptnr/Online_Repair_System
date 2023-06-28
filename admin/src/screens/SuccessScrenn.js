import React from 'react'
import Navbar from '../components/NavBar'
import jwt_decode from 'jwt-decode'
import Modal from 'react-modal';

import { getrequestpage, successRequest, getrequestprocess } from '../service/ControlAPI'

import toast, { Toaster } from 'react-hot-toast';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const SuccessScrenn = () => {
    const [loading, setLoing] = React.useState(false)
    const [content, setContent] = React.useState([])
    const [page, setPage] = React.useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [report ,setReport] = React.useState("");

    React.useEffect(() => {
        (async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const page = searchParams.get('page');
         
            const countpage = page ? page : 1;
            const token = await localStorage.getItem('token')
            const data = jwt_decode(token)
       
            const content = await successRequest({ page: countpage, id: data._id })
            let looppage = []
            for (let index = 0; index < content.data.page; index++) {
                looppage.push(index + 1)

            }
            console.log(looppage.length)
            if(looppage.length>1){
                looppage.pop()
            }
            
            setContent(content.data.content)
            setPage(looppage)
            setLoing(true)
        })()
    }, [])


    if (!loading) {
        return (
            <div>
                กำลังโหลดข้อมูล
            </div>
        )
    }
    return (
        <>
            <Navbar />
            <div className='container'>
                <div className='mt-5 mb-5'>
                    <h3>ตารางการซ่อมที่เสร็จสิ้น</h3>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{
                                width: '5%'
                            }}>ไอดี</th>
                            <th style={{
                                width: '10%'
                            }}>รูปภาพ</th>
                            <th style={{
                                width: '10%'
                            }}>ผู้แจ้ง</th>
                              <th style={{
                                width: '10%'
                            }}>ติดต่อ</th>
                            <th style={{
                                width: '20%'
                            }}>รายละเอียด</th>
                            <th style={{
                                width: '10%'
                            }}>วันเวลาที่แจ้ง</th>
                            <th style={{
                                width: '10%'
                            }} >เสร็จสิ้นเมื่อ</th>
                            <th style={{
                                width: '10%'
                            }}>สถานะ</th>

                        </tr>
                    </thead>
                    <tbody>

                        {content.map((item) => {
                            const status = [
                                { id: 1, name: "ยังไม่ดำเนินการ", color: "#FD8A8A" },
                                { id: 2, name: "กำลังดำเนินการ", color: "#FFDB89" },
                                { id: 3, name: "ซ่อมเสร็จสิ้น", color: "#B6E2A1" }
                            ]
                            const checkStatus = status.filter((i) => {
                                if (item.status === i.id) return i
                            })

                            const dateObj = new Date(item.create_at).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
                            const success = new Date(item.update_at).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
                            return (
                                <tr>

                                    <td>{item.reqID}</td>
                                    <td style={{
                                        background: "#F5F5F5",
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>{
                                            item.images ? <img height="70" src={`http://localhost:3000/images/${item.images}`}></img>
                                                : <div style={{ height: 70 }}>ไม่มีรูปภาพ</div>
                                        }</td>
                                    <td>{item.fullname}</td>
                                    <td>{item.email} {item.tel}</td>
                                    <td>{item.equName} {item.roomName} {item.buildingname} {item.description.length > 30 ? item.description.slice(0, 30) + "...." : item.description}</td>
                                    <td>{dateObj}</td>
                                    <td>
                                       {success}


                                    </td>
                                    <td><a className='btn ' style={{ background: checkStatus[0].color }}>{checkStatus[0].name}</a></td>
        
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href={`/success?page=${page[0]}`} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {page.map((item) => {
                            return (
                                <li className="page-item"><a className="page-link" href={`/success?page=${item}`}>{item}</a></li>
                            )
                        })}

                        <li className="page-item">
                            <a className="page-link" href={`/success?page=${page[page.length - 1]}`} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

        </>
    )
}

export default SuccessScrenn
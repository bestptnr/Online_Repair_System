import React from 'react'
import Navbar from '../components/NavBar'
import jwt_decode from 'jwt-decode'
import Modal from 'react-modal';

import { savesuccess, getrequestprocess } from '../service/ControlAPI'

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

const ProcessScrenn = () => {
    const [loading, setLoing] = React.useState(false)
    const [content, setContent] = React.useState([])
    const [page, setPage] = React.useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [report ,setReport] = React.useState("");
    const [id,setID] = React.useState();
    React.useEffect(() => {
        (async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const page = searchParams.get('page');
            const countpage = page ? page : 1;
        
            const token = await localStorage.getItem('token')
            const data = jwt_decode(token)
            setID(data._id)
            const content = await getrequestprocess({ page: countpage, id: data._id })
            let looppage = []
            for (let index = 0; index < content.data.page; index++) {
                looppage.push(index + 1)

            }
          
            if(looppage.length>1){
                looppage.pop()
            }
            setContent(content.data.content)
            setPage(looppage)
            setLoing(true)
        })()
    }, [])
    const savework = async (report) => {
        
        const send = await savesuccess({
            id: report.reqID,
            request: report.report
        })
        if(send.data.success){
           
            toast.success( 'รับงานเรียบร้อย สามารถไปเช็คที่เมนูดำเนินการเสร็จสิ้น !')
            
            setTimeout(()=>{
                window.location.reload()
            },1500)
        }

    }

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
            <Toaster />
            <div className='container'>
                <div className='mt-5 mb-5'>
                    <h3>ตารางการซ่อมที่กำลังดำเนินการ</h3>
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
                            }}>ประเภทการซ่อม</th>
                            <th style={{
                                width: '10%'
                            }}>วันเวลาที่แจ้ง</th>
                            <th style={{
                                width: '10%'
                            }} >สถานะ</th>
                            <th style={{
                                width: '10%'
                            }}>จัดการ</th>


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
                            return (
                                <tr style={{

                                }}>
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
                                    <td>{item.typename}</td>
                                    <td>{dateObj}</td>
                                    <td><a className='btn ' style={{ background: checkStatus[0].color }}>{checkStatus[0].name}</a></td>
                                    <td>
                                        <button type="button" class="btn btn-primary" onClick={()=>setReport("")} data-bs-toggle="modal" data-bs-target={`#exampleModal${item.reqID}`}>
                                            ปิดงาน
                                        </button>


                                        <div class="modal fade" id={`exampleModal${item.reqID}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5" id="exampleModalLabel">คำร้องที่ {item.reqID} </h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        รูปภาพ  <br></br>
                                                        <div>
                                                            <img style={{ height: 200 }} src={`http://localhost:3000/images/${item.images}`}></img>
                                                        </div>
                                                        <br></br>
                                                        ชื่อผู้แจ้ง
                                                        <input type="text" name="user" value={item.fullname} className="form-control" disabled></input>
                                                        สถานะ
                                                        <input type="text" name="user" value={item.type} className="form-control" disabled></input>
                                                        Email
                                                        <input type="text" name="user" value={item.email} className="form-control" disabled></input>
                                                        เบอร์โทรศัพท์
                                                        <input type="text" name="user" value={item.tel} className="form-control" disabled></input>
                                                        ประเภทการซ่อม
                                                        <input type="text" name="type" value={item.typename} className="form-control" disabled></input>
                                                        เวลาที่แจ้ง
                                                        <input type="text" name="type" value={dateObj} className="form-control" disabled></input>
                                                        <br></br>
                                                        รายงานหลังซ่อม
                                                        <textarea name="report" className='form-control' rows={5} onChange={(e)=>setReport(e.target.value)}>


                                                        </textarea>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" style={{backgroundColor:"#FD8A8A"}} data-bs-dismiss="modal">ปิด</button>
                                                        <button type="button" class="btn btn-primary" onClick={() => {
                                                            savework({report:report,reqID:item.reqID})
                                                        }}>ตกลง</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href={`/process?page=${page[0]}`} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {page.map((item) => {
                            return (
                                <li className="page-item"><a className="page-link" href={`/process?page=${item}`}>{item}</a></li>
                            )
                        })}

                        <li className="page-item">
                            <a className="page-link" href={`/process?page=${page[page.length - 1]}`} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

        </>
    )
}

export default ProcessScrenn
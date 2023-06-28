import React from 'react'
import Navbar from '../components/NavBar'
import jwt_decode from 'jwt-decode'
import { getrequestpage, acceptRequest } from '../service/ControlAPI'
import toast, { Toaster } from 'react-hot-toast';
const RequestScreen = () => {
    const [loading, setLoing] = React.useState(false)
    const [content, setContent] = React.useState([])
    const [page, setPage] = React.useState([])

    React.useEffect(() => {

        (async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const page = searchParams.get('page');
            const countpage = page ? page : 1;

            const content = await getrequestpage(countpage)
            let looppage = []
            for (let index = 0; index < content.data.page; index++) {
                looppage.push(index + 1)

            }
            setContent(content.data.content)
            looppage.pop()
            setPage(looppage)
     
            setLoing(true)
   

        })()
    }, [])
    const acceptWork = async (id) => {
    
        const token = await localStorage.getItem('token')
        const data = jwt_decode(token)
        const send = await acceptRequest({
            id: data._id,
            request: id
        })
        if(send.data.success){
           
            toast.success( 'รับงานเรียบร้อย สามารถไปเช็คที่เมนูกำลังดำเนินการ !')
            
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
                    <h3>ตารางการแจ้งซ่อม</h3>
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

                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#exampleModal${item.reqID}`}>
                                            รับงาน
                                        </button>


                                        <div className="modal fade" id={`exampleModal${item.reqID}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5 fw-bold" id="exampleModalLabel">คำร้องที่ {item.reqID} </h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body fw-bold">
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
                                                        รายละเอียด
                                                        <br></br>
                                                        <textarea className='form-control' name="detail" disabled>
                                                            {item.equName + " ห้อง: " + item.roomName + " " + item.buildingname + "\n" + item.description}
                                                        </textarea>




                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn" style={{ backgroundColor: '#FD8A8A' }} data-bs-dismiss="modal">ปิด</button>
                                                        <button type="button" className="btn btn-primary" onClick={() => {

                                                            acceptWork(item.reqID)

                                                        }}>ยืนยัน</button>
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
                            <a className="page-link" href={`/request?page=${page[0]}`} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {page.map((item) => {
                            return (
                                <li className="page-item"><a className="page-link" href={`/request?page=${item}`}>{item}</a></li>
                            )
                        })}

                        <li className="page-item">
                            <a className="page-link" href={`/request?page=${page[page.length - 1]}`} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

        </>
    )
}

export default RequestScreen
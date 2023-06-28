import React from 'react'
import NavBar from '../components/NavBar'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getrequest, getAllRequest } from "../service/ControlAPI"


const HomeScreen = () => {
    const [count, setCount] = React.useState(0)
    const [oparator, setOparator] = React.useState(0)
    const [success, setSuccess] = React.useState(0)
    const [loading, setLoing] = React.useState(false)
    const [table, setTable] = React.useState(0)
    const [chart, setChart] = React.useState([])
    let number = 0;
    React.useEffect(() => {
        (async () => {
            const data = await getrequest()
            const all = await getAllRequest()
        
            if (data.data.success && all.success) {
                setCount(data.data.request.count)
                setOparator(data.data.operator.count)
                setSuccess(data.data.success.count)
                setTable(all.data)
                let chartdata =[]
                data.data.chart.map((item)=>{
                    const data = {
                        name : item.equName,
                        uv:item.count
                    }
                    chartdata.push(data)
                
                })
                setChart(chartdata)
            }   
            
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
        <div>

            <NavBar />
            <div className="row justify-content-around mt-3">
                <div className="col-12 col-sm-6 col-md-4">
                    <div className='p-3 d-flex justify-content-between' style={{
                        marginTop: '5%',
                        marginBottom: '5%',
                        boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                        borderRadius: 5,
                    }}>
                        <div >
                            <div style={{ fontWeight: 700 }}>
                                ยังไม่ได้รับการซ่อม
                            </div>
                            <div className='mt-2'>
                                {count} รายการ
                            </div>
                        </div>
                        <div style={{
                            height: 50,
                            width: 50,
                            background: '#FD8A8A',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5
                        }}>
                            <AiIcons.AiTwotoneNotification style={{ fontSize: '1.5rem' }} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <div className='p-3 d-flex justify-content-between' style={{
                        marginTop: '5%',
                        marginBottom: '5%',
                        boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                        borderRadius: 5,
                    }}>
                        <div >
                            <div style={{ fontWeight: 700 }}>
                                กำลังซ่อม
                            </div>
                            <div className='mt-2'>
                                {oparator} รายการ
                            </div>
                        </div>
                        <div style={{
                            height: 50,
                            width: 50,
                            background: '#FFDB89',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5
                        }}>
                            <AiIcons.AiTwotoneNotification style={{ fontSize: '1.5rem' }} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <div className='p-3 d-flex justify-content-between' style={{
                        marginTop: '5%',
                        marginBottom: '5%',
                        boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                        borderRadius: 5,
                    }}>
                        <div >
                            <div style={{ fontWeight: 700 }}>
                                ซ่อมเสร็จสิ้น
                            </div>
                            <div className='mt-2'>
                                {success} รายการ
                            </div>
                        </div>
                        <div style={{
                            height: 50,
                            width: 50,
                            background: '#B6E2A1',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5
                        }}>
                            <AiIcons.AiTwotoneNotification style={{ fontSize: '1.5rem' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='container' style={{ zIndex: -1 }}>
                <div className='row'>
                    <div className='col-12 col-sm-12 col-md-12  col-xl-6 border'>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ชื่อผู้แจ้ง</th>
                                    <th scope="col">รายละเอียด</th>
                                    <th scope="col">เวลาที่แจ้ง</th>
                                    <th scope="col">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((item) => {
                                    const dateObj = new Date(item.create_at).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
                                    const status = [
                                        { id: 1, name: "ยังไม่ดำเนินการ", color: "#FD8A8A" },
                                        { id: 2, name: "กำลังดำเนินการ" ,color:"#FFDB89"},
                                        { id: 3, name: "ซ่อมเสร็จสิ้น" ,color:"#B6E2A1"}
                                    ]
                                    const checkStatus = status.filter((i)=>{
                                        if(item.status === i.id) return i
                                    })
                                    number++
                                    return (
                                        <tr>
                                            <td>{number}</td>
                                            <td>{item.fullname.length > 20 ? item.fullname.slice(0,20)+"...." : item.fullname}</td>
                                            <td>{item.equName} ห้อง {item.roomName} {item.buildingname}</td>
                                            <td>{dateObj}</td>
                                            <td><a className='btn ' style={{ background: checkStatus[0].color }}>{checkStatus[0].name}</a></td>

                                        </tr>
                                    )
                                })}
                              
                            </tbody>
                        </table>

                    </div>
                    <div className='col-12 col-sm-12 col-md-12 col-xl-6'>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={chart}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="2 3" />
                                <Tooltip />
                                <Bar dataKey="uv" fill="#0F75BC" />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                </div>


            </div>


        </div>

    )
}

export default HomeScreen
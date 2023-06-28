
import React, { useState, useEffect } from "react";
import "../stylesheets/login.css"
import "../stylesheets/style.css"
import swal from "sweetalert";
import axios from "axios";
import * as yup from "yup";
import { useFormik, validateYupSchema } from "formik";
import {
    BrowserRouter as Router,
    Link,
    redirect,
    useNavigate,
    withRouter
} from "react-router-dom";

import { TechAuth } from "../service/ControlAPI"
const LoginScreen = () => {
    const [status, setStatus] = useState("เข้าสู่ระบบ");
    const navigation = useNavigate()
    const formSchema = yup.object({
        email: yup.string().email("Email ไม่ถูกต้อง").required("กรุณาใส่ email"),
        pwd: yup
            .string()
            .required("กรุณากรอกรหัสผ่าน")
            .min(6, "รหัสต้องมากกว่า 6 ตัวอักษร")
            .max(30),
    });
    const formik = useFormik({
        initialValues: {
            email: "",
            pwd: "",
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            setStatus("กำลังดำเนินการ")
            const send = await TechAuth(values)
            if(send.success){
                console.log(send.token)
                localStorage.setItem("token",send.token)

                setTimeout(()=>{
                    swal(send.message, "success", {
                        // icon: "success",
                        buttons: false,
                        text: " ",
                        timer: 1000,
                    });

                },1000)
                setTimeout(()=>{
                    navigation('/home')
           

                },1000)
         
               }else{
                swal(send.message, "success", {
                    icon: "error",
                    buttons: false,
                    text: " ",
                    timer: 3000,
                });
            }
      

        },
    });
    return (
        <form className='box-center' onSubmit={formik.handleSubmit}>
            <div >
            <div className='d-flex justify-content-center'>
                    <img src='/lgoo.png' className='box' height={'100%'} width={'50%'} />
                </div>
                <div className=' mx-auto'>
                    <h1 className='box fw-bold 0 mx-auto mt-3'>ระบบแจ้งซ่อมออนไลน์</h1>
                    <div className=' mx-auto mt-3 box' >
                        <p>อีเมล</p>
                        <input type="text" className='w-100 form-control'      id="email" {...formik.getFieldProps("email")} />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error">{formik.errors.email}</div>
                        ) : null}
                    </div >
                    <div className=' mx-auto mt-3 box'>
                        <p>รหัสผ่าน</p>
                        <input type="password" className='w-100 form-control' id="password" {...formik.getFieldProps("pwd")} />
                        {formik.touched.pwd && formik.errors.pwd ? (
                            <div className="error">{formik.errors.pwd}</div>
                        ) : null}
                    </div>
                    <div className=' mx-auto mt-3 box'>

                        <input type="submit" className='w-100 form-control btn' value={status} />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default LoginScreen
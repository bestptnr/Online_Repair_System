const express = require("express");
const router = express.Router();
var mysql = require("mysql2/promise");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const connection = async () =>{
    var dbConn =  mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "repair_system",
        multipleStatements: true,
    });
    return dbConn
}
const validate = [
    body('fullname').isLength({ min: 2 }).withMessage("กรุณาใส่ชื่อจริง"),
    body('tel').isLength({ min: 10 }).withMessage("กรุณาใส่เบอร์ให้ถูกต้อง"),
    body('email').isEmail().withMessage("ใส่ Email เท่านั้น"),
    body('password').isLength({ min: 6 }).withMessage("กรุณาใส่รหัสผ่านเกิน 6 ตัว"),
]
const LoginValidate = [
    body('email').isEmail().withMessage("Please input email only"),
    body('password').isLength({ min: 6 }).withMessage("Password must be less 6 charecter")
]
const generateToken = user => {
    console.log(user)
    return jwt.sign({ _id: user.userID, email: user.email, fullname: user.fullname, tel: user.tel }, "COPOBEST123")
}
router.get("/zone", async (req, res) => {
    var dbConn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "repair_system",
        multipleStatements: true,
    });
    dbConn.query("SELECT * FROM equipment_type", (error, results, fields) => {
        if (error)
            throw error;
        return res.send(results);
    });
});

router.post('/login', LoginValidate, async (req, res) => {
    var dbConn = await connection()
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.json({ errors: errors.array() }).status(400);
    }
    const [rows, fields] = await dbConn.execute(`SELECT * FROM user WHERE email = "${req.body.email}"`)
    if (rows.length==0) return res.send({ success: false, message: "ยังไม่ได้สมัครสมาชิก" }).status(404)
    const vaildpassword = await bcrypt.compare(req.body.password, rows[0].password)
    if (!vaildpassword) return res.send({ success: false, message: "Invalid Email or password" }).status(404)
    const token = generateToken(rows[0])
    console.log(token)
    res.header('auth-token', token).send({ success: true, message: "Login Successfully", token })
})
router.post('/register', validate, async (req, res) => {
    
    var dbConn = await connection()
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let userExit = false;
    const [rows, fields] = await dbConn.execute(`SELECT * FROM user WHERE email = "${req.body.email}"`)
     if (rows.length>0) return res.send({ success: false, message: "มีคนใช้อีเมลนี้แล้ว" }).status(404)
    const salt = await bcrypt.genSalt()
    const hashpassword = await bcrypt.hash(req.body.password, salt)
    console.log(hashpassword)
    const obj ={
        fullname:req.body.fullname,
        tel:req.body.tel,
        email:req.body.email,
        password:hashpassword,
        userTypeID:req.body.userTypeID
    }
    const addUser = await dbConn.execute(
        "INSERT INTO user (fullname, tel, email, password, userTypeID) VALUES (?,?,?,?,?)",
        [obj.fullname, obj.tel,obj.email, obj.password,obj.userTypeID],
      )
      const token = await generateToken({...obj,userID:addUser[0].insertId})
      
      if(addUser){
        console.log("CREATE USER")
        res.send({ success: true, data: {  userID:addUser[0].insertId,email: obj.email, fullname: obj.fullname,userTypeID:obj.userTypeID }, token })
      }
})

module.exports = router;
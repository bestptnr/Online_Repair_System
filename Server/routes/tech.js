const express = require("express");
const router = express.Router();
var mysql = require("mysql2/promise");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require("../routes/verify")

const connection = async () => {
    var dbConn = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "repair_system",
        multipleStatements: true,
    });
    return dbConn
}
const generateToken = user => {
    console.log(user)
    return jwt.sign({ _id: user.techID, email: user.email, fullname: user.fullname, tel: user.tel }, "COPOBEST123")
}
router.post('/login', async (req, res) => {
    console.log(req.body)
    var dbConn = await connection()
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.json({ errors: errors.array() }).status(400);
    }
    const [rows, fields] = await dbConn.execute(`SELECT * FROM tech WHERE email = "${req.body.email}"`)
    if (rows.length == 0) return res.send({ success: false, message: "ไม่มีข้อมูลของท่านในระบบ" }).status(404)
    const vaildpassword = await bcrypt.compare(req.body.password, rows[0].password)
    if (!vaildpassword) return res.send({ success: false, message: "Invalid Email or password" }).status(404)
    const token = generateToken(rows[0])
    res.header('auth-token', token).send({ success: true, message: "Login Successfully", token })
})

router.get('/all', verify, async (req, res) => {
    var dbConn = await connection()
    // SELECT COUNT(*) FROM `request` WHERE status = 1
    const [rows, fields] = await dbConn.execute(`SELECT COUNT(*) as count FROM request WHERE status = 1`)
    const [operator] = await dbConn.execute(`SELECT COUNT(*) as count FROM request WHERE status = 2`)
    const [success] = await dbConn.execute(`SELECT COUNT(*) as count FROM request WHERE status = 3`)
    const [chart] = await dbConn.execute(`SELECT COUNT(equipment.equID) as count ,equipment.equID  ,equipment.equName FROM request
    JOIN equipment ON (request.equID = equipment.equID)
    GROUP BY equipment.equID
    ORDER BY count DESC
    `)

    res.send({
        success: true, data: {
            request: rows[0],
            operator: operator[0],
            success: success[0],
            chart: chart
        }
    })

})
router.get("/request", verify, async (req, res) => {
    var dbConn = await connection()
    const pageSize = 5;
    let pageNumber = 1
    if (req.query.page) {
        pageNumber = req.query.page;
    }
    const offset = (pageNumber - 1) * pageSize;
    const [count] = await dbConn.execute(
        'SELECT COUNT(*) AS count FROM request'
    );
    const totalCount = count[0].count;
    const totalPages = Math.ceil(totalCount / pageSize);
    const [rows, fields] = await dbConn.execute(
        `SELECT  request.reqID,user.fullname,equipment.equName,request.images,building.name as buildingname , 
        room.roomName, userType.name as typename,user.email,user.tel,request.description,request.status,request.create_at,request.update_at,equipment_type.name as typename ,
        userType.name as type  FROM request
        JOIN user ON (request.userID = user.userID)
        JOIN equipment ON (request.equID = equipment.equID)
        JOIN room ON (request.roomID = room.roomID)
        JOIN building ON (room.buildID = building.buildID)
        JOIN userType ON (userType.userTypeID = user.userTypeID)
        JOIN equipment_type ON (equipment.equTypeID = equipment_type.equTypeID )
        WHERE request.status=1
        ORDER BY request.create_at DESC
         LIMIT ? OFFSET ?`,
        [pageSize, offset]
    );
    res.send({ page: totalPages, content: rows })
})
router.get("/request/:id", verify, async (req, res) => {
    var dbConn = await connection()

    const pageSize = 5;
    let pageNumber = 1
    if (req.query.page) {
        pageNumber = req.query.page;
    }
    const offset = (pageNumber - 1) * pageSize;
    const [count] = await dbConn.execute(
        `SELECT COUNT(*) AS count FROM request   WHERE status=2 AND techID=${req.params.id}`
    );
    const totalCount = count[0].count;
    const totalPages = Math.ceil(totalCount / pageSize);
    const [rows, fields] = await dbConn.execute(
        `SELECT  request.reqID,user.fullname,equipment.equName,request.images,building.name as buildingname , 
        room.roomName, userType.name as typename,user.email,user.tel,request.description,request.status,request.create_at,request.update_at,equipment_type.name as typename ,
        userType.name as type  FROM request
        JOIN user ON (request.userID = user.userID)
        JOIN equipment ON (request.equID = equipment.equID)
        JOIN room ON (request.roomID = room.roomID)
        JOIN building ON (room.buildID = building.buildID)
        JOIN userType ON (userType.userTypeID = user.userTypeID)
        JOIN equipment_type ON (equipment.equTypeID = equipment_type.equTypeID )
        WHERE request.status=2 AND techID=${req.params.id}
        ORDER BY request.create_at DESC
         LIMIT ? OFFSET ?`,
        [pageSize, offset]
    );
    res.send({ page: totalPages, content: rows })
})

router.get("/request/success/:id", verify, async (req, res) => {
    var dbConn = await connection()
  
    const pageSize = 5;
    let pageNumber = 1
    if (req.query.page) {
        pageNumber = req.query.page;
    }
    const offset = (pageNumber - 1) * pageSize;
    const [count] = await dbConn.execute(
    `SELECT COUNT(*) AS count FROM request WHERE status=3  AND techID=${req.params.id}`
    );
    const totalCount = count[0].count;
    const totalPages = Math.ceil(totalCount / pageSize);
    const [rows, fields] = await dbConn.execute(
        `SELECT  request.reqID,user.fullname,equipment.equName,request.images,building.name as buildingname , 
        room.roomName, userType.name as typename,user.email,user.tel,request.description,request.status,request.create_at,request.update_at  FROM request
        JOIN user ON (request.userID = user.userID)
        JOIN equipment ON (request.equID = equipment.equID)
        JOIN room ON (request.roomID = room.roomID)
        JOIN building ON (room.buildID = building.buildID)
        JOIN userType ON (userType.userTypeID = user.userTypeID)
        WHERE request.status=3 AND techID=${req.params.id}
        ORDER BY request.create_at DESC
         LIMIT ? OFFSET ?`,
        [pageSize, offset]
    );
    res.send({ page: totalPages, content: rows })
})
router.put("/accept", verify, async (req, res) => {
    var dbConn = await connection()
    console.log(`UPDATE request SET techID= ${req.body.techID} , status= 2 WHERE reqID= ${req.body.reqID}`)
    const  [rows, fields] = await dbConn.execute(`UPDATE request SET techID= ${req.body.techID} , status= 2 WHERE reqID= ${req.body.reqID}`)
    if(rows){
        res.send({success:true})
    }
    

})
router.put("/success", verify, async (req, res) => {
    var dbConn = await connection()
    console.log(req.body)
    // console.log(`UPDATE request SET techID= ${req.body.techID} , status= 2 WHERE reqID= ${req.body.reqID}`)
    const  [rows, fields] = await dbConn.execute(`UPDATE request SET techreport="${req.body.techreport}" , status= 3 WHERE reqID= ${req.body.reqID}`)
    if(rows){
        res.send({success:true})
    }
    

})
module.exports = router;
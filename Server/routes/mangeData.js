const express = require("express");
const router = express.Router();
var mysql = require("mysql2/promise");
const { body, validationResult } = require('express-validator');
const { join } = require('path');
const multer = require('multer');
const path = join(__dirname, `../public/images`)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path); // ตำแหน่งจัดเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".png"); //เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำกัน
    },
});
const upload = multer({
    storage: storage,
});

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

router.post('/getuser',async(req,res)=>{
    var dbConn = await connection()
    const [rows, fields] = await dbConn.execute(`SELECT * FROM user WHERE userID = "${req.body.userID}"`)
    console.log(req.body)
    res.send({success:true,data:rows[0]})

})

router.get('/getequ',async(req,res)=>{
    var dbConn = await connection()
    const [equ, fields] = await dbConn.execute(`SELECT * FROM equipment`)
    const [room] = await dbConn.execute(`SELECT room.roomID,room.roomName,building.buildID,building.name as buildingname FROM room 
    JOIN building ON (room.buildID = building.buildID)`)
    res.send({success:true,equ:equ,room:room})

})

router.post('/request', upload.single("photo"),async(req,res)=>{
    var dbConn = await connection()
    console.log(req.body)
    const {equID,roomID,description,uesrID} = req.body
    const filename = req.file.filename
    const addRequest = await dbConn.execute(
        "INSERT INTO request (description, images, userID, roomID, equID) VALUES (?,?,?,?,?)",
        [description, filename,uesrID ,roomID,equID],
      )
    if(addRequest){
        res.send({success:true})
    }
})
router.put('/request', upload.single("photo"),async(req,res)=>{
    var dbConn = await connection()
    if(req.file){
        const {equID,roomID,description,reqID} = req.body
        const filename = req.file.filename
        const addRequest = await dbConn.execute(
            `UPDATE request SET description="${description}", images="${filename}", roomID=${roomID}, equID=${equID} WHERE reqID=${reqID}`,
            [description, filename ,roomID,equID],
          )
        if(addRequest){
            res.send({success:true})
        }
    }else{
        const {equID,roomID,description,reqID} = req.body
        const addRequest = await dbConn.execute(
            `UPDATE request SET description="${description}", roomID=${roomID}, equID=${equID} WHERE reqID=${reqID}`,
            [description ,roomID,equID],
          )
        if(addRequest){
            res.send({success:true})
        }
    }
   
})


router.get('/getAllRequest',async(req,res)=>{
    var dbConn = await connection()
    const [data] = await dbConn.execute(`SELECT  request.reqID,user.fullname,equipment.equName,building.name as buildingname , 
    room.roomName ,request.description,request.status,request.create_at FROM request 
    JOIN user ON (request.userID = user.userID)
    JOIN equipment ON (request.equID = equipment.equID)
    JOIN room ON (request.roomID = room.roomID)
    JOIN building ON (room.buildID = building.buildID)
    ORDER BY request.create_at DESC
    LIMIT 10`)
    res.send({success:true,data:data})
})
router.get('/getUserRequest/:id',async(req,res)=>{
    var dbConn = await connection()
    const [data] = await dbConn.execute(`SELECT  request.equID,room.roomID,request.reqID,user.fullname,equipment.equName,request.techID,
    request.images,building.name as buildingname , room.roomName ,request.description,request.status,request.create_at FROM request 
    JOIN user ON (request.userID = user.userID)
    JOIN equipment ON (request.equID = equipment.equID)
    JOIN room ON (request.roomID = room.roomID)
    JOIN building ON (room.buildID = building.buildID)
    WHERE user.userID=${req.params.id} AND request.status = 1
    ORDER BY request.create_at DESC`)
    res.send({success:true,data:data})
})
router.get('/getUserRequestProcess/:id',async(req,res)=>{
    var dbConn = await connection()
    const [data] = await dbConn.execute(`SELECT  request.reqID,user.fullname,equipment.equName,request.techID,request.images,building.name as buildingname 
    , room.roomName ,tech.fullname as techname ,tech.email as techemail,tech.tel as techtel,request.description,request.status,request.create_at FROM request 
    JOIN user ON (request.userID = user.userID)
    JOIN equipment ON (request.equID = equipment.equID)
    JOIN room ON (request.roomID = room.roomID)
    JOIN building ON (room.buildID = building.buildID)
    JOIN tech ON (tech.techID = request.techID)
    WHERE user.userID= ${req.params.id} AND request.status = 2
    ORDER BY request.create_at DESC`)
    res.send({success:true,data:data})
 
})
router.get('/getUserRequestSuccess/:id',async(req,res)=>{
    var dbConn = await connection()
    const [data] = await dbConn.execute(`SELECT request.techreport, request.reqID,user.fullname,equipment.equName,request.techID,request.images,building.name as buildingname 
    , room.roomName ,tech.fullname as techname ,tech.email as techemail,tech.tel as techtel,request.description,request.status,request.update_at FROM request 
    JOIN user ON (request.userID = user.userID)
    JOIN equipment ON (request.equID = equipment.equID)
    JOIN room ON (request.roomID = room.roomID)
    JOIN building ON (room.buildID = building.buildID)
    JOIN tech ON (tech.techID = request.techID)
    WHERE user.userID= ${req.params.id} AND request.status = 3
    ORDER BY request.create_at DESC`)
    res.send({success:true,data:data})
})

router.delete('/del/:id',async(req,res)=>{
    var dbConn = await connection()
    const [data] = await dbConn.execute(`
             DELETE FROM request WHERE reqID = ${req.params.id}
    
    `)
    res.send({success:true})
})
module.exports = router;



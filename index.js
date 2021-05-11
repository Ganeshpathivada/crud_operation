const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { throws } = require('assert');
const app = express();
app.use(bodyParser.json());


var mysqlconnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Ganesh@720",
    database:"test",
    multipleStatements: true
});
mysqlconnection.connect((err)=>{
    if(!err){
        console.log("connected");
    }
    else {
        console.log("notconnected",JSON.stringfy(err));
    }
});
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/',(req, res) => {
    
    let sql = "SELECT * FROM employee";
    let query = mysqlconnection.query(sql, (err, rows,fields) => {
        if(!err) 
        res.render('users', {
            title : 'CRUD Operations Using Node Js | Express | My Sql',
            user : rows
        });
    });
});
app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'CRUD Operations Using Node Js | Express | My Sql',
    });
});
app.post('/save',(req, res) => {
    let data = {name: req.body.name, email: req.body.email, phone: req.body.phone};
    let sql = "insert into employee set ? ";
    let query = mysqlconnection.query(sql,data,(err, results) => {
        if(!err) 
          res.redirect('/');
    });
});

app.get('/edit/:userId',(req,res)=>{
    const userId = req.params.userId;
    let sql = `SELECT * from employee where id = ${userId}`;
    let query = mysqlconnection.query(sql,(err, results) => {
        if(!err) 
          res.render('user_edit',{
              title:'CRUD Operations Using Node Js | Express | My Sql',
              user: results[0]
          });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update employee SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone='"+req.body.phone+"' where id ="+userId;
    let query = mysqlconnection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from employee where id = ${userId}`;
    let query = mysqlconnection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(8080);
    

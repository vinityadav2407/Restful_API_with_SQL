const express=require("express");
const app= express();
const path=require("path");
const mysql=require("mysql2");

const { faker } = require('@faker-js/faker');

app.listen(8080,()=>{
    console.log(`you are listing the port : 8080`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname , "views"));

app.use(express.static(path.join(__dirname,"public")));



  // create the connection to database
  const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'express_users',
    password:'Vinityadav@123'
  });

// *****************************************insert the data into the table to the manualy(static)**********************************/
let q='insert into users ( id , username ,email,password) values ?';
// let user2=["1234","deepak_kumar_kushwaha","deepak@gmai.comg","deepak@143g"];
// let user3=["1122","sahu_styam","sahu123@gmai.com","sahu@143"];
// let users=[user2,user3];

//********************************************** insert the data into bulk with the help of faker*************************** */
// let createRandomUser = ()=> {
//   return [
//      faker.string.uuid(),
//      faker.internet.username(), // before version 9.1.0, use userName()
//      faker.internet.email(),
//      faker.internet.password(),
    
//   ];
// }

// let users=[];
// for(let i=1;i<=100;i++){
// users.push(createRandomUser());
// }

// try{
// connection.query(q,[users] ,(err, results)=>{
//     if(err) throw err;
//     console.log(results);

// })}catch(err){
//     console.log(err);
// }
// connection.end();
//**************************************************** Home page rout *********************************************** */
app.get("/",(req,res)=>{
    let q='select count(*) from users';
   
try{
connection.query(q ,(err, results)=>{
    if(err) throw err;
    
    let count= results[0]['count(*)'];
    res.render("home.ejs" ,{count});

})}catch(err){
    console.log(err);
    res.send("some error into the database");
}
});

//*************************************************** Show users routs *************************************************** */
 app.get("/users",(req, res)=>{
  let q='select * from users';
   
try{
connection.query(q ,(err, results)=>{
    if(err) throw err;
    
    let users= results;
    res.render("users.ejs" ,{users});

})}catch(err){
    console.log(err);
    res.send("some error into the database");
}
 })
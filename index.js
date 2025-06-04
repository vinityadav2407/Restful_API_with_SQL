const express=require("express");
const app= express();
const path=require("path");
const mysql=require("mysql2");

let methodOverride = require('method-override');

 
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // For JSON payloads

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

 //******************* edit routs********************************************* */
 app.get("/users/:id/edit",(req ,res)=>{
    let {id}=req.params;
    let q=`select * from users where id='${id}'`;
    try{
        connection.query(q, (err,results)=>{
            if(err) throw err;
            let user=results[0];
            res.render("edit.ejs",{user});
        })
    }catch(err){
        res.send("some error into the db");
    }
 })

 //********************************** update username routs(update rout)********************************** */
 app.patch("/users/:id",(req, res)=>{
 let {id}=req.params;
 let {password:formpass,username:newusername}=req.body;
    let q=`select * from users where id='${id}'`;
    try{
        connection.query(q, (err,results)=>{
            if(err) throw err;
            let user=results[0];
            if(user.password !== formpass){
                // console.log(user.password);
                // console.log(formpass);
                res.send("Worng password ! pls try again");
            }
            else{
                 let q2=`update users set username='${newusername}' where id='${id}'`;
            
                    connection.query(q2,(err,results)=>{
                      if(err) {throw err;}
                    res.redirect("/users");
                    })
            }
            
        })
    }catch(err){
        res.send("some error into the db");
    }
 })
//**************************************get the form for adding the new user into the table */
app.get("/users/new",(req,res)=>{
    res.render("new.ejs");
})

//*********************************************** add the userinformation to database********************* */
app.post("/users/new", (req, res) => {
    let { id: newId, email: newEmail, username: newUsername, password: newPass } = req.body;

    let q = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;

    connection.query(q, [newId, newUsername, newEmail, newPass], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Error inserting new user.");
        }
        res.redirect("/users");
    });
});
//********************************* delet the users from the table******************* */
app.get("/users/:id/delete",(req,res)=>{
    let {id}=req.params;
    let q=`select * from users where id='${id}'`;
     try{
        connection.query(q, (err,results)=>{
            if(err) throw err;
            let user=results[0];
            res.render("delete.ejs",{user});
        })
    }catch(err){
        res.send("some error into the db");
    }
})


//****************** delete the user from the database *****************************/
app.delete("/users/:id", (req, res) => {
    let { id } = req.params;
    let { email, password } = req.body;

    let q = `select * from users WHERE id = ? AND email = ? AND password = ?`;
    try{
        connection.query(q, [id, email, password], (err, results) => {

            if(err) throw err;
           // Step 2: If match found, delete the user
        let deleteQuery = `DELETE FROM users WHERE id = ?`;
        connection.query(deleteQuery, [id], (err, deleteResult) => {
            if (err) {
                console.error("Error deleting user:", err);
                return res.send("Error while deleting user.");
            }

            return res.redirect("/users");
        });
        })
    }catch(err){
        res.send("some error into the db");
    }

})
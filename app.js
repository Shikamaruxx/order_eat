const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { title } = require('process');
const port = 3010;
const db = require('./db/connection');

const bodyParser = require('body-parser');
const session = require('express-session');
const { error } = require('console');
app.use(express.json()); // Parse JSON bodies


app.use(session({
    secret: 'order_eat_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: ({secure:false})
}))


app.use((req, res, next) => {

    res.locals.session = req.session;
    next();
});
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
// app.use((req, res, next)=>{
//     console.log(`Request Method: ${req.method} | Request Url: ${req.url}`)
//     next()
// })
app.get('/', (req,res)=>{
    
    res.render('index', {title: "Home"})
});
app.get('/about', (req,res)=>{
    res.render('about', {title: "About Us"})
});

app.get('/login', (req,res)=>{
    // res.render('index', {title: "Home"})
    console.log(req.session.user)
    if (req.session.user){
       return res.redirect('/')
    }
    res.render('login', {title: "Login"})
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out!' });
        }
        res.redirect('/login');
    });
});
app.get('/register', (req, res) => {
    console.log(req.session.user)
    if (req.session.user){
       return res.redirect('/')
    }
    res.render('register',{title: "Registration",});
});



app.post('/register', (req, res) => {
    const { firstname, lastname, sex, phone, email, password, confirmPassword, birthday, address } = req.body;

    // Validate data
    if (!firstname || !lastname || !sex || !phone || !email || !password || !confirmPassword || !birthday || !address) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match!' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format!' });
    }

    if (!/^\d+$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must contain only digits!' });
    }

    // Check if email or phone already exists
    const sqlCheck = 'SELECT * FROM user WHERE email = ? OR phone = ?';
    db.query(sqlCheck, [email, phone], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error!', error: err });
        }

        if (results.length > 0) {
            if (results.some(row => row.email === email)) {
                return res.status(400).json({ message: `The email ${email} already exists!` });
            }
            if (results.some(row => row.phone === phone)) {
                return res.status(400).json({ message: `The phone number ${phone} already exists!` });
            }
        }

        // If no conflicts, insert the user
        const sqlInsert = "INSERT INTO user (firstname, lastname, sex, phone, email, password, birthdate, address) VALUES (?,?,?,?,?,?,?,?)";
        db.query(sqlInsert, [firstname, lastname, sex, phone, email, password, birthday, address], (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Error inserting data!', error });
            }

            // Set the session and redirect
           console.log( result)
            req.session.user = { email: email, name: firstname };
            return res.redirect('/');
        });
    });
});


// Helper function to validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


app.post('/login', (req, res) => {
   const { email, password } = req.body;

   // Validate input
   if (!email || !password) {
       return res.status(400).json({ message: 'All fields are required!' });
   }

   // Query to get user by email
   const sql = "SELECT * FROM user WHERE email = ?";
   db.query(sql, [email], (error, result) => {
       if (error) {
           return res.status(400).json({ message: error });
       }

       if (result.length === 0) {
           return res.status(400).json({ message: 'Invalid email or password.' });
       }
       if (result[0].password == password){
        
           // Set session user on successful login
           req.session.user = { email: email };
           console.log('Session set:', req.session.user);

           // Redirect or send success message
           res.redirect('/');
       }
   });
});

app.get('/profile', (req,res)=>{
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql,[req.session.user.email],(err,result)=>{
        if (err) {
            return res.status(400).json({ message: err });
        }
        else{
            res.render('profile',{title: 'Profile', user: result})
        }
    })
    
})
app.get('/profile-edit',(req,res)=>{
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql,[req.session.user.email],(err,result)=>{
        if (err) {
            return res.status(400).json({ message: err });
        }
        else{
            res.render('profile_edit',{title: 'Edit Profile', user: result})
        }
    })
})
app.post('/prfile-update',)
app.listen(port,()=>{
    console.log(`Server is running at port: ${port}`)
});
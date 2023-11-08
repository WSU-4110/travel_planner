
const express = require('express');
const router = express.Router();
const {signup} = require('../userdata');
const { login } = require('../api/mongoDB');


router.post('/signup',signup);
//router.post('/login',login);
router.get('/signupdata',(req,res)=>{
    res.send('Hello World');
});
module.exports = router;



























/*const express = require('express');
const router = express.Router();
const User = require('../schemas/signupdata');
const dbOperations = require('../api/mongoDB.js');

require('../api/mongoDB');
router.get('/',(req , res)=>{
    res.send('Hello from server');
});
router.post('/signup', (req, res) => {
   console.log(req.body); //needs for testing
    //res.json({message:req.body})//for checking the json format
    const { firstname,lastname, email, password, cpassword } = req.body;
    if(!firstname || !lastname || !email || !password || !cpassword){
        return res.status(422).json({error: "Please Complete all feilds"});
    }
    User.findOne({email:email})//findone is a mongodb function
    .then((Exist)=>{    //using promise method situation here(promise:does this email match or not if yes then we get response)
        if(Exist) {
            return res.status(422).json({error: "Please Use different email(Exists)"});
        }

        const newuser = new User({firstname,lastname,email,password,cpassword});

        newuser.save().then(()=>{
            res.status(200).json({error: "profile Register success"});
            dbOperations.insert("UserProfiles", newUser )
        }).catch((err)=> res.status(500).json({error: "Registration Failed"}));
    }).catch(err => {console.log(err);})
});
router.post('/signup', async (req, res) => {
    const { firstname,lastname, email, password } = req.body;

    try {
        let user = new User
        ({
            firstname,
            lastname,
            email,
            password
        });

        await user.save();

        res.status(200).json({ message: 'registration successfully Done' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;*/

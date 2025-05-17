var express = require('express');
const userModel = require("../models/userModel")
const todoModel = require("../models/todoModel")
const upload = require("../utils/multer")
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index');
});
// For User Login And Register 
router.get('/Signup', async function(req, res, next) {
  res.render('signup');
});
  router.post('/Signup', upload.single('Profile_Image') ,async function(req, res, next) {  
    const {username,email, mobile,password } = req.body; // Destructure
    // Check User Register Or Not?
     let user = await userModel.findOne({email});
     if(user) return res.status(500).send('user already registered');

     // For Bcrypt  password
     bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, async function(err, hash) {
           const user = await userModel.create({
           username:username,
           email:email,
           mobile:mobile,
           Profile_Image:req.file,
           password:hash
           })
           // check Karne Ke Liye
          //  console.log(password);
          //  console.log(user.password);
          // decode or check our password
          //  bcrypt.compare(password, user.password, function(err, result) {
          //   console.log(result); 
          // });
          var token = jwt.sign({email:email, userid:user._id},'avvvvv')
          res.cookie("token",token)
          res.redirect('/Signin')
          // console.log(token);
      });
  });
  });

router.get('/Signin', async function(req, res, next) {
  res.render('signin');
});
router.post('/Signin', async function(req, res, next) {
  const {email,password } = req.body; // Destructure
  // Check User Register Or Not?
   let user = await userModel.findOne({email});
   if(!user) return res.status(500).send('User Not Found');

    bcrypt.compare(password, user.password, function(err, result) {
           if(result){
            var token = jwt.sign({email:email, userid:user._id},'avvvvv')
          res.cookie("token",token)
          // res.status(200).send("You Can Eligible For Sign in");
          res.redirect('/Todo')
           }
           else res.redirect('/Signin')
          });
});
router.get('/logout', (req, res) => {
  res.cookie("token","");
  res.redirect("/Signin")
});

// Todo work
router.get('/Todo',isloggedIn, async function(req, res, next) {
    const user = await userModel.findOne({email:req.user.email}).populate('works');
    // const todo = await todoModel.find();
  res.render("todo",{user})
  // console.log(user);
  // console.log(todo);
});
router.post('/Todo',isloggedIn, async function(req, res, next) {
  const user = await userModel.findOne({email:req.user.email});
  const {WorkName, Description} = req.body
  const task = await todoModel.create({
    user:user._id,
    WorkName,
    Description,
  })
    user.works.push(task._id);
    await user.save()
  res.redirect("/Todo")
  
});

router.post('/Todo/delete/:id',isloggedIn, async function(req, res, next) {
  const user = await userModel.findOne({email:req.user.email});
  // todo ko delete karo
  await todoModel.findByIdAndDelete(req.params.id);
  // user model se works ko delete Karne ke liye 
  user.works = user.works.filter(taskId =>taskId.toString()  !== req.params.id);
  console.log(user.works);
 await user.save()  
  res.redirect('/Todo')
});

router.get('/Todo/edit/:id', isloggedIn, async function(req, res, next) {
   const task = await todoModel.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.render("edit_todo" ,{task});  // Make sure you have a view named 'edit.ejs' or similar

});

router.post('/Todo/edit/:id', isloggedIn, async function(req, res, next) {
    const { WorkName, Description } = req.body;
    await todoModel.findByIdAndUpdate(req.params.id, {
      WorkName,
      Description
    });
    res.redirect("/Todo");
});



// isloggedin function
function isloggedIn(req, res, next) {
if(req.cookies.token==="") res.send("You must Login ")
  else{
const data = jwt.verify(req.cookies.token , 'avvvvv')
req.user = data;
next();
  }
}
module.exports = router;

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash =  require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//requiring routes
const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plants');
const reviewRoutes = require('./routes/reviews');
//mongoose
const dbURL = process.env.DB_URL ||'mongodb://localhost:27017/nursery'
mongoose.connect(dbURL,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() =>{
  console.log("Database connected");
});
//using static files and ejs  views directory
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//session and flash
const sessionConfig = {
  secret : 'thisshouldbeabettersecret!',
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    expires : Date.now() + 1000*60*60*24*7,
    maxAge  : 1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());

//Passport js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash and global variables usen in templates
app.use((req,res,next) =>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//express routing
app.use('/',userRoutes);
app.use('/plants',plantRoutes);
app.use('/plants/:id/reviews',reviewRoutes);

app.get('/',(req,res) =>{
  res.render('home');
});

//all route page
app.all('*',(req,res,next)=>{
  next(new ExpressError('page not found',404));
});

//midlewares
app.use((err,req,res,next) =>{
  const  {statusCode = 500} = err;
  if(!err.message) err.message ='Something Went Wrong'
  res.status(statusCode).render('error',{err});
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log('listeningg')
});

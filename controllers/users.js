const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=>{
  res.render('users/register');
};

module.exports.register = async(req,res,next)=>{
  try{
    const{email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err =>{
      if(err) return next();
      req.flash('success','Welcome to Buland nursery');
      res.redirect('/plants');
    })
  } catch(e){
    req.flash('error',e.message);
    res.redirect('/register');
  }
};

module.exports.renderLoginForm = (req,res)=>{
  res.render('users/login');
};

module.exports.login = async(req,res)=>{
  req.flash('success','Welcome Back');
  const redirectUrl = req.session.returnTo || '/plants';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
  req.logout();
  req.flash('success',"logged you out!");
  res.redirect('/plants');
};

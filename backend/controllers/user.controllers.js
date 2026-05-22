
const User=require('../models/user.models.js');
const jwt = require('jsonwebtoken');

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_DEV === 'production';
  return {
    httpOnly: true,
    secure: true, // Required for sameSite: 'none' and local development on modern browsers
    sameSite: isProd ? 'none' : 'lax', // Use 'none' in production to allow cross-domain cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
};

module.exports.renderSignupForm=(req,res)=>{
    if (req.accepts('json')) return res.json({ message: "Ready for signup" });
    res.render('../views/users/signup.ejs')
}


module.exports.signup=async(req,res,next)=>{
   try{
        let {username,email,password}=req.body;
   const newUser= new User({email,username})
   const registeredUser=await User.register(newUser,password)
   console.log(registeredUser)
   
   // Generate JWT
   const token = jwt.sign(
     { id: registeredUser._id, username: registeredUser.username },
     process.env.JWT_SECRET || process.env.SECRET || 'secret',
     { expiresIn: '7d' }
   );

   // Set HTTP-only Cookie
   res.cookie('token', token, getCookieOptions());

   req.flash('success','welcome to wanderlust')
   if (req.accepts('json')) return res.json({ success: true, redirectUrl: '/listings', user: registeredUser });
   res.redirect('/listings')
   }
   catch(e){
      req.flash("error",e.message)
      if (req.accepts('json')) return res.status(400).json({ error: e.message });
      res.redirect('/signup')
   }
}


module.exports.login=async(req,res)=>{
   req.flash("success","welcome back to WanderLust !")
   let redirectUrl = res.locals.redirectUrl || "/listings";
   
   // Generate JWT
   const token = jwt.sign(
     { id: req.user._id, username: req.user.username },
     process.env.JWT_SECRET || process.env.SECRET || 'secret',
     { expiresIn: '7d' }
   );

   // Set HTTP-only Cookie
   res.cookie('token', token, getCookieOptions());

   if (req.accepts('json')) {
      return res.json({ success: true, redirectUrl, user: req.user });
   }
   res.redirect(redirectUrl)
}


module.exports.renderLoginForm=(req,res)=>{
   if (req.accepts('json')) return res.json({ message: "Ready for login" });
   res.render('../views/users/login.ejs')

}


module.exports.logout=(req,res,next)=>{
   // Clear HTTP-only Cookie
   const { maxAge, ...clearOptions } = getCookieOptions();
   res.clearCookie('token', clearOptions);

   req.logOut((error)=>{
      if(error){
         return next(error)
      }
      req.flash("success","you are logged out !")
      if (req.accepts('json')) return res.json({ success: true, redirectUrl: "/listings" });
      res.redirect("/listings")
   })
}
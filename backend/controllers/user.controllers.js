
const User=require('../models/user.models.js');



module.exports.renderSignupForm=(req,res)=>{
    if (req.accepts('json')) return res.json({ message: "Ready for signup" });
    res.render('../views/users/signup.ejs')
}


module.exports.signup=async(req,res)=>{
   try{
        let {username,email,password}=req.body;
   const newUser= new User({email,username})
   const registeredUser=await User.register(newUser,password)
   console.log(registeredUser)
   
   // Need to log them in automatically in passport:
   req.login(registeredUser, (err) => {
     if (err) return next(err);
     req.flash('success','welcome to wanderlust')
     if (req.accepts('json')) return res.json({ success: true, redirectUrl: '/listings', user: registeredUser });
     res.redirect('/listings')
   });
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
   req.logOut((error)=>{
      if(error){
         return next(error)
      }
      req.flash("success","you are logged out !")
      if (req.accepts('json')) return res.json({ success: true, redirectUrl: "/listings" });
      res.redirect("/listings")
   })
}
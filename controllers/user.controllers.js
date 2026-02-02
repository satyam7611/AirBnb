
const User=require('../models/user.models.js');



module.exports.renderSignupForm=(req,res)=>{
    res.render('../views/users/signup.ejs')
}


module.exports.signup=async(req,res)=>{
   try{
        let {username,email,password}=req.body;
   const newUser= new User({email,username})
   const registeredUser=await User.register(newUser,password)
   console.log(registeredUser)
   req.flash('success','welcome to wanderlust')
   res.redirect('/listings')
   }
   catch(e){
      req.flash("error",e.message)
      res.redirect('/signup')
   }
}


module.exports.login=async(req,res)=>{
   req.flash("success","welcome back to WanderLust !")
   res.redirect(res.locals.redirectUrl || "/listings")
}


module.exports.renderLoginForm=(req,res)=>{
   res.render('../views/users/login.ejs')

}


module.exports.logout=(req,res,next)=>{
   req.logOut((error)=>{
      if(error){
         return next(error)

      }
      req.flash("success","you are logged out !")
      res.redirect("/listings")
   })
}
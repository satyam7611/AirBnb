const express=require('express')
const router=express.Router({mergeParams:true});

const wrapAsync = require('../utils/wrapAsync.js');
const passport=require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userControllers=require('../controllers/user.controllers.js')


router.route('/signup')
                      .get(userControllers.renderSignupForm)
                      .post(wrapAsync(userControllers.signup))


router.route('/login')
                     .get(userControllers.renderLoginForm)
                     .post(saveRedirectUrl, (req, res, next) => {
                         passport.authenticate("local", (err, user, info) => {
                             if (err) return next(err);
                             if (!user) {
                                 const errorMsg = info ? info.message : "Invalid username or password";
                                 req.flash("error", errorMsg);
                                 if (req.accepts('json') || req.headers['content-type']?.includes('application/json')) {
                                     return res.status(401).json({ success: false, error: errorMsg });
                                 }
                                 return res.redirect('/login');
                             }
                             req.logIn(user, { session: false }, (err) => {
                                 if (err) return next(err);
                                 return userControllers.login(req, res, next);
                             });
                         })(req, res, next);
                     })



router.get("/logout",userControllers.logout)

// Validate and fetch current user session via cookies
router.get("/me", (req, res) => {
  if (req.user) {
    return res.json({ success: true, user: req.user });
  }
  return res.json({ success: false, user: null });
});

module.exports=router
const User = require("../models/userSchema");
module.exports.renderSignup=(req, res) => {
  res.render("users/signup.ejs");
}
module.exports.signup=async (req, res) => {
  try {
    console.log(req.body);
    let { username, email, password } = req.body;
    let newUser = new User({
      username: username,
      email: email,
    });

    let newUserRegister = await User.register(newUser, password);
    req.login(newUserRegister,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Welcome to Wandridge");
        res.redirect("/listings");
    })
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}
module.exports.login=async (req, res) => {
    let { username, password } = req.body;
    req.flash("success","Welcome to Wandridge");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }
  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out from wandridge");
        res.redirect("/listings");
    })
}
module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
      // store the url that searched for..
       console.log(req.url.req.originalUrl);
        req.flash('error','You must Login first')
      return  res.redirect('/login')
    }
    next()
}




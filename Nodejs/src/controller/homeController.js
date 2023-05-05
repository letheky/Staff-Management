
let getHomePage = (req, res)=>{
    return res.render('homepage.ejs')
}

let getAboutPage = (req, res)=>{
    return res.render('aboutpage.ejs')
}

let getCRUD = (req, res)=>{
    return res.render('crud.ejs')
}



module.exports ={
    getHomePage,
    getAboutPage,
    getCRUD
}
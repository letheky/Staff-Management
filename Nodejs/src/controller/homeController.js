
const uploadImage =  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Access the uploaded file details
    const { originalname, size, mimetype } = req.file;
  
    // Process the uploaded file as needed
    // ...
  
    // Send a response with the uploaded file details
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: originalname,
      size,
      mimetype
    });
  };

let getAboutPage = (req, res)=>{
    return res.render('aboutpage.ejs')
}

let getCRUD = (req, res)=>{
    return res.render('crud.ejs')
}



module.exports ={
    uploadImage,
    getAboutPage,
    getCRUD
}
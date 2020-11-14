const multer= require('multer');


const MINE_TYPE_MAP={
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
};
// fileUplpad is a bunch of middlewares!
const fileUpload= multer({

    limits: 500000,
    storage: multer.memoryStorage(),
    fileFilter: (req,file,callback)=>{
        // !!convert null or undefined to false
        const isVaild= !!MINE_TYPE_MAP[file.mimetype];
        let error= isVaild?null : new Error('Invaild mime type');
      
        callback(error,isVaild);
    }

});

module.exports=fileUpload;
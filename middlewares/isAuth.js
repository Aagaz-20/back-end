const jwt = require('jsonwebtoken')

exports.userAuth = (req, res, next) => {
    
    const authHeader =req.get('Authorization')
    if(!authHeader){
        return res.status(401).json({ msg :'Not authenticated'});
    } 
    const token = authHeader.split(' ')[1];
    // console.log(token)
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'supersecretkeyforaagazwebserver');
        
        if(!decodedToken){
            return res.status(401).json({ msg: 'Not Authorized' });
        }
        next();
    }catch(err){
    console.log(err);
    }
}
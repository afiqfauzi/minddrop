const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    //1. get token from request header
    const token = req.header('Authorization');

    //2. check if token exists
    if(!token){
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    try{
        //3. verify the token (removes 'Bearer ' prefix if present)
        const tokenParts = token.split(' ');
        const actualToken = tokenParts.length > 1 ? tokenParts[1] : tokenPArts[0];

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        //4. attach the userId to the request so controllers can use it
        req.user = decoded;
        next(); //move to the next function (the controller)
    } catch (error){
        res.status(401).json({message: 'Token is not valid'});
    }
};

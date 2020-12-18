import jwt from "jsonwebtoken";
import config from "../config/config";

//FORMATE OF TOKEN
//Authorization: Bearer <token>
const isAuthenticated = (req, res, next) => {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Verify token
        jwt.verify(bearerToken, config.SECRET_KEY, (err, decoded) => {
            if (err){
                return res.status(401).json({ msg: 'You have no authorization to access this property.' });
            }
            req.id = decoded.id;
            req.isAdmin = decoded.isAdmin;
            //Next middleware
            next();
        });
    }else{
        //Forbidden
        res.status(403).json({ msg: 'You have no authorization to access this property.' });
    }
}

export default isAuthenticated;
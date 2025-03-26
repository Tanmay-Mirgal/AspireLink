import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';


export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, please login' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
        console.log(error);
        return;
    }
}
export const studentRole = (req,res,next) => {
    if(req.user.role === 'student' || req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message: 'Not authorized as a student'});
    }
}

export const mentorRole = (req,res,next) => {
    if(req.user.role === 'mentor' || req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message: 'Not authorized as a mentor'});
    }
}

export const adminRole = (req,res,next)=>{
    if(req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message: 'Not authorized as an admin'});
    }
}
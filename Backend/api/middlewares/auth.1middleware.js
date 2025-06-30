import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../apihub/src/models/apps/auth/user.models";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async(req,res,next)=> {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
   // Header format is Authorization: Bearer <yourTokenHere>

    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }
    
    try{
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //If valid token return a decoded object
    //{ _id: , iat, exp}

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
    // .select excludes fields mentioned


if(!user) {
    throw new ApiError(401, "Invalid access token");
}

req.user = user;
next();

} catch(error){
    throw new ApiError(401, error?.message || "Invalid access token");
}

});


//Optional Auth
export const getLoggedInUserorIgnore = asyncHandler(async(req,res,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    try{
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
        req.user = user;
        next()
    } catch(error) {
        next();
    }
    
    });
    

    //Verify Permission part (Role Based Access Control)
export const verifyPermission = (roles=[]) => 
  asyncHandler(async( req, res, next)=> {
    if(!req.user?._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    if(roles.includes(req.user?.role)){
        next();
    } else{
        throw new ApiError(403, 'Your are not allowed to perform this action');
    }
    
  });




  //Development phase only

  export const avoidInProduction = asyncHandler(async (req,res,next)=> {
    if(process.env.NODE_ENV == "development") {
        next();
    } else{
        throw new ApiError(403, "This service is only in local environment");
    }
  })

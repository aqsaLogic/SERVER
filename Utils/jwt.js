import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signJWT = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWt_SECRET, {
            expiresIn: "1h",
        });
        return token;
    } catch (error) {
        throw new Error("Error signing JWT");
    }
};

export const verifyJWT = (token) => {
    try{
        const decoded = jwt.verify(token, process.env.JWR_SECRET);
        return decoded;
    } catch (error) {
        throw new Error ("Error verifying JWT");
    }
};
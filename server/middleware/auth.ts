import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "@server/config";

/** 
    req: {
    headers: {
        Authorization: ~token~
    },
}
Verifies the JSON web token passed in request headers
**/
function authorizeToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    if (!token || !token.trim()) {
        return res.status(404).json({ message: "Token required!" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).json({ message: "Unauthorized!" });
    }
}

export default authorizeToken;

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
  citizen?: {
    id: string;
    mobile_number: string;
    role: string;
  };
}

export function authenticateCitizen(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "Authentication required",
        code: "missing_token",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "Invalid authorization format",
        code: "invalid_token_format",
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      decoded.role !== "citizen"
    ) {
      res.status(401).json({
        error: "Invalid citizen token",
        code: "invalid_token",
      });
      return;
    }

    // Store authenticated citizen information
    req.citizen = {
      id: decoded.id as string,
      mobile_number: decoded.mobile_number as string,
      role: decoded.role as string,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: "Token expired",
        code: "token_expired",
      });
      return;
    }

    res.status(401).json({
      error: "Invalid token",
      code: "invalid_token",
    });
  }
}

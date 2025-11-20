import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  next();
}

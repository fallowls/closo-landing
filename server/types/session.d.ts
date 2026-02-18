import 'express-session';

declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
    userId?: string | number;
    userRole?: string;
  }
}

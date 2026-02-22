declare namespace Express {
  export interface Request {
    admin?: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
}

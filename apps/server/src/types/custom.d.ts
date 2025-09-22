declare namespace Express {
  export interface Request {
    user: {
      name: string;
      email: string;
      emailVerified: boolean;
      image: string;
      createdAt: Date;
      updatedAt: Date;
      id: string;
    };
  }
}

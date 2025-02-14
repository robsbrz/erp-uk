import { User } from '../models/auth/User';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                tenantId?: string;
                role?: string;
            } & Partial<User>;
        }
    }
}

export {};  // Isso é necessário para o TypeScript tratar o arquivo como um módulo

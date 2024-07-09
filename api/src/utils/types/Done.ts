import { User } from '../entities/User';

export type Done = (error: Error, user: User) => void;

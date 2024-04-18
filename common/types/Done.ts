import { User } from "../../api/src/utils/entities/User";

export type Done = (error: Error, user: User) => void;

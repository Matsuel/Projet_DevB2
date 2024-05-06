import { loginHandler } from "../Handlers/Login";
import { registerAutoEcoleHandler } from "../Handlers/Register";

export type Route = {
    name: string;
    upload?: any;
    handler: Function;
};
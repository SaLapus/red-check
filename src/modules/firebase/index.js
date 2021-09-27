import App from "./app";

import comments from "./comments";
import users from "./users";
import trace from "./perfomance";

const app = App();

export const Comments = comments(app);
export const Users = users(app);
export const Trace = trace(app);

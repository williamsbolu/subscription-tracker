import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => res.send({ title: "CREATE All Users" }));

userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE All Users" }));

userRouter.delete("/id", (req, res) => res.send({ title: "DELETE All Users" }));

export default userRouter;

import {Router} from "express";

export const userRouter =Router();

userRouter.post("/metadata",(req, res) => {

});

userRouter.get("/metadata/bulk", (req, res) => {
    //GET /api/v1/user/metadata/bulk?ids=[1, 3, 55]

});



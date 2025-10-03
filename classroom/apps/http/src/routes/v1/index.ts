import { Router } from "express";
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import { adminRouter } from "./admin.js";

export const router = Router();

router.post("/signup",(req, res) => {
  res.json({
    message: "Signup"
  })
});


router.post("/signin", (req, res) => {
  res.json({
    message: "Signin"
  });
});

//get all the elements for the arena 
router.get("/elements",(req,res )=>{

})

//get all available avatars in the profile section 
router.get("/avatars",(req,res )=>{

})

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
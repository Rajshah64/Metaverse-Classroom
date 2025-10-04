 import {Router} from "express";
 
 export const adminRouter =Router();
 
//The flollowing APIs are for admin/map creator to create elements to be used in the arena

 //Create an element to be used in the arena
 adminRouter.post("/element",(req, res) => {
    
 });
 
 //Update an element to be used in the arena
 adminRouter.put("/element/:elementId", (req, res) => {
 
 });
 
//Create an avatar to be used in the arena
adminRouter.post("/avatar",(req, res) => {
    
});

//Create a map to be used in the arena
adminRouter.post("/map",(req, res) => {
    
});

 
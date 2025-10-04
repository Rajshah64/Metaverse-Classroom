import {Router} from "express";

export const spaceRouter =Router();

//Below three APIs are for space dashboard 

//create a new space
spaceRouter.post("/",(req, res) => {

});

//get all existing spaces of a user
spaceRouter.get("/all", (req, res) => {

});

//delete a space by id
spaceRouter.delete("/:spaceId", (req, res) => {

});




//Below three API is for arena
//Below three APIs are for after you create a new space or enter an existing space. 

//Get a space by id
spaceRouter.get("/:spaceId", (req, res) => {

});

//Add an element to a space
spaceRouter.post("/element",(req, res) => {

});

//delete an element from a space
spaceRouter.delete("/element",(req, res) => {

});






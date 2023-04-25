import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database3";
 
export const waitlisteeRouter = express.Router();
waitlisteeRouter.use(express.json());
 
waitlisteeRouter.get("/", async (_req, res) => {
    console.log("reached");
   try {
       const waitlistees = await collections.waitlistees.find({}).sort({_id:-1}).toArray();
       res.status(200).send(waitlistees);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

waitlisteeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const waitlistee = await collections.waitlistees.findOne(query);
  
        if (waitlistee) {
            res.status(200).send(waitlistee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
 });


 waitlisteeRouter.post("/", async (req, res) => {
    try {
        const waitlistee = req.body;
        const result = await collections.waitlistees.insertOne(waitlistee);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new waitlistee.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });


 waitlisteeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const waitlistee = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.waitlistees.updateOne(query, { $set: waitlistee });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an waitlistee: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an waitlistee: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an waitlistee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });


 waitlisteeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.waitlistees.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an waitlistee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an waitlistee: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an waitlistee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });
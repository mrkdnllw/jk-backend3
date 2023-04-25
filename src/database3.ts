import * as mongodb from "mongodb";
import { Waitlistee } from "./waitlistee";
 
export const collections: {
    waitlistees?: mongodb.Collection<Waitlistee>;
} = {};
 
//this is a test2

export async function connectToDatabase3(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("Customer");
   await applySchemaValidation(db);
 
   const waitlisteesCollection = db.collection<Waitlistee>("waitlistees2");
   collections.waitlistees = waitlisteesCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["name", "email", "tag"],
           additionalProperties: false,
           properties: {
               _id: {},
               name: {
                   bsonType: "string",
                   description: "'uname' is required and is a string",
               },
               email: {
                   bsonType: "string",
                   description: "'password' is required and is a string",
                  
               },
               tag: {
                   bsonType: "string",
                   description: "'email' is required"
               },
               
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "waitlistees2",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("waitlistees2", {validator: jsonSchema});
       }
   });
}
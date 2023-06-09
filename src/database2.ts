import * as mongodb from "mongodb";
import { User } from "./user";
 
export const collections: {
   users?: mongodb.Collection<User>;
} = {};
 
//this is a test2

export async function connectToDatabase2(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("meanStackExample");
   await applySchemaValidation(db);
 
   const usersCollection = db.collection<User>("users");
   collections.users = usersCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["username", "password", "email"],
           additionalProperties: false,
           properties: {
               _id: {},
               username: {
                   bsonType: "string",
                   description: "'uname' is required and is a string",
               },
               password: {
                   bsonType: "string",
                   description: "'password' is required and is a string",
                   minLength: 5
               },
               email: {
                   bsonType: "string",
                   description: "'email' is required"
               },
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "users",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("users", {validator: jsonSchema});
       }
   });
}
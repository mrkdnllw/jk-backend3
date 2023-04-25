import * as mongodb from "mongodb";
 
export interface Waitlistee {
    name?: string;
    email?: string;
    tag?: string;
    phone?: string;
   _id?: mongodb.ObjectId;
}


import { Router } from "express";
import { createContact, getContacts } from "../controllers/contact.controller";

const contactRouter = Router();

contactRouter.post("/contacts", createContact);
contactRouter.get("/contacts", getContacts);

export default contactRouter;

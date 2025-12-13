import { Request, Response } from "express";
import { createContactSchema } from "../validations/contact.validators";
import { Contact } from "../models/contact.model";

export const createContact = async (req: Request, res: Response) => {
  const { error, value } = createContactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const contact = await Contact.create(value);
    res.status(201).json(contact);
  } catch (error) {
    throw error;
  }
};

export const getContacts = async (_: Request, res: Response) => {
  const contacts = await Contact.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.json(contacts);
};

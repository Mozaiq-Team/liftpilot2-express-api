import { Router } from "express";
import { Contact } from "../models/contact.model.js";
import identify from "../services/identify.js";

const router = Router();

// Create contact
router.post("/", async (req, res) => {
  const {
    accountId,
    emails,
    firstName,
    lastName,
    lastPageVisited,
    actions,
    lastAction,
    fingerprint,
  } = req.body;

  try {
    const newContact = new Contact({
      accountId,
      emails,
      firstName,
      lastName,
      lastPageVisited,
      actions,
      lastAction,
      fingerprint,
    });

    await newContact.save();
    console.log("New contact created:", newContact);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    });
});

router.post("/identify", async (req, res) => {
  const { fingerprint, cid } = req.body;

  const result = await identify({ fingerprint, cid });

  res.json(result);
});

export default router;

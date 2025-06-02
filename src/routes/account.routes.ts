import { Router } from "express";
import { Account } from "../models/account.model.js";

const router = Router();

// Create account
router.post("/", async (req, res) => {
  const {
    accountName,
    industry,
    sizeEE,
    sizeRev,
    rep,
    company_ip,
    dynamic,
    contacts,
  } = req.body;

  try {
    const newAccount = new Account({
      accountName,
      industry,
      sizeEE,
      sizeRev,
      rep,
      company_ip,
      dynamic,
      contacts,
    });
    await newAccount.save();
    console.log("New account created:", newAccount);
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// get by id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Account.findById(id)
    .then((account) => {
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    });
});

export default router;

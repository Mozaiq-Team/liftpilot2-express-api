import { Contact } from "../models/contact.model.js";
import { Account } from "../models/account.model.js";
import { randomUUID } from "crypto";

type Params = {
  fingerprint?: string;
  cid?: string;
  company_ip?: string;
};

const identify = async (params: Params) => {
  const { fingerprint, cid, company_ip } = params;
  let contact;
  let account;
  let result: { cid?: string; aid?: string } = {};

  // If cid is provided, return customer_id and account_id
  if (cid) {
    contact = await Contact.findOne({ cid }).lean();
    if (contact) {
      result.cid = contact._id.toString() ?? undefined;
      result.aid = contact.accountId.toString() ?? undefined;
      return result;
    }
  }

  // If no cid, search for customer based on fingerprint
  if (fingerprint) {
    contact = await Contact.findOne({ fingerprint }).lean();
    if (contact) {
      result.cid = contact._id.toString() ?? undefined;
      result.aid = contact.accountId.toString() ?? undefined;
      return result;
    }
  }

  // If no customer found, create a new one
  const newCid = randomUUID();
  type NewContact = {
    cid: string;
    fingerprint?: string;
    anon: boolean;
    aid?: string;
  };

  const newContact: NewContact = {
    cid: newCid,
    fingerprint,
    anon: true,
  };

  // Search for account based on company_ip
  if (company_ip) {
    account = await Account.findOne({ company_ip }).lean();
    if (account) {
      result.aid = account._id.toString();
    }
  }

  // Save the new contact
  await Contact.create(newContact);
  result.cid = newCid;

  return result;
};
export default identify;

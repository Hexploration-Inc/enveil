import { Account } from "../schemas/account";

// This is a temporary in-memory store for user accounts.
// In a real application, this would be a database.
const accounts: Account[] = [];

export function getAccounts(): Account[] {
  return accounts;
}

export function getAccountById(id: string): Account | undefined {
  return accounts.find((acc) => acc.id === id);
}

export function addAccount(account: Account): void {
  // Poor man's upsert. If account exists, update it. Otherwise, add it.
  const existingAccountIndex = accounts.findIndex(
    (acc) => acc.email === account.email && acc.provider === account.provider
  );

  if (existingAccountIndex !== -1) {
    accounts[existingAccountIndex] = account;
    console.log("Successfully updated account:", account.email);
  } else {
    accounts.push(account);
    console.log("Successfully added account:", account.email);
  }

  console.log("Current Accounts:", accounts);
}

import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = '68ac8114000a5ceafea8';
export const COLLECTIONS = {
  API_REQUESTS: '68ac81860016e6f4b6b8',
  API_COLLECTIONS: '68ac81a2003e79b35a56',
  API_HISTORY: '68ac81ae0012b3ad2b38',
  // These will need to be created in Appwrite - see scripts/setup-sharing.md
  SHARED_COLLECTIONS: '68ac81ae0012b3ad2b39',
  SHARED_REQUESTS: '68ac81ae0012b3ad2b40'
};

export { ID };
export default client;
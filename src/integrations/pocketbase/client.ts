import PocketBase from 'pocketbase';

// PocketBase client configuration
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://pdapp.fppatrading.com/';
const POCKETBASE_ADMIN_EMAIL = import.meta.env.VITE_POCKETBASE_ADMIN_EMAIL || 'dev@mail.com';
const POCKETBASE_ADMIN_PASSWORD = import.meta.env.VITE_POCKETBASE_ADMIN_PASSWORD || '1223334444';

export const pocketbase = new PocketBase(POCKETBASE_URL);

// Configure PocketBase to prevent auto-cancellation
pocketbase.beforeSend = function(url, options) {
  // Add unique request ID to prevent cancellation
  options.signal = undefined; // Remove any existing signal
  return { url, options };
};

// Admin authentication function
export const authenticateAsAdmin = async () => {
  try {
    // Check if already authenticated
    if (pocketbase.authStore.isValid) {
      return pocketbase.authStore.model;
    }

    const authData = await pocketbase.admins.authWithPassword(
      POCKETBASE_ADMIN_EMAIL,
      POCKETBASE_ADMIN_PASSWORD
    );
    return authData;
  } catch (error) {
    console.error('Failed to authenticate as admin:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const records = await pocketbase.collection('users').getList(1, 1, {
      filter: `email = "${email}"`,
      requestKey: `user_${email}_${Date.now()}` // Add unique request key to prevent cancellation
    });
    return records.items[0] || null;
  } catch (error) {
    console.error('Failed to get user by email:', error);
    throw error;
  }
};

// Get accounts by user ID
export const getAccountsByUserId = async (userId: string) => {
  try {
    const records = await pocketbase.collection('accounts').getList(1, 50, {
      filter: `user = "${userId}"`,
      requestKey: `accounts_${userId}_${Date.now()}` // Add unique request key to prevent cancellation
    });
    return records.items;
  } catch (error) {
    console.error('Failed to get accounts by user ID:', error);
    throw error;
  }
};

// Types for PocketBase data
export interface PocketBaseUser {
  id: string;
  email: string;
  name: string;
  active: boolean;
  verified: boolean;
  created: string;
  updated: string;
}

export interface PocketBaseAccount {
  id: string;
  name: string;
  meta_trader_id: string;
  balance: number;
  equity: number;
  margin: number;
  total_pnl: number;
  status: string;
  user: string;
  created: string;
  updated: string;
  expire_date: string;
  symbols?: {
    symbols: string[];
  };
  collaborators: string[];
  config: Record<string, unknown> | null;
}

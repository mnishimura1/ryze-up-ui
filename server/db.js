/**
 * Stub Database for WebAuthn Credentials
 * In production: Replace with MongoDB, PostgreSQL, or similar
 */

let users = {};

const createUser = async (userID, userData) => {
  if (!users[userID]) {
    users[userID] = {
      userID,
      userName: userData.userName || 'user-' + userID,
      credentials: [],
      createdAt: Date.now(),
      lastLogin: null,
    };
  }
  return users[userID];
};

const getUser = async (userID) => {
  if (!users[userID]) {
    return null;
  }
  return users[userID];
};

const addCredential = async (userID, credential) => {
  const user = await getUser(userID);
  if (!user) {
    throw new Error('User not found');
  }

  user.credentials.push({
    id: credential.id,
    publicKey: credential.publicKey,
    counter: credential.counter,
    transports: credential.transports || [],
    credentialDeviceType: credential.credentialDeviceType,
    createdAt: Date.now(),
  });

  return user;
};

const updateCredentialCounter = async (userID, credentialID, newCounter) => {
  const user = await getUser(userID);
  if (!user) {
    throw new Error('User not found');
  }

  const cred = user.credentials.find(c => c.id === credentialID);
  if (!cred) {
    throw new Error('Credential not found');
  }

  cred.counter = newCounter;
  user.lastLogin = Date.now();

  return user;
};

const getAllUsers = async () => {
  return Object.values(users);
};

const deleteUser = async (userID) => {
  delete users[userID];
  return true;
};

const resetDatabase = async () => {
  users = {};
  return true;
};

module.exports = {
  createUser,
  getUser,
  addCredential,
  updateCredentialCounter,
  getAllUsers,
  deleteUser,
  resetDatabase,
};

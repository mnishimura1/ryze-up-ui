/**
 * WebAuthn Server for Biometric Authentication (MFA)
 * Supports FIDO2/WebAuthn registration and authentication
 * In production: Integrate with @simplewebauthn/server package
 */

const express = require('express');
const cors = require('cors');
const { createUser, getUser, addCredential, updateCredentialCounter } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const RP_ID = process.env.RP_ID || 'localhost';
const RP_NAME = 'RYZE-UP';
const EXPECTED_ORIGIN = process.env.EXPECTED_ORIGIN || 'http://localhost:5173';
const SESSION_STORE = {}; // In production: use Redis/session store

// ============================================================================
// Helper Functions
// ============================================================================

const generateChallenge = () => {
  return Buffer.from(Math.random().toString()).toString('base64');
};

const storeSessionData = (sessionID, data) => {
  SESSION_STORE[sessionID] = {
    ...data,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
  return sessionID;
};

const getSessionData = (sessionID) => {
  const session = SESSION_STORE[sessionID];
  if (!session || session.expiresAt < Date.now()) {
    delete SESSION_STORE[sessionID];
    return null;
  }
  return session;
};

const clearSessionData = (sessionID) => {
  delete SESSION_STORE[sessionID];
};

// ============================================================================
// Registration Endpoints
// ============================================================================

/**
 * POST /api/auth/register-options
 * Generate registration options for a new user
 */
app.post('/api/auth/register-options', async (req, res) => {
  try {
    const { userID, userName } = req.body;

    if (!userID || !userName) {
      return res.status(400).json({ error: 'userID and userName required' });
    }

    const sessionID = 'reg-' + Date.now();
    const challenge = generateChallenge();

    const options = {
      challenge,
      rp: {
        name: RP_NAME,
        id: RP_ID,
      },
      user: {
        id: Buffer.from(userID).toString('base64'),
        name: userID,
        displayName: userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      timeout: 60000,
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'preferred',
        userVerification: 'required',
      },
      extensions: {
        credProps: true,
      },
    };

    storeSessionData(sessionID, {
      type: 'registration',
      userID,
      userName,
      challenge,
    });

    res.json({
      sessionID,
      options,
    });
  } catch (error) {
    console.error('Register options error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/register-response
 * Verify registration response from client
 */
app.post('/api/auth/register-response', async (req, res) => {
  try {
    const { sessionID, response } = req.body;

    const session = getSessionData(sessionID);
    if (!session) {
      return res.status(400).json({ error: 'Session expired or invalid' });
    }

    if (session.type !== 'registration') {
      return res.status(400).json({ error: 'Invalid session type' });
    }

    // In production: verify attestation using @simplewebauthn/server
    // For now: basic validation
    if (!response || !response.clientDataJSON || !response.attestationObject) {
      return res.status(400).json({ error: 'Invalid registration response' });
    }

    // Create user and store credential
    const user = await createUser(session.userID, { userName: session.userName });

    const credential = {
      id: response.id,
      publicKey: response.clientDataJSON, // Simplified; in prod: parse and store public key
      counter: 0,
      transports: response.transports || [],
      credentialDeviceType: 'platform',
    };

    await addCredential(user.userID, credential);
    clearSessionData(sessionID);

    res.json({
      success: true,
      message: 'Registration successful',
      userID: user.userID,
    });
  } catch (error) {
    console.error('Register response error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// Authentication Endpoints
// ============================================================================

/**
 * POST /api/auth/authenticate-options
 * Generate authentication options for existing user
 */
app.post('/api/auth/authenticate-options', async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).json({ error: 'userID required' });
    }

    const user = await getUser(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessionID = 'auth-' + Date.now();
    const challenge = generateChallenge();

    const options = {
      challenge,
      timeout: 60000,
      rpId: RP_ID,
      userVerification: 'required',
      allowCredentials: user.credentials.map(cred => ({
        id: cred.id,
        type: 'public-key',
        transports: cred.transports,
      })),
    };

    storeSessionData(sessionID, {
      type: 'authentication',
      userID,
      challenge,
    });

    res.json({
      sessionID,
      options,
    });
  } catch (error) {
    console.error('Authenticate options error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/authenticate-response
 * Verify authentication response from client
 */
app.post('/api/auth/authenticate-response', async (req, res) => {
  try {
    const { sessionID, response } = req.body;

    const session = getSessionData(sessionID);
    if (!session) {
      return res.status(400).json({ error: 'Session expired or invalid' });
    }

    if (session.type !== 'authentication') {
      return res.status(400).json({ error: 'Invalid session type' });
    }

    const user = await getUser(session.userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production: verify assertion using @simplewebauthn/server
    // For now: basic validation
    if (!response || !response.clientDataJSON || !response.authenticatorData) {
      return res.status(400).json({ error: 'Invalid authentication response' });
    }

    // Find matching credential
    const credential = user.credentials.find(c => c.id === response.id);
    if (!credential) {
      return res.status(400).json({ error: 'Credential not found' });
    }

    // Update credential counter
    await updateCredentialCounter(user.userID, credential.id, response.signCount || 0);

    clearSessionData(sessionID);

    // Generate JWT token (simplified; in prod: use proper JWT library)
    const token = Buffer.from(
      JSON.stringify({
        sub: user.userID,
        aud: RP_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        mfa: true,
      })
    ).toString('base64');

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      mfa: true,
      userID: user.userID,
    });
  } catch (error) {
    console.error('Authenticate response error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// Health & Status Endpoints
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'webauth-server',
    rpID: RP_ID,
    rpName: RP_NAME,
  });
});

// ============================================================================
// Error Handling
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============================================================================
// Start Server
// ============================================================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ WebAuthn Server running on http://localhost:${PORT}`);
  console.log(`  RP ID: ${RP_ID}`);
  console.log(`  Origin: ${EXPECTED_ORIGIN}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

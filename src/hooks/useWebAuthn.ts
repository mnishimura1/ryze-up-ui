import { useState, useCallback } from 'react';

interface WebAuthnSession {
  sessionID: string;
  challenge: string;
}

interface WebAuthnResponse {
  id: string;
  clientDataJSON: string;
  attestationObject?: string;
  authenticatorData?: string;
  signature?: string;
  userHandle?: string;
  signCount?: number;
}

interface AuthResult {
  success: boolean;
  token?: string;
  mfa: boolean;
  userID?: string;
  error?: string;
}

export const useWebAuthn = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaVerified, setMfaVerified] = useState(false);

  // Check if WebAuthn is supported
  const isSupported = useCallback(() => {
    return (
      !!navigator.credentials &&
      !!window.PublicKeyCredential &&
      typeof window.PublicKeyCredential === 'function'
    );
  }, []);

  // Register a new WebAuthn credential
  const register = useCallback(
    async (userID: string, userName: string): Promise<boolean> => {
      setRegistering(true);
      setError(null);

      try {
        if (!isSupported()) {
          throw new Error('WebAuthn not supported on this browser');
        }

        // Get registration options from server
        const optionsRes = await fetch('/api/auth/register-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID, userName }),
        });

        if (!optionsRes.ok) {
          throw new Error('Failed to get registration options');
        }

        const { sessionID, options } = await optionsRes.json();

        // Convert challenge from base64 to Uint8Array
        options.challenge = new Uint8Array(
          atob(options.challenge)
            .split('')
            .map(c => c.charCodeAt(0))
        );

        // Convert user ID
        options.user.id = new Uint8Array(
          atob(options.user.id)
            .split('')
            .map(c => c.charCodeAt(0))
        );

        // Create credential
        const credential = await navigator.credentials.create({
          publicKey: options,
        });

        if (!credential) {
          throw new Error('Failed to create credential');
        }

        // Send response to server
        const response = await fetch('/api/auth/register-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionID,
            response: {
              id: (credential as any).id,
              clientDataJSON: (credential as any).response.clientDataJSON,
              attestationObject: (credential as any).response.attestationObject,
              transports: (credential as any).response.getTransports?.() || [],
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Registration verification failed');
        }

        const result = await response.json();
        setMfaVerified(true);
        return result.success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        console.error('WebAuthn registration error:', err);
        return false;
      } finally {
        setRegistering(false);
      }
    },
    [isSupported]
  );

  // Authenticate with WebAuthn credential
  const authenticate = useCallback(
    async (userID: string): Promise<AuthResult> => {
      setAuthenticating(true);
      setError(null);

      try {
        if (!isSupported()) {
          throw new Error('WebAuthn not supported on this browser');
        }

        // Get authentication options from server
        const optionsRes = await fetch('/api/auth/authenticate-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID }),
        });

        if (!optionsRes.ok) {
          throw new Error('Failed to get authentication options');
        }

        const { sessionID, options } = await optionsRes.json();

        // Convert challenge from base64 to Uint8Array
        options.challenge = new Uint8Array(
          atob(options.challenge)
            .split('')
            .map(c => c.charCodeAt(0))
        );

        // Convert allowed credentials
        options.allowCredentials = (options.allowCredentials || []).map((cred: any) => ({
          ...cred,
          id: new Uint8Array(
            atob(cred.id)
              .split('')
              .map(c => c.charCodeAt(0))
          ),
        }));

        // Get assertion
        const assertion = await navigator.credentials.get({
          publicKey: options,
        });

        if (!assertion) {
          throw new Error('Failed to get credential assertion');
        }

        // Send response to server
        const response = await fetch('/api/auth/authenticate-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionID,
            response: {
              id: (assertion as any).id,
              clientDataJSON: (assertion as any).response.clientDataJSON,
              authenticatorData: (assertion as any).response.authenticatorData,
              signature: (assertion as any).response.signature,
              userHandle: (assertion as any).response.userHandle,
              signCount: (assertion as any).response.signCount,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Authentication verification failed');
        }

        const result = await response.json();
        if (result.success) {
          setMfaVerified(true);
          // Store token in localStorage (in production: use secure storage)
          if (result.token) {
            localStorage.setItem('webauthn_token', result.token);
          }
        }
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
        console.error('WebAuthn authentication error:', err);
        return {
          success: false,
          mfa: false,
          error: message,
        };
      } finally {
        setAuthenticating(false);
      }
    },
    [isSupported]
  );

  // Check if MFA is verified
  const isMFAVerified = useCallback(() => {
    return mfaVerified || !!localStorage.getItem('webauthn_token');
  }, [mfaVerified]);

  // Clear MFA verification
  const clearMFA = useCallback(() => {
    setMfaVerified(false);
    localStorage.removeItem('webauthn_token');
  }, []);

  return {
    isSupported,
    register,
    authenticate,
    authenticating,
    registering,
    error,
    mfaVerified: isMFAVerified(),
    clearMFA,
  };
};

export default useWebAuthn;

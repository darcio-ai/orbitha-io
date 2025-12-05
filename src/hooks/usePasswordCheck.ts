import { useState, useCallback } from 'react';

interface PasswordCheckResult {
  isCompromised: boolean | null;
  isChecking: boolean;
  error: string | null;
}

/**
 * Hook para verificar se uma senha foi comprometida usando a API HaveIBeenPwned.
 * Usa k-anonymity: apenas os primeiros 5 caracteres do hash SHA-1 são enviados.
 * A senha nunca sai do dispositivo do usuário.
 */
export function usePasswordCheck() {
  const [result, setResult] = useState<PasswordCheckResult>({
    isCompromised: null,
    isChecking: false,
    error: null,
  });

  const checkPassword = useCallback(async (password: string): Promise<boolean> => {
    if (!password || password.length < 6) {
      setResult({ isCompromised: null, isChecking: false, error: null });
      return false;
    }

    setResult({ isCompromised: null, isChecking: true, error: null });

    try {
      // Generate SHA-1 hash of the password
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // k-anonymity: send only first 5 chars
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);

      // Call HIBP API
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: {
          'Add-Padding': 'true', // Adds padding to prevent response size analysis
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar senha');
      }

      const text = await response.text();
      const lines = text.split('\n');

      // Check if our suffix is in the response
      const isCompromised = lines.some(line => {
        const [hashSuffix] = line.split(':');
        return hashSuffix.trim() === suffix;
      });

      setResult({ isCompromised, isChecking: false, error: null });
      return isCompromised;
    } catch (error) {
      // On error, don't block the user - just log and continue
      console.error('Password check error:', error);
      setResult({ isCompromised: null, isChecking: false, error: null });
      return false;
    }
  }, []);

  const resetCheck = useCallback(() => {
    setResult({ isCompromised: null, isChecking: false, error: null });
  }, []);

  return {
    ...result,
    checkPassword,
    resetCheck,
  };
}

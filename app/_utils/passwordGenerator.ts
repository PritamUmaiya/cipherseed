import { PasswordGeneratorInput, ValidationResult } from '../_types';

/**
 * Character sets for password generation
 */
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Normalizes a single input field (trims spaces)
 */
function normalizeField(value: string): string {
    return value.trim();
}

/**
 * Validates app name field
 * Must contain only alphanumeric characters (no spaces or special characters)
 * Max 50 characters
 */
export function validateAppName(appName: string): ValidationResult {
    const normalized = normalizeField(appName);

    if (!normalized) {
        return { valid: null, message: '' };
    }

    if (normalized.length > 50) {
        return {
            valid: false,
            message: 'App name must be maximum 50 characters',
        };
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(normalized)) {
        return {
            valid: false,
            message: 'App name can only contain letters and numbers (no spaces or special characters)',
        };
    }

    return { valid: true, message: '' };
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates username/email field
 * Can be email (max 254 chars) or username with letters, numbers, dots, dashes, underscores (max 50 chars)
 */
export function validateUsername(username: string): ValidationResult {
    const normalized = normalizeField(username);

    if (!normalized) {
        return { valid: null, message: '' };
    }

    // Check if it looks like an email
    if (normalized.includes('@')) {
        if (!isValidEmail(normalized)) {
            return {
                valid: false,
                message: 'Invalid email format',
            };
        }
        if (normalized.length > 254) {
            return {
                valid: false,
                message: 'Email must be maximum 254 characters',
            };
        }
        return { valid: true, message: '' };
    }

    // Username validation
    if (normalized.length > 50) {
        return {
            valid: false,
            message: 'Username must be maximum 50 characters',
        };
    }

    const regex = /^[a-zA-Z0-9._-]+$/;
    if (!regex.test(normalized)) {
        return {
            valid: false,
            message: 'Username can only contain letters, numbers, dots, dashes and underscores',
        };
    }

    return { valid: true, message: '' };
}

/**
 * Validates master password field
 * Must contain at least one uppercase, lowercase, number and special character
 * Must be at least 15 characters long, max 50
 * Spaces are NOT allowed (even in middle)
 */
export function validateMasterPassword(password: string): ValidationResult {
    if (!password) {
        return { valid: null, message: '' };
    }

    const trimmed = password.trim();

    // Check for spaces anywhere in password (including middle)
    if (password !== trimmed || /\s/.test(password)) {
        return {
            valid: false,
            message: 'Master password cannot contain spaces',
        };
    }

    if (trimmed.length < 15) {
        return {
            valid: false,
            message: 'Master password must be at least 15 characters long',
        };
    }

    if (trimmed.length > 50) {
        return {
            valid: false,
            message: 'Master password must be maximum 50 characters',
        };
    }

    const hasUppercase = /[A-Z]/.test(trimmed);
    const hasLowercase = /[a-z]/.test(trimmed);
    const hasNumber = /[0-9]/.test(trimmed);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(trimmed);

    if (!hasUppercase)
        return { valid: false, message: 'Master password must contain at least one uppercase letter' };
    if (!hasLowercase)
        return { valid: false, message: 'Master password must contain at least one lowercase letter' };
    if (!hasNumber)
        return { valid: false, message: 'Master password must contain at least one number' };
    if (!hasSpecialChar)
        return { valid: false, message: 'Master password must contain at least one symbol' };

    return { valid: true, message: '' };
}

/**
 * Count words in a phrase (separated by spaces)
 */
function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Validates secret phrase field
 * Can only contain alphabets, numbers and spaces
 * Must have at least 3 words
 * Max 50 characters
 */
export function validateSecretPhrase(phrase: string): ValidationResult {
    const normalized = normalizeField(phrase);

    if (!normalized) {
        return { valid: null, message: '' };
    }

    if (normalized.length > 50) {
        return {
            valid: false,
            message: 'Secret phrase must be maximum 50 characters',
        };
    }

    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!regex.test(phrase)) {
        return {
            valid: false,
            message: 'Secret phrase can only contain letters, numbers and spaces',
        };
    }

    const wordCount = countWords(phrase);
    if (wordCount < 3) {
        return {
            valid: false,
            message: `Secret phrase must contain at least 3 words (currently ${wordCount})`,
        };
    }

    return { valid: true, message: '' };
}

/**
 * Normalizes and serializes input fields for deterministic generation
 */
function normalizeInputs(input: PasswordGeneratorInput): string {
    const normalizedSecretPhrase = input.secretPhrase.replace(/\s+/g, '').toLowerCase();
    const normalizedAppName = input.appName.trim().toLowerCase();
    const normalizedUsername = input.username.trim().toLowerCase();
    const normalizedMasterPassword = input.masterPassword.trim();

    return `${normalizedAppName}:${normalizedUsername}:${normalizedMasterPassword}:${normalizedSecretPhrase}`;
}

/**
 * Converts a string to ArrayBuffer for cryptographic operations
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}

/**
 * Generates deterministic password using PBKDF2-SHA256
 */
export async function generatePassword(input: PasswordGeneratorInput): Promise<string> {
    const { options } = input;

    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        throw new Error('At least one character type must be selected');
    }

    // Normalize everything consistently
    const normalizedInput = normalizeInputs(input);

    const password = stringToArrayBuffer(input.masterPassword.trim());
    const salt = stringToArrayBuffer(normalizedInput);

    const keyMaterial = await crypto.subtle.importKey('raw', password, { name: 'PBKDF2' }, false, ['deriveBits']);

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    );

    const hashArray = new Uint8Array(derivedBits);
    let charset = '';
    const requiredChars: string[] = [];

    if (options.uppercase) {
        charset += UPPERCASE;
        requiredChars.push(UPPERCASE);
    }
    if (options.lowercase) {
        charset += LOWERCASE;
        requiredChars.push(LOWERCASE);
    }
    if (options.numbers) {
        charset += NUMBERS;
        requiredChars.push(NUMBERS);
    }
    if (options.symbols) {
        charset += SYMBOLS;
        requiredChars.push(SYMBOLS);
    }

    const passwordChars: string[] = [];
    let hashIndex = 0;

    // Ensure one char per required set
    for (const charSet of requiredChars) {
        const charIndex = hashArray[hashIndex % hashArray.length] % charSet.length;
        passwordChars.push(charSet[charIndex]);
        hashIndex++;
    }

    for (let i = passwordChars.length; i < options.length; i++) {
        const charIndex = hashArray[hashIndex % hashArray.length] % charset.length;
        passwordChars.push(charset[charIndex]);
        hashIndex++;
    }

    // Deterministic shuffle
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = hashArray[(hashIndex + i) % hashArray.length] % (i + 1);
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');
}
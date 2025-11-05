/**
 * Password generation options
 */
export interface PasswordOptions {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    length: number;
}

/**
 * Default password options
 */
export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    length: 15
};

/**
 * Validation result for a single field
 */
export interface ValidationResult {
    valid: boolean | null;
    message: string;
}

/**
 * Form validation state
 */
export interface FormValidation {
    appName: ValidationResult;
    username: ValidationResult;
    masterPassword: ValidationResult;
    secretPhrase: ValidationResult;
}

/**
 * Input parameters for password generation
 */
export interface PasswordGeneratorInput {
    appName: string;
    username: string;
    masterPassword: string;
    secretPhrase: string;
    options: PasswordOptions;
}
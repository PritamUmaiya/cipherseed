'use client';

import { useState, useEffect } from "react";
import {
    AppIcon, SettingsIcon, MinusIcon, PlusIcon, EyeIcon, EyeOffIcon, 
    ClipboardIcon, ClipboardCheckIcon, GithubIcon, RotateCcwIcon
} from "./_components/Icons";
import { 
    generatePassword, validateAppName, validateUsername, 
    validateMasterPassword, validateSecretPhrase 
} from "./_utils/passwordGenerator";
import { 
    PasswordOptions, FormValidation, DEFAULT_PASSWORD_OPTIONS 
} from "./_types";

export default function Home() {
    // UI State
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    // Password Options
    const [options, setOptions] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS);

    // Form Inputs
    const [appName, setAppName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [masterPassword, setMasterPassword] = useState<string>("");
    const [secretPhrase, setSecretPhrase] = useState<string>("");

    // Generated Password
    const [generatedPassword, setGeneratedPassword] = useState<string>("");

    // Validation State
    const [validation, setValidation] = useState<FormValidation>({
        appName: { valid: null, message: "" },
        username: { valid: null, message: "" },
        masterPassword: { valid: null, message: "" },
        secretPhrase: { valid: null, message: "" }
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const savedOptions = localStorage.getItem('cipherseed_options');
            if (savedOptions) {
                setOptions(JSON.parse(savedOptions));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('cipherseed_options', JSON.stringify(options));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }, [options]);

    // Validate and generate password whenever inputs or options change
    useEffect(() => {
        const validateAndGenerate = async () => {
            const newValidation: FormValidation = {
                appName: validateAppName(appName),
                username: validateUsername(username),
                masterPassword: validateMasterPassword(masterPassword),
                secretPhrase: validateSecretPhrase(secretPhrase)
            };

            setValidation(newValidation);

            const isAppNameValid = newValidation.appName.valid === true;
            const isMasterPasswordValid = newValidation.masterPassword.valid === true;
            const isUsernameValid = username === "" || newValidation.username.valid === true;
            const isSecretPhraseValid = newValidation.secretPhrase.valid === true;

            if (isAppNameValid && isMasterPasswordValid && isUsernameValid && isSecretPhraseValid) {
                try {
                    const password = await generatePassword({
                        appName,
                        username,
                        masterPassword,
                        secretPhrase,
                        options
                    });
                    setGeneratedPassword(password);
                } catch (error) {
                    console.error('Password generation failed:', error);
                    setGeneratedPassword("");
                }
            } else {
                setGeneratedPassword("");
            }
        };

        validateAndGenerate();
    }, [appName, username, masterPassword, secretPhrase, options]);

    /**
     * Handles password option changes (checkboxes)
     */
    const handleOptionChange = (option: keyof Omit<PasswordOptions, 'length'>) => {
        setOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    /**
     * Handles password length change
     */
    const handleLengthChange = (length: number) => {
        const clampedLength = Math.min(Math.max(length, 4), 50);
        setOptions(prev => ({
            ...prev,
            length: clampedLength
        }));
    };

    /**
     * Resets password options to defaults
     */
    const handleResetOptions = () => {
        setOptions(DEFAULT_PASSWORD_OPTIONS);
    };

    /**
     * Copies generated password to clipboard
     */
    const handleCopyToClipboard = async () => {
        if (!generatedPassword) return;

        try {
            await navigator.clipboard.writeText(generatedPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    /**
     * Gets border color class based on validation state
     */
    const getBorderClass = (field: keyof FormValidation): string => {
        const fieldValidation = validation[field];
        if (fieldValidation.valid === true) return 'border-green-500 focus:ring-green-500';
        if (fieldValidation.valid === false) return 'border-red-500 focus:ring-red-500';
        return 'border-gray-300 dark:border-gray-600 focus:ring-blue-500';
    };

    return (
        <main className="w-full max-w-3xl bg-white dark:bg-gray-900 md:rounded-lg md:border md:border-gray-200 dark:md:border-gray-800 md:shadow-sm overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between gap-2 p-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300">
                        <AppIcon width={35} height={35} />
                    </span>
                    <span className="text-2xl text-gray-600 dark:text-gray-400">CipherSeed</span>
                </div>
                <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                    title="Settings"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <SettingsIcon width={25} height={25} />
                </button>
            </header>

            {/* Description */}
            <div className="p-3 text-sm text-gray-600 dark:text-gray-400">
                Stop remembering hundreds of passwords. Let CipherSeed generate strong, unique passwords for you—instantly and securely.
            </div>

            {/* Main Content */}
            <section className="flex flex-col-reverse md:flex-row gap-3 p-3 border-b border-gray-200 dark:border-gray-800">
                {/* Input Fields */}
                <div className="flex-1 space-y-3">
                    {/* App Name */}
                    <div>
                        <label htmlFor="appname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            App name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="appname"
                            name="appname"
                            placeholder="e.g., Google, Facebook"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            maxLength={50}
                            className={`w-full px-3 py-2 rounded-lg border ${getBorderClass('appName')} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
                        />
                        {validation.appName.valid === false && (
                            <p className="mt-1 text-sm text-red-500">{validation.appName.message}</p>
                        )}
                    </div>

                    {/* Username / Email */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username / Email <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="e.g., john.doe@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border ${getBorderClass('username')} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
                        />
                        {validation.username.valid === false && (
                            <p className="mt-1 text-sm text-red-500">{validation.username.message}</p>
                        )}
                    </div>

                    {/* Master Password */}
                    <div>
                        <label htmlFor="masterpassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Master password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="masterpassword"
                                name="masterpassword"
                                placeholder="Strong master password"
                                value={masterPassword}
                                onChange={(e) => setMasterPassword(e.target.value)}
                                maxLength={50}
                                className={`w-full px-3 py-2 pr-10 rounded-lg border ${getBorderClass('masterPassword')} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                title={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeIcon width={20} height={20} /> : <EyeOffIcon width={20} height={20} />}
                            </button>
                        </div>
                        {validation.masterPassword.valid === false && (
                            <p className="mt-1 text-sm text-red-500">{validation.masterPassword.message}</p>
                        )}
                    </div>

                    {/* Secret Phrase */}
                    <div>
                        <label htmlFor="secretphrase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Secret phrase <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="secretphrase"
                            name="secretphrase"
                            placeholder="e.g., blue sky ocean wave"
                            value={secretPhrase}
                            onChange={(e) => setSecretPhrase(e.target.value)}
                            maxLength={50}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-lg border ${getBorderClass('secretPhrase')} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors resize-none`}
                        />
                        {validation.secretPhrase.valid === false && (
                            <p className="mt-1 text-sm text-red-500">{validation.secretPhrase.message}</p>
                        )}
                    </div>

                    {/* Generated Password */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Generated password"
                            value={generatedPassword}
                            disabled
                            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 cursor-not-allowed"
                        />
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-full transition-colors ${
                                copied 
                                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed'
                            }`}
                            title="Copy to clipboard"
                            onClick={handleCopyToClipboard}
                            disabled={!generatedPassword}
                        >
                            {copied ? <ClipboardCheckIcon width={20} height={20} /> : <ClipboardIcon width={20} height={20} />}
                        </button>
                    </div>
                </div>

                {/* Settings Panel */}
                <div className={`w-full md:w-80 ${showSettings ? '' : 'hidden md:block'}`}>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Password Options</span>
                            <button
                                type="button"
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                                title="Reset to defaults"
                                onClick={handleResetOptions}
                            >
                                <RotateCcwIcon width={18} height={18} />
                            </button>
                        </div>
                        
                        <div className="p-2 space-y-2">
                            {/* Uppercase */}
                            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Uppercase</span>
                                <input
                                    type="checkbox"
                                    id="uppercase"
                                    name="uppercase"
                                    checked={options.uppercase}
                                    onChange={() => handleOptionChange('uppercase')}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </label>

                            {/* Lowercase */}
                            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Lowercase</span>
                                <input
                                    type="checkbox"
                                    id="lowercase"
                                    name="lowercase"
                                    checked={options.lowercase}
                                    onChange={() => handleOptionChange('lowercase')}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </label>

                            {/* Numbers */}
                            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Numbers</span>
                                <input
                                    type="checkbox"
                                    id="numbers"
                                    name="numbers"
                                    checked={options.numbers}
                                    onChange={() => handleOptionChange('numbers')}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </label>

                            {/* Symbols */}
                            <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Symbols</span>
                                <input
                                    type="checkbox"
                                    id="symbols"
                                    name="symbols"
                                    checked={options.symbols}
                                    onChange={() => handleOptionChange('symbols')}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </label>

                            {/* Length */}
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Length <span className="text-xs text-gray-500">(4-50)</span>
                                </label>
                                <div className="flex gap-2">
                                    <button 
                                        type="button" 
                                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
                                        title="Decrease"
                                        onClick={() => handleLengthChange(options.length - 1)}
                                        disabled={options.length <= 4}
                                    >
                                        <MinusIcon width={16} height={16} />
                                    </button>
                                    <input
                                        type="number"
                                        id="length"
                                        name="length"
                                        value={options.length}
                                        min="4"
                                        max="50"
                                        onChange={(e) => handleLengthChange(parseInt(e.target.value) || 4)}
                                        className="flex-1 px-3 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button 
                                        type="button" 
                                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
                                        title="Increase"
                                        onClick={() => handleLengthChange(options.length + 1)}
                                        disabled={options.length >= 50}
                                    >
                                        <PlusIcon width={16} height={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="p-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                <p className="mb-2">
                    It uses the strongest algorithm (PBKDF2-SHA256) to generate your consistent password based on the inputs provided. Everything is done in your browser and no password is stored anywhere.
                </p>
                <p>
                    <a 
                        href="https://github.com/PritamUmaiya" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Pritam Umaiya"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors w-fit"
                    >
                        <GithubIcon width={20} height={20} />
                        <span>Pritam Umaiya</span>
                    </a>
                </p>
            </div>
        </main>
    );
}
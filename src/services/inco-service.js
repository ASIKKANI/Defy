import { Lightning } from '@inco/js/lite';
import { supportedChains, handleTypes } from '@inco/js';

let incoInstance = null;

/**
 * Initialize Inco Lightning instance
 * Connects to Inco network for confidential computing
 */
export const initInco = async () => {
    if (incoInstance) return incoInstance;

    try {
        // Use plasmaTestnet (9746) which is the common chainId for Inco Lightning
        const chainId = supportedChains.plasmaTestnet;

        // Determine network based on environment
        // If on localhost, attempt to connect to the local Inco node (from Docker)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            try {
                // Try localNode first as per lightning-rod README
                incoInstance = await Lightning.localNode('testnet');
                console.log("✅ Inco Lightning initialized (Local Node)");
            } catch (localError) {
                console.warn("⚠️ Local Inco node not detected, falling back to public devnet:", localError.message);
                // Reverting to 'devnet' as seen in user's original code/screenshots
                incoInstance = await Lightning.latest('devnet', chainId);
                console.log("✅ Inco Lightning initialized (Public Devnet)");
            }
        } else {
            incoInstance = await Lightning.latest('devnet', chainId);
            console.log("✅ Inco Lightning initialized (Public Devnet)");
        }

        return incoInstance;
    } catch (error) {
        console.error("❌ Inco Lightning initialization failed:", error);
        throw error;
    }
};

/**
 * Encrypt a value using Inco Lightning FHE
 * @param {number|boolean|string} value - Value to encrypt
 * @param {string} type - Type: 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256', 'bool', 'address'
 * @param {string} userAddress - The user's wallet address
 * @param {string} dappAddress - The target dapp contract address
 * @returns {Promise<{success: boolean, ciphertext: string, display: string}>}
 */
export const encryptParameter = async (value, type = 'uint32', userAddress = null, dappAddress = null) => {
    try {
        const inco = await initInco();

        // Map simplified type to Inco handle type constant
        let handleType;
        switch (type.toLowerCase()) {
            case 'bool': handleType = handleTypes.ebool; break;
            case 'uint8': handleType = handleTypes.euint8; break;
            case 'uint16': handleType = handleTypes.euint16; break;
            case 'uint32': handleType = handleTypes.euint32; break;
            case 'uint64': handleType = handleTypes.euint64; break;
            case 'uint128': handleType = handleTypes.euint128; break;
            case 'uint256': handleType = handleTypes.euint256; break;
            case 'address': handleType = handleTypes.euint160; break; // Address is uint160 in FHEVM
            default: handleType = handleTypes.euint32;
        }

        // Use placeholders if addresses not provided
        const account = userAddress || "0x0000000000000000000000000000000000000000";
        const dapp = dappAddress || "0x0000000000000000000000000000000000000000";

        // Handle value conversion safely
        let processedValue = value;
        if (type.startsWith('uint') && typeof value === 'string') {
            // 1. Try to extract a simple number (handles "5000 units" or "50 SHM")
            const numericMatch = value.match(/(\d+)/);
            if (numericMatch) {
                processedValue = BigInt(numericMatch[1]);
            } else {
                // 2. If it's a pure string (like a thought), convert it to a 256-bit numeric sum or hash
                // This allows us to "encrypt" the strategy as a unique numeric signature
                let hash = 0n;
                for (let i = 0; i < value.length; i++) {
                    hash = (hash << 5n) - hash + BigInt(value.charCodeAt(i));
                }
                processedValue = hash;
            }
        } else if (type === 'bool' && typeof value === 'string') {
            processedValue = value.toLowerCase() === 'true';
        }

        console.log(`Inco: Encrypting ${value} as ${type} (HandleType: ${handleType})`);

        const ciphertext = await inco.encrypt(processedValue, {
            accountAddress: account,
            dappAddress: dapp,
            handleType: handleType
        });

        if (!ciphertext) {
            throw new Error("Encryption failed: Received empty ciphertext from Inco Lightning");
        }

        console.log("✅ Inco: Encryption successful");

        return {
            success: true,
            ciphertext: ciphertext,
            display: `INCO_ENCRYPTED_${type.toUpperCase()}`
        };
    } catch (error) {
        console.error("❌ Inco Encryption failed:", error);
        return {
            success: false,
            error: error.message,
            display: "ENCRYPTION_FAILED"
        };
    }
};

/**
 * Decrypt a value using Inco Lightning
 * @param {string} handle - Encrypted handle to decrypt
 * @param {object} walletClient - Viem wallet client for signing re-encryption
 * @returns {Promise<any>} Decrypted value
 */
export const decryptParameter = async (handle, walletClient) => {
    try {
        const inco = await initInco();

        // Inco Lightning uses attestedDecrypt which requires a wallet client (Viem)
        const results = await inco.attestedDecrypt(walletClient, [handle]);
        const decrypted = results[0]?.plaintext?.value;

        return decrypted;
    } catch (error) {
        console.error("❌ Inco Decryption failed:", error);
        throw error;
    }
};


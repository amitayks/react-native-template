import { MMKV } from 'react-native-mmkv';

/* AI-INSTRUCTION-START:mmkv-storage-id
 * MMKV Storage Configuration
 *
 * CUSTOMIZATION REQUIRED:
 * Replace {{PACKAGE_NAME}} with your app's package name (e.g., 'com.mycompany.myapp')
 *
 * The `id` property creates a unique storage instance for your app.
 * The `encryptionKey` should be a unique identifier for your app's encryption.
 *
 * Example:
 *   id: 'com.myapp.storage'
 *   encryptionKey: 'com.myapp.encryption-key'
 *
 * Note: Changing these values after app release will make existing data inaccessible.
 * AI-INSTRUCTION-END */

export const storage = new MMKV({
	id: '{{PACKAGE_NAME}}-storage',
	encryptionKey: '{{PACKAGE_NAME}}-encryption-key',
});

export const getItem = (key: string): string | undefined => {
	return storage.getString(key);
};

export const setItem = (key: string, value: string): void => {
	storage.set(key, value);
};

export const removeItem = (key: string): void => {
	storage.delete(key);
};

export const clearAll = (): void => {
	storage.clearAll();
};

export const getAllKeys = (): string[] => {
	return storage.getAllKeys();
};

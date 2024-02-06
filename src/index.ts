// Import the native module. On web, it will be resolved to ExpoEncryptedStorage.web.ts
// and on native platforms to ExpoEncryptedStorage.ts
import ExpoEncryptedStorageModule from "./ExpoEncryptedStorageModule";

export default class ExpoEncryptedStorage {
  /**
   * Writes data to the disk, using SharedPreferences or KeyChain, depending on the platform.
   * @param {string} key - A string that will be associated to the value for later retrieval.
   * @param {string} value - The data to store.
   */
  static setItemAsync(key: string, value: string): Promise<void>;

  static setItemAsync(key: string, value: string): Promise<void> {
    return ExpoEncryptedStorageModule.setItemAsync(key, value);
  }

  /**
   * Retrieves data from the disk, using SharedPreferences or KeyChain, depending on the platform and returns it as the specified type.
   * @param {string} key - A string that is associated to a value.
   */
  static getItemAsync(key: string): Promise<string | null>;

  static getItemAsync(key: string): Promise<string | null> {
    return ExpoEncryptedStorageModule.getItemAsync(key);
  }

  /**
   * Deletes data from the disk, using SharedPreferences or KeyChain, depending on the platform.
   * @param {string} key - A string that is associated to a value.
   */
  static removeItemAsync(key: string): Promise<void>;

  static removeItemAsync(key: string): Promise<void> {
    return ExpoEncryptedStorageModule.removeItemAsync(key);
  }

  /**
   * Clears all data from disk, using SharedPreferences or KeyChain, depending on the platform.
   */
  static clearAsync(): Promise<void>;

  static clearAsync(): Promise<void> {
    return ExpoEncryptedStorageModule.clearAsync();
  }
}

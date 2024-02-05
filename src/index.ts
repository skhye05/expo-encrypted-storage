import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoEncryptedStorage.web.ts
// and on native platforms to ExpoEncryptedStorage.ts
import ExpoEncryptedStorageModule from './ExpoEncryptedStorageModule';
import ExpoEncryptedStorageView from './ExpoEncryptedStorageView';
import { ChangeEventPayload, ExpoEncryptedStorageViewProps } from './ExpoEncryptedStorage.types';

// Get the native constant value.
export const PI = ExpoEncryptedStorageModule.PI;

export function hello(): string {
  return ExpoEncryptedStorageModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoEncryptedStorageModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoEncryptedStorageModule ?? NativeModulesProxy.ExpoEncryptedStorage);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoEncryptedStorageView, ExpoEncryptedStorageViewProps, ChangeEventPayload };

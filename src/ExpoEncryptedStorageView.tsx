import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoEncryptedStorageViewProps } from './ExpoEncryptedStorage.types';

const NativeView: React.ComponentType<ExpoEncryptedStorageViewProps> =
  requireNativeViewManager('ExpoEncryptedStorage');

export default function ExpoEncryptedStorageView(props: ExpoEncryptedStorageViewProps) {
  return <NativeView {...props} />;
}

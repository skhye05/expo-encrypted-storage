import * as React from 'react';

import { ExpoEncryptedStorageViewProps } from './ExpoEncryptedStorage.types';

export default function ExpoEncryptedStorageView(props: ExpoEncryptedStorageViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}

import React from 'react';
import { legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';

if (typeof window !== 'undefined') {
  window.__CSSINJS_TRANSFORMERS__ = [
    legacyLogicalPropertiesTransformer
  ];
}

// Komponentning qolgan qismi... 
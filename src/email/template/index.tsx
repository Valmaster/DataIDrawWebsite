import { Button, Html } from '@react-email/components';
import * as React from 'react';

export default function Email({ url }) {
  return (
    <Html>
      <Button
        href={url}
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
      >
        <div
          className={'container'}
          style={{ background: 'red', width: '500px', height: '500px' }}
        >
          <h1 style={{ fontSize: '48px' }}>Test</h1>
        </div>
        Click me
      </Button>
    </Html>
  );
}

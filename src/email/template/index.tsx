import { Button, Html } from '@react-email/components';
import * as React from 'react';
import 'index.css';

export default function Email({ url }) {
  return (
    <Html>
      <Button
        href={url}
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
      >
        <div className={'container'}>
          <h1>Test</h1>
        </div>
        Click me
      </Button>
    </Html>
  );
}

import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  apiPackageSubsites,
  findSubsiteValue,
} from './shared-subsite-routes.ts';

const meta = [
  { type: 'section-header', label: 'Build tools' },
  { type: 'file', name: 'rspeedy', label: 'rspeedy' },
  { type: 'section-header', label: 'ReactLynx' },
  { type: 'file', name: 'react-signals', label: 'react-signals' },
  { type: 'file', name: 'react-umd', label: 'react-umd' },
  { type: 'section-header', label: 'Web platform' },
  { type: 'file', name: 'web-core', label: 'web-core' },
];

const subsiteOf = (pathname: string) =>
  findSubsiteValue(pathname, {
    subsites: ['guide', 'rspeedy', 'react', 'ui', 'lynxtron'],
    packageSubsites: apiPackageSubsites(meta),
    versionPrefixes: ['/next'],
  });

test('package pages keep the subsite of their section', () => {
  assert.equal(subsiteOf('/api/packages/react-signals'), 'react');
  assert.equal(subsiteOf('/api/packages/react-umd'), 'react');
  assert.equal(subsiteOf('/api/packages/rspeedy'), 'rspeedy');
  assert.equal(subsiteOf('/api/packages/web-core'), undefined);
  assert.equal(subsiteOf('/api/packages/'), undefined);
});

test('config and ReactLynx routes keep their subsite', () => {
  assert.equal(subsiteOf('/api/config/mode'), 'rspeedy');
  assert.equal(subsiteOf('/api/config/'), 'rspeedy');
  assert.equal(subsiteOf('/api/react/hooks'), 'react');
});

test('version and language prefixes and .html suffixes', () => {
  assert.equal(subsiteOf('/next/api/packages/react-umd.html'), 'react');
  assert.equal(subsiteOf('/zh/api/packages/react-signals'), 'react');
  assert.equal(subsiteOf('/next/zh/api/config/mode.html'), 'rspeedy');
  assert.equal(subsiteOf('/next/zh/api/react/hooks'), 'react');
});

test('other routes still match a path segment', () => {
  assert.equal(subsiteOf('/guide/start/quick-start'), 'guide');
  assert.equal(subsiteOf('/zh/rspeedy/cli.html'), 'rspeedy');
  assert.equal(subsiteOf('/ui/introduction'), 'ui');
  assert.equal(subsiteOf('/lynx-ui/introduction'), 'ui');
  assert.equal(subsiteOf('/api/genui/openui'), undefined);
});

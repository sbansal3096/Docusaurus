import path from 'path';
import load from '@lib/load';

// Helper methods to setup dummy/ fake projects
const loadSetup = async name => {
  const fixtures = path.join(__dirname, '__fixtures__');
  const simpleSite = path.join(fixtures, 'simple-site');
  const customSite = path.join(fixtures, 'custom-site');
  const versionedSite = path.join(fixtures, 'versioned-site');
  const translatedSite = path.join(fixtures, 'translated-site');
  const transversionedSite = path.join(fixtures, 'transversioned-site');

  switch (name) {
    case 'simple':
      return load(simpleSite);
    case 'custom':
      return load(customSite);
    case 'versioned':
      return load(versionedSite);
    case 'transversioned':
      return load(transversionedSite);
    case 'translated':
      return load(translatedSite);
    default:
      return {};
  }
};

export default loadSetup;

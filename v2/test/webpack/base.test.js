import createBaseConfig from '@lib/webpack/base';
import {validate} from 'webpack';
import loadSetup from '../loadSetup';

describe('webpack base config', () => {
  test('simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createBaseConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createBaseConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });
});

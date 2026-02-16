import * as utilsModule from './index';
import { unique, flatten, chunk } from './array-utils';

describe('utils/index', () => {
  it('should export unique function', () => {
    expect(utilsModule.unique).toBe(unique);
  });

  it('should export flatten function', () => {
    expect(utilsModule.flatten).toBe(flatten);
  });

  it('should export chunk function', () => {
    expect(utilsModule.chunk).toBe(chunk);
  });
});

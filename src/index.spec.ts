import * as mainModule from './index';
import { unique, flatten, chunk } from './utils/array-utils';

describe('main index', () => {
  it('should export unique function', () => {
    expect(mainModule.unique).toBe(unique);
  });

  it('should export flatten function', () => {
    expect(mainModule.flatten).toBe(flatten);
  });

  it('should export chunk function', () => {
    expect(mainModule.chunk).toBe(chunk);
  });
});

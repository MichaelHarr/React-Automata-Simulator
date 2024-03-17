// Import ResizeObserver from a module that exports a mock implementation
import { ResizeObserver } from '@juggle/resize-observer';

// Assign the mock implementation to the global scope
global.ResizeObserver = ResizeObserver;

// Import render from '@testing-library/react' after setting up the mock
import { render } from '@testing-library/react';
import App from './App';

describe('App component', () => {
 test('it renders', () => {
   render(<App />);
 });
})
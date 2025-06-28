import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weight tracker heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Registro de Peso/i);
  expect(headingElement).toBeInTheDocument();
});

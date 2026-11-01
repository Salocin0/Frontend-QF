import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import FormDinamicoRestricciones from '../components/ComponenteRepartidor/FormDinamicoRestricciones';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
let mockId = 'ejemplo';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useParams: () => ({ id: mockId }), useNavigate: () => mockNavigate, Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 3, tipoUsuario: 'repartidor' } }}><FormDinamicoRestricciones /></UserContext.Provider>);
afterEach(() => { global.fetch.mockRestore?.(); jest.clearAllMocks(); });
test('example renders the current requirements with no network requests or enabled submit', () => {
  mockId = 'ejemplo'; const fetchMock = jest.spyOn(global, 'fetch'); renderPage();
  expect(screen.getByRole('note')).toHaveTextContent('Vista de ejemplo');
  expect(screen.getByLabelText('Experiencia como repartidor')).toBeInTheDocument();
  expect(screen.queryByLabelText('Medio de movilidad')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Documentación requerida')).toHaveAttribute('accept', '.pdf,application/pdf');
  expect(screen.getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled();
  expect(fetchMock).not.toHaveBeenCalled();
});
test('answers stay mapped to their original ids even when completed in a different order and failure retains values', async () => {
  mockId = '9';
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 4, titulo: 'Movilidad', tipo: 'Opciones', opciones: 'Moto,Bici' }, { id: 8, titulo: 'Experiencia', tipo: 'Cadena de texto' }] }) }).mockResolvedValueOnce({ ok: false, json: async () => ({ msg: 'Solicitud rechazada' }) });
  renderPage(); await screen.findByLabelText('Experiencia');
  fireEvent.change(screen.getByLabelText('Experiencia'), { target: { value: 'Dos años' } });
  fireEvent.change(screen.getByLabelText('Movilidad'), { target: { value: 'Moto' } });
  fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Solicitud rechazada'));
  expect(screen.getByLabelText('Experiencia')).toHaveValue('Dos años');
  expect(mockNavigate).not.toHaveBeenCalled();
  expect(JSON.parse(fetchMock.mock.calls[1][1].body).restricciones).toEqual({ restriccion1: { respuesta: 'Moto', RestriccionId: 4 }, restriccion2: { respuesta: 'Dos años', RestriccionId: 8 } });
});
test('missing requirements provide a link back to courier events', async () => {
  mockId = '9'; jest.spyOn(global, 'fetch').mockResolvedValue({ status: 404 }); renderPage();
  expect(await screen.findByRole('link', { name: 'Ver eventos' })).toHaveAttribute('href', '/asociarRepartidorAEvento');
  expect(screen.queryByRole('button', { name: 'Enviar solicitud' })).not.toBeInTheDocument();
});

test('uploads actual PDF content and filename instead of a local fake path', async () => {
  mockId = '19';
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 12, titulo: 'Constancia PDF', descripcion: 'Documento de prueba', tipo: 'PDF' }] }) }).mockResolvedValueOnce({ ok: true, json: async () => ({ code: 200 }) });
  renderPage();
  const input = await screen.findByLabelText('Constancia PDF');
  fireEvent.change(input, { target: { files: [new File(['%PDF-1.4\nDocumento'], 'constancia.pdf', { type: 'application/pdf' })] } });
  await screen.findByText('Archivo listo: constancia.pdf');
  fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/asociarRepartidorAEvento'));
  const answer = JSON.parse(fetchMock.mock.calls[1][1].body).restricciones.restriccion1.respuesta;
  expect(answer.name).toBe('constancia.pdf');
  expect(answer.data).toMatch(/^data:application\/pdf;base64,/);
});

test('hour availability rejects negative typing and values but accepts zero and positive hours', () => {
  mockId = 'ejemplo'; jest.spyOn(global, 'fetch'); renderPage();
  const hours = screen.getByLabelText('Disponibilidad horaria');
  expect(hours).toHaveAttribute('min', '0');
  fireEvent.change(hours, { target: { value: '4' } });
  expect(hours).toHaveValue(4);
  fireEvent.change(hours, { target: { value: '-2' } });
  expect(hours).toHaveValue(4);
  const key = new KeyboardEvent('keydown', { key: '-', bubbles: true, cancelable: true });
  fireEvent(hours, key);
  expect(key.defaultPrevented).toBe(true);
  fireEvent.change(hours, { target: { value: '0' } });
  expect(hours).toHaveValue(0);
});

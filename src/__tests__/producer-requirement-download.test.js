import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RequisitosSolicitud from '../components/ComponentesEventos/RequisitosSolicitud';
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
afterEach(() => { global.fetch.mockRestore(); jest.clearAllMocks(); });
test('producer sees submitted PDF and downloads it with the current identity header', async () => {
  const oldCreate = URL.createObjectURL;
  const oldRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:test-document');
  URL.revokeObjectURL = jest.fn();
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  try {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ id: 8, titulo: 'Constancia PDF', archivo: { nombre: 'constancia.pdf', mimeType: 'application/pdf' } }, { id: 9, titulo: 'Experiencia', respuesta: 'Dos años' }] }) }).mockResolvedValueOnce({ ok: true, blob: async () => new Blob(['%PDF-1.4'], { type: 'application/pdf' }) });
    render(<RequisitosSolicitud asociacionId={7} consumidorId={1} />);
    expect(await screen.findByText('constancia.pdf')).toBeInTheDocument();
    expect(screen.getByText('Dos años')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Descargar archivo' }));
    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('asociacion/7/requisitos/8/archivo'), { headers: { ConsumidorId: 1 } });
    expect(click.mock.instances[0].download).toBe('constancia.pdf');
  } finally { click.mockRestore(); URL.createObjectURL = oldCreate; URL.revokeObjectURL = oldRevoke; }
});
test('failed document query offers retry and no download action', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false }).mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
  render(<RequisitosSolicitud asociacionId={7} consumidorId={1} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar los requisitos');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByText('Esta solicitud no tiene requisitos adjuntos.')).toBeInTheDocument();
});

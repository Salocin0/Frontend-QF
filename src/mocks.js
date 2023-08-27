// mocks.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('http://127.0.0.1:8000/login/', (req, res, ctx) => {
    const { contraseña, correoElectronico } = req.body;

    // Simula una respuesta exitosa para un usuario específico
    if (correoElectronico === 'usuario@example.com' && contraseña === 'password123') {
      return res(
        ctx.json({ code: 200, data: { sessionId: 'session123' } })
      );
    }

    // Simula una respuesta fallida para otros casos
    return res(
      ctx.json({ code: 401, error: 'Invalid credentials' }),
      ctx.status(401)
    );
  })
);

export { server };

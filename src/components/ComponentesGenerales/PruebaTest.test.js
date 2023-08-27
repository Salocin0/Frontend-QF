import { render, screen } from '@testing-library/react';
import { PruebaTest } from './pruebaTest';

describe('prueba', () => {
    it('must display', () =>{
        render(<PruebaTest/>)
        expect(screen.queryByText(/pruebaTest/i)).toBeInTheDocument();
    })
})
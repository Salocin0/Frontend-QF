import React from 'react';
import "./../sass/main.css";

const FiltrosEventosEncargado = () => {
    return (

        <div  >
            <div className="filtrosGeneral">
                <h2 className='filtrosLetra'>FILTROS</h2>
                <hr className='hrFiltros' />
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo2" /> Gratuito
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo2" /> Pago
                    </label>
                </div>
                <hr className='hrFiltros' />
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo3" /> Festival
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo3" /> Cine
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo3" /> Fiesta
                    </label>
                </div>
                <hr className='hrFiltros' />
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo4" /> En Curso
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo4" /> Proxima Semana
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo4" /> Proximo Mes
                    </label>
                </div>
                <hr className='hrFiltros' />
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo5" /> Con Preventa
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo5" /> Sin Preventa
                    </label>
                </div>
            </div>
        </div>
    )
}

export default FiltrosEventosEncargado;

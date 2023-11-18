import React from 'react';
import "./../sass/main.css";

const FiltersPuestosEncargado = () => {
    return (

        <div  >
            <div className="filtrosGeneral">
                <h2 className='filtrosLetra'>FILTROS</h2>
                <hr className='hrFiltros' />
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo1" /> Creado
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo1" /> Habilitados
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo1" /> Activos
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo1" /> Deshabilitados
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo1" /> Inactivos
                    </label>
                </div>
                <hr className='hrFiltros' />
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo2" /> En Evento
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo2" /> Asociacion Rechazada
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="filtroGrupo2" /> Asociacion Pendiente
                    </label>
                </div>
                <hr className='hrFiltros' />

            </div>
        </div>
    )
}

export default FiltersPuestosEncargado;

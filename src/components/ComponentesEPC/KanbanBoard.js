import React, { useEffect, useState, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from "react-toastify";
import PedidoDetalleDialog from './PedidoDetalleDialog';
import { UserContext } from '../ComponentesGenerales/UserContext';
import { useContext } from 'react';
import { FaEye } from 'react-icons/fa';
import useBreakpoint from '../../useBreakpoint';
import './KanbanVisual.css';
import { ESTADO_POR_COLUMNA, MOVIMIENTOS_PERMITIDOS, cambiarEstadoPedido } from './pedidoEstado';

const initialData = {
  tasks: {},
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Pendiente',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'Aceptado',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'En Preparación',
      taskIds: [],
    },
    'column-4': {
      id: 'column-4',
      title: 'En Camino',
      taskIds: [],
    },
    'column-5': {
      id: 'column-5',
      title: 'Entregado',
      taskIds: [],
    },
    'column-6': {
      id: 'column-6',
      title: 'Cancelado',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'],
};

// Cada cuánto se vuelven a pedir los pedidos para ver los nuevos y los cambios hechos por el
// consumidor o el repartidor sin recargar la página.
export const PEDIDOS_POLLING_MS = 4000;

const KanbanBoard = ({id}) => {
  const scrollRef = useRef(null);
  const [data, setData] = useState(initialData);
  const { user } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  const [recargar, setRecargar] = useState(0);
  // const [confirmPopup, setConfirmPopup] = useState(null); // removed confirmation
  const [showCancelledColumn] = useState(true);
  const [allowedColumns, setAllowedColumns] = useState(null);
  const [activeTask, setActiveTask] = useState(null); // for DragOverlay
  const [infoDialog, setInfoDialog] = useState({open:false, task:null});
  const [detailData, setDetailData] = useState(null); // fetched order detailsn
  const recargarComponente = () => {
    setRecargar(prevRecargar => prevRecargar + 1);
  };

  // No se refresca el tablero mientras se arrastra una tarjeta (la tarjeta "saltaría").
  const draggingRef = useRef(false);
  draggingRef.current = Boolean(activeTask);
  // Ids ya mostrados: permite avisar de los pedidos que llegan mientras el tablero está abierto.
  const pedidosConocidos = useRef(null);

  useEffect(() => {
    pedidosConocidos.current = null;
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden && !draggingRef.current) recargarComponente();
    }, PEDIDOS_POLLING_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let vigente = true;
    if (user) {
      const headers = new Headers();
      headers.append('ConsumidorId', user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/puesto/${id}`, {
        method: 'GET',
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          // Respuesta vieja (llegó otra más nueva) o el usuario está arrastrando: se espera a la próxima.
          if (!vigente || draggingRef.current) return;
          const pedidos = data.data;
          if (pedidosConocidos.current) {
            pedidos
              .filter((pedido) => !pedidosConocidos.current.has(pedido.id) && pedido.estado === 'Pendiente')
              .forEach((pedido) => toast.info(`Nuevo pedido #${pedido.id}`));
          }
          pedidosConocidos.current = new Set(pedidos.map((pedido) => pedido.id));
          const newTasks = {};
          pedidos.forEach((pedido) => {
            // construct consumer name if available
            let consumerName = '';
            if (pedido.Consumidor) {
              consumerName = `${pedido.Consumidor.nombre || ''} ${pedido.Consumidor.apellido || ''}`.trim();
              if (pedido.Consumidor.usuario && pedido.Consumidor.usuario.usuario) {
                consumerName = pedido.Consumidor.usuario.usuario;
              }
            }
            newTasks[`task-${pedido.id}`] = {
              id: `task-${pedido.id}`,
              content: `Pedido ID: ${pedido.id}`,
              fecha: pedido.fecha,
              total: pedido.total,
              estado: pedido.estado,
              consumerName,
              detalles: pedido.detalles || [],
            };
          });

          const newState = {
            ...initialData,
            tasks: newTasks,
            columns: {
              ...initialData.columns,
              'column-1': {
                ...initialData.columns['column-1'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'Pendiente'),
              },
              'column-2': {
                ...initialData.columns['column-2'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'Aceptado'),
              },
              'column-3': {
                ...initialData.columns['column-3'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'EnPreparacion'),
              },
              'column-4': {
                ...initialData.columns['column-4'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'EnCamino'),
              },
              'column-5': {
                ...initialData.columns['column-5'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'Entregado'),
              },
              'column-6': {
                ...initialData.columns['column-6'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'Cancelado'),
              },
            },
          };

          setData(newState);
        })
        .catch((error) => console.log('No existen pedidos.', error));
    }
    return () => {
      vigente = false;
    };
  }, [user, recargar,id]);

  const updatePedidoState = async (taskId, newColumnId) => {
    const pedidoId = taskId.split('-')[1];
    const newEstado = ESTADO_POR_COLUMNA[newColumnId];
    const result = await cambiarEstadoPedido(process.env?.REACT_APP_BACK_URL, pedidoId, newEstado);
    if (result.ok) toast.success(`Pedido ${newEstado}`);
    else toast.error(result.message);
    // Reload either way so the board always shows the real state stored in the backend.
    recargarComponente();
  };

  const allowedMovesMap = MOVIMIENTOS_PERMITIDOS;

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#FFC107'; // Amarillo
      case 'EnPreparacion':
        return 'lightblue'; // Azul
      case 'EnCamino':
        return 'pink'; // Azul
      case 'Entregado':
        return 'green'; // Verde
      case 'Aceptado':
        return 'lightgreen'; // Verde
      case 'Cancelado':
        return 'red'; // Verde
      default:
        return '#6C757D'; // Gris
    }
  };

  const formatDate = (fecha) => {
    const d = new Date(fecha);
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2,'0');
    const mi = String(d.getMinutes()).padStart(2,'0');
    return `${dd}/${mm}/${yy} ${hh}:${mi}`;
  };

  // Visual card content — reused in SortableItem and DragOverlay
  const TaskCardContent = ({ task, onVerDetalle }) => (
    <>
      <div className="qf-kanban-order-title">Pedido #{task.id.replace('task-', '')}</div>
      {(task.consumerName || task.consumidorId) && (
        <div className="qf-kanban-customer" style={{ fontSize: '0.9em', marginTop: '4px' }}>
          Consumidor: {task.consumerName || task.consumidorId}
        </div>
      )}
      <div className="qf-kanban-date" style={{ marginTop: '4px', marginBottom: '4px', fontSize: '0.9em' }}>
        {formatDate(task.fecha)}
      </div>
      {task.detalles && task.detalles.length > 0 && (
        <ul className="qf-kanban-products" style={{ margin: '4px 0', paddingLeft: '18px', fontSize: '0.9em', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {task.detalles.map((d) => (
            <li key={d.id}>
              {d.cantidad}x {d.producto?.nombre || d.productoId}
            </li>
          ))}
        </ul>
      )}
      <div className="qf-kanban-total"><span>Total</span><strong>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(task.total) || 0)}</strong></div>
      {onVerDetalle && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', paddingTop: '8px' }}>
          <button
            className="qf-kanban-detail"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onVerDetalle();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--qf-naranja)',
              color: 'var(--qf-text-white)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85em',
            }}
          >
            <FaEye /> Ver detalle
          </button>
        </div>
      )}
    </>
  );



  const handleDelete = async (taskId) => {
    const result = await cambiarEstadoPedido(process.env.REACT_APP_BACK_URL, taskId.split('-')[1], 'Cancelado');
    if (result.ok) toast.success('Pedido Cancelado');
    else toast.error(result.message);
    recargarComponente();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

  const SortableItem = ({task}) => {
    const {attributes, listeners, setNodeRef} = useSortable({id: task.id});
    const statusColor = getStatusColor(task.estado);
    const style = {
      userSelect: 'none',
      touchAction: 'none',
      padding: '8px',
      margin: '0 0 8px 0',
      minHeight: '120px',
      width: '100%',
      minWidth: 0,
      flexShrink: 0,
      boxSizing: 'border-box',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      backgroundColor: "var(--qf-bg-secondary)",
      color: '#F7B813',
      border: `1px solid ${statusColor}`,
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      opacity: activeTask && activeTask.id === task.id ? 0.3 : 1,
    };
    return (
      <div className="qf-kanban-task" ref={setNodeRef} {...attributes} {...listeners} style={style}>
        <TaskCardContent task={task} onVerDetalle={() => setInfoDialog({ open: true, task })} />
      </div>
    );
  };

  const Column = ({column}) => {
    const {id} = column;
    const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
    const { setNodeRef } = useDroppable({id});

    const headerColors = {
      'column-1': '#FFC107', // Amarillo
      'column-2': 'lightgreen',
      'column-3': 'lightblue', // Verde
      'column-4': 'pink', // Verde
      'column-5': 'green',
      'column-6': 'red',
    };

    if (id === 'column-6' && !showCancelledColumn) return null;
    if (id === 'column-3') column.title = 'En Prep.';

    return (
      <div className={`qf-kanban-column qf-kanban-${column.id}`} key={column.id} style={{ flex: '0 0 auto', width: isMobile ? '80vw' : '280px', minWidth: isMobile ? '80vw' : '250px', margin: '0 6px', opacity: allowedColumns && !allowedColumns.includes(column.id) ? 0.4 : 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ textAlign: 'center', color: '#FFF', backgroundColor: headerColors[column.id], padding: '8px', borderRadius: '4px', margin: 0 }}><span className="qf-kanban-column-name">{column.id === 'column-3' ? 'En preparación' : column.title}</span><span className="qf-kanban-counter" aria-label={`${tasks.length} pedidos`}>{tasks.length}</span></h3>
        <div className="qf-kanban-dropzone" ref={setNodeRef} style={{ background: '#333', padding: '8px', flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <SortableContext items={column.taskIds} strategy={verticalListSortingStrategy}>
            {!tasks.length && <p className="qf-kanban-empty">Sin pedidos en este estado</p>}
            {tasks.map((task) => (
              <SortableItem key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  };

  const handleDragMove = (event) => {
    const { activatorEvent } = event;
    if (!activatorEvent || !('clientX' in activatorEvent)) return;

    const container = scrollRef.current;
    if (!container) return;

    const clientX = activatorEvent.clientX;
    const rect = container.getBoundingClientRect();
    const threshold = 60;

    if (clientX < rect.left + threshold) {
      container.scrollLeft -= 12;
    } else if (clientX > rect.right - threshold) {
      container.scrollLeft += 12;
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    if (!active) return;
    const task = data.tasks[active.id];
    if (task) {
      const estado = task.estado;
      setAllowedColumns(allowedMovesMap[estado] || []);
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const currentAllowedColumns = allowedColumns;
    setAllowedColumns(null);

    const {active, over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find source and destination columns
    let sourceColumnId = null;
    let destColumnId = null;
    Object.keys(data.columns).forEach((colId) => {
      if (data.columns[colId].taskIds.includes(activeId)) sourceColumnId = colId;
      if (data.columns[colId].taskIds.includes(overId)) destColumnId = colId;
    });

    // If dropped on empty column, overId may be column id
    if (!destColumnId && data.columns[overId]) destColumnId = overId;

    if (!sourceColumnId || !destColumnId) {
      return;
    }

    // disallow move if destination not permitted
    if (currentAllowedColumns && !currentAllowedColumns.includes(destColumnId)) {
      toast.error('Movimiento no permitido en ese estado');
      return;
    }

    if (sourceColumnId === destColumnId) {
      const items = Array.from(data.columns[sourceColumnId].taskIds);
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        const newState = {
          ...data,
          columns: {
            ...data.columns,
            [sourceColumnId]: {
              ...data.columns[sourceColumnId],
              taskIds: newItems,
            },
          },
        };
        setData(newState);
      }
      return;
    }

    // Moving between columns: put at end of dest
    const sourceTaskIds = Array.from(data.columns[sourceColumnId].taskIds).filter(id => id !== activeId);
    const destTaskIds = Array.from(data.columns[destColumnId].taskIds);
    destTaskIds.push(activeId);

    // immediately update state without confirmation
    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [sourceColumnId]: {
          ...data.columns[sourceColumnId],
          taskIds: sourceTaskIds,
        },
        [destColumnId]: {
          ...data.columns[destColumnId],
          taskIds: destTaskIds,
        },
      },
    };
    setData(newState);
    updatePedidoState(activeId, destColumnId);
  };
  useEffect(() => {
    if (infoDialog.open && infoDialog.task) {
      const pedidoId = infoDialog.task.id.replace('task-','');
      fetch(`${process.env.REACT_APP_BACK_URL}pedido/${pedidoId}`)
        .then(res => res.json())
        .then(res => {
          if (res && res.data) {
            setDetailData(res.data);
          }
        })
        .catch(err => console.error('Error fetching pedido details', err));
    } else {
      setDetailData(null);
    }
  }, [infoDialog]);

  return (
    <div className="qf-kanban-board" ref={scrollRef} style={{ display: 'flex', flex: 1, minHeight: 0, height: isMobile ? 'auto' : '100%', margin: 0, padding: '4px 0', overflowX: 'auto', overflowY: 'hidden', gap: 0 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragCancel={() => { setAllowedColumns(null); setActiveTask(null); }} onDragEnd={handleDragEnd}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          return <Column key={columnId} column={column} />;
        })}
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="qf-kanban-task qf-kanban-overlay" style={{
              padding: '8px',
              margin: '0',
              minHeight: '120px',
              width: isMobile ? '80vw' : '280px',
              boxSizing: 'border-box',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              backgroundColor: 'var(--qf-bg-secondary)',
              color: '#F7B813',
              border: `1px solid ${getStatusColor(activeTask.estado)}`,
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              cursor: 'grabbing',
            }}>
              <TaskCardContent task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* confirmation popup removed - moves now apply immediately */}
      <PedidoDetalleDialog
        infoDialog={infoDialog}
        detailData={detailData}
        onClose={() => setInfoDialog({ open: false, task: null })}
      />
    </div>
  );
};

export default KanbanBoard;

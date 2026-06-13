import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from "react-toastify";
import PedidoDetalleDialog from './PedidoDetalleDialog';
import { UserContext } from '../ComponentesGenerales/UserContext';
import { useContext } from 'react';
import { FaEye } from 'react-icons/fa';
import useBreakpoint from '../../useBreakpoint';

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

const KanbanBoard = ({id}) => {
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

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append('ConsumidorId', user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/puesto/${id}`, {
        method: 'GET',
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const pedidos = data.data;
          console.log(id);
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
  }, [user, recargar,id]);

  const updatePedidoState = (taskId, newColumnId) => {

    const taskId2 = taskId.split('-')[1];

    const newState = {
      'column-1': 'Pendiente',
      'column-2': 'Aceptado',
      'column-3': 'En Preparación',
      'column-4': 'En Camino',
      'column-5': 'Entregado',
      'column-6': 'Cancelado',
    };

    const newEstado = newState[newColumnId];

    fetch(`${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${taskId2}/${newEstado}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`Pedido ${newEstado}`);
        recargarComponente();
      })
      .catch((error) => console.error("Error updating pedido state:", error));
  };





  const allowedMovesMap = {
    'Pendiente': ['column-1','column-2','column-3','column-5','column-6'],
    'Aceptado': ['column-2','column-3','column-4','column-5','column-6'],
    'EnPreparacion': ['column-3','column-4','column-5','column-6'],
    'EnCamino': ['column-4','column-5','column-6'],
    'Entregado': ['column-5'],
    'Cancelado': ['column-6'],
  };

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
  const TaskCardContent = ({ task }) => (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} />
      {(task.consumerName || task.consumidorId) && (
        <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
          Consumidor: {task.consumerName || task.consumidorId}
        </div>
      )}
      <div style={{ marginTop: '4px', marginBottom: '4px', fontSize:'0.9em' }}>
        {formatDate(task.fecha)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>${Number(task.total).toFixed(2)}</div>
      </div>
    </>
  );



  const handleDelete = (taskId) => {
    const taskId2 = taskId.split('-')[1];

    fetch(`${process.env.REACT_APP_BACK_URL}pedido/cambiarEstado/${taskId2}/Cancelado`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload()

        toast.success(`Pedido Cancelado`);

        // Asegúrate de que data está definido antes de manipularlo
        if (!data || !data.tasks || !data.columns) {
          console.error("Datos no definidos correctamente:", data);
          return;
        }

        const newTasks = { ...data.tasks };
        delete newTasks[taskId];

        const newColumns = { ...data.columns };
        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(
            (id) => id !== taskId
          );
        });

        const newState = {
          ...data,
          tasks: newTasks,
          columns: newColumns,
        };

        setData(newState);

      })
      .catch((error) => console.error("Error canceling pedido:", error));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const SortableItem = ({task}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: task.id});
    const statusColor = getStatusColor(task.estado);
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      userSelect: 'none',
      padding: '8px',
      margin: '0 0 8px 0',
      minHeight: '120px',
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
      <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
        <TaskCardContent task={task} />
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
      <div key={column.id} style={{ flex: '0 0 auto', width: isMobile ? '80vw' : '280px', minWidth: isMobile ? '80vw' : '250px', margin: '0 6px', opacity: allowedColumns && !allowedColumns.includes(column.id) ? 0.4 : 1 }}>
        <h3 style={{ textAlign: 'center', color: '#FFF', backgroundColor: headerColors[column.id], padding: '8px', borderRadius: '4px', margin: 0 }}>{column.title}</h3>
        <div ref={setNodeRef} style={{ background: '#333', padding: '8px', minHeight: isMobile ? '50vh' : '55vh', maxHeight: isMobile ? '50vh' : '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <SortableContext items={column.taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableItem key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
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
      setAllowedColumns(null);
      return;
    }

    // disallow move if destination not permitted
    if (allowedColumns && !allowedColumns.includes(destColumnId)) {
      toast.error('Movimiento no permitido en ese estado');
      setAllowedColumns(null);
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
        setAllowedColumns(null);
  };
  useEffect(() => {
    if (infoDialog.open && infoDialog.task) {
      const pedidoId = infoDialog.task.id.replace('task-','');
      fetch(`${process.env.REACT_APP_BACK_URL}pedido/${pedidoId}`)
        .then(res => res.json())
        .then(res => {
          console.log('pedido detail response', res);
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
    <div style={{ display: 'flex', height: isMobile ? 'auto' : '75vh', margin: 0, padding: '4px 0', overflowX: 'auto', overflowY: 'hidden', gap: 0 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragCancel={() => { setAllowedColumns(null); setActiveTask(null); }} onDragEnd={handleDragEnd}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          return <Column key={columnId} column={column} />;
        })}
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div style={{
              padding: '8px',
              margin: '0',
              minHeight: '120px',
              width: isMobile ? '80vw' : '280px',
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

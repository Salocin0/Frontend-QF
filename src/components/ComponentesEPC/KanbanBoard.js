import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import useDynamicColors from '../../UseDinamicColors';
import { UserContext } from '../ComponentesGenerales/UserContext';
import { useContext } from 'react';

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
  const [recargar, setRecargar] = useState(0);
  const [confirmPopup, setConfirmPopup] = useState(null);
  const [showCancelledColumn, setShowCancelledColumn] = useState(true);
  const Colors = useDynamicColors();

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
            newTasks[`task-${pedido.id}`] = {
              id: `task-${pedido.id}`,
              content: `Pedido ID: ${pedido.id}`,
              fecha: pedido.fecha,
              total: pedido.total,
              estado: pedido.estado,
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


  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const task = data.tasks[draggableId];

    setConfirmPopup({
      taskId: draggableId,
      fromColumn: start.id,
      toColumn: finish.id,
      onConfirm: () => {
        const newState = {
          ...data,
          columns: {
            ...data.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
          },
        };

        setData(newState);

        // Update the state in the backend
        updatePedidoState(task.id, finish.id);

        setConfirmPopup(null);
      },
      onCancel: () => setConfirmPopup(null),
    });
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

  return (
    <div style={{ display: 'flex', height: '70vh', margin: 0, padding: 0 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
          const headerColors = {
            'column-1': '#FFC107', // Amarillo
            'column-2': 'lightgreen',
            'column-3': 'lightblue', // Verde
            'column-4': 'pink', // Verde
            'column-5': 'green',
            'column-6': 'red',
          };

          if (columnId === 'column-6' && !showCancelledColumn) {
            return null; // No renderizar la columna si está oculta
          } else if (columnId === 'column-3')  {
            column.title = 'En Prep.'

          }

          return (
            <div key={column.id} style={{ flex: 1, margin: '8px' }}>
              <h3 style={{ textAlign: 'center', color: '#FFF', backgroundColor: headerColors[column.id], padding: '8px', borderRadius: '4px' }}>{column.title}</h3>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: '#333',
                      padding: '8px',
                      height: '90%',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: '8px',
                              margin: '0 0 8px 0',
                              minHeight: '100px',
                              backgroundColor: Colors.GrisAzuladoClaro,
                              color: '#F7B813',
                              border: '1px solid #F7B813',
                              borderRadius: '4px',
                              transition: 'transform 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>#{task.id.replace('task-', '')}</div>
                              <button
                                onClick={() => handleDelete(task.id)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#F7B813',
                                  fontSize: '20px',
                                  cursor: 'pointer',
                                  marginTop: '-30px',
                                }}
                              >
                                &times;
                              </button>
                            </div>
                            <div style={{ marginTop: '4px', marginBottom: '8px' }}>
                              <div>{new Date(task.fecha).toLocaleDateString()} {new Date(task.fecha).toLocaleTimeString("es")}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>${Number(task.total).toFixed(2)}</div>
                              <div style={{ backgroundColor: getStatusColor(task.estado), color: 'black', padding: '10px 4px', fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', margin:0 }}>
                                {task.estado}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>

      {confirmPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: '#FFF',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          border: '2px solid #000',
          borderRadius: '4px',
          zIndex: 1000,
          textAlign: 'center',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          color: '#000',
        }}>
          <h4 style={{ margin: 0, color: '#000' }}>Confirmar Movimiento</h4>
          <p style={{ margin: '10px 0', color: '#000' }}>
            ¿Mover pedido #{confirmPopup.taskId.replace('task-', '')} al estado "{data.columns[confirmPopup.toColumn].title}"?
          </p>
          <button onClick={confirmPopup.onConfirm} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28A745', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            Confirmar
          </button>
          <button onClick={confirmPopup.onCancel} style={{ padding: '10px 20px', backgroundColor: '#DC3545', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;

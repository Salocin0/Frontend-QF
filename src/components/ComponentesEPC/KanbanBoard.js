import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import "./.././sass/main.css";

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
      title: 'En Preparación',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Entregado',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [session, setSession] = useState(null);
  const [recargar, setRecargar] = useState(0);
  const [confirmPopup, setConfirmPopup] = useState(null);

  const recargarComponente = () => {
    setRecargar(prevRecargar => prevRecargar + 1);
  };

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      console.error('No session ID found.');
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
      })
      .catch((error) => console.error('Error fetching session:', error));
  }, []);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append('ConsumidorId', session.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/puesto/`, {
        method: 'GET',
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const pedidos = data.data;
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
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'EnPreparacion'),
              },
              'column-3': {
                ...initialData.columns['column-3'],
                taskIds: Object.keys(newTasks).filter(key => newTasks[key].estado === 'Entregado'),
              },
            },
          };

          setData(newState);
        })
        .catch((error) => console.log('No existen pedidos.', error));
    }
  }, [session, recargar]);

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
        return '#17A2B8'; // Azul
      case 'Entregado':
        return '#28A745'; // Verde
      default:
        return '#6C757D'; // Gris
    }
  };

  const handleDelete = (taskId) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const newColumns = { ...data.columns };
    Object.keys(newColumns).forEach(columnId => {
      newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== taskId);
    });

    const newState = {
      ...data,
      tasks: newTasks,
      columns: newColumns,
    };

    setData(newState);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          const headerColors = {
            'column-1': '#FFC107', // Amarillo
            'column-2': '#17A2B8', // Azul
            'column-3': '#28A745', // Verde
          };

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
                              padding: '16px',
                              margin: '0 0 8px 0',
                              minHeight: '100px',
                              backgroundColor: '#000',
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
                              <div style={{ fontSize: '2em', fontWeight: 'bold' }}>#{task.id.replace('task-', '')}</div>
                              <button
                                onClick={() => handleDelete(task.id)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#F7B813',
                                  fontSize: '24px',
                                  cursor: 'pointer',
                                }}
                              >
                                &times;
                              </button>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <div>{new Date(task.fecha).toLocaleDateString()} {new Date(task.fecha).toLocaleTimeString()}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>${Number(task.total).toFixed(2)}</div>
                              <div style={{ backgroundColor: getStatusColor(task.estado), color: '#FFF', padding: '4px 8px', borderRadius: '4px' }}>
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
          borderRadius: '4px',
          zIndex: 1000,
          textAlign: 'center',
        }}>
          <h4 style={{ margin: 0 }}>Confirmar Movimiento</h4>
          <p style={{ margin: '10px 0' }}>¿Estás seguro de que deseas mover el pedido #{confirmPopup.taskId} de la columna "{data.columns[confirmPopup.fromColumn].title}" a la columna "{data.columns[confirmPopup.toColumn].title}"?</p>
          <button onClick={confirmPopup.onConfirm} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28A745', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Confirmar</button>
          <button onClick={confirmPopup.onCancel} style={{ padding: '10px 20px', backgroundColor: '#DC3545', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;

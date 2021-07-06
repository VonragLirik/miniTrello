import React, { Dispatch, SetStateAction, useState } from 'react';
import './Column.scss';

export interface StandardComponentProps {
  columnValue: any, 
  allTasks: any, 
  setAllTasks: Dispatch<SetStateAction<any>>, 
  columnIndex: number, 
  currentColumn: any, 
  setCurrentColumn: Dispatch<SetStateAction<any>>, 
  currentTicket: any, 
  setCurrentTicket: Dispatch<SetStateAction<any>>
}

const Column = ({
  columnValue, 
  allTasks, 
  setAllTasks, 
  columnIndex, 
  currentColumn, 
  setCurrentColumn, 
  currentTicket, 
  setCurrentTicket
}: StandardComponentProps) => {
  const [ticketName, setTicketName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addNewTicket = () => {
    const tempArray = [...allTasks];
    const newTicketValue = {
      name: ticketName,
    };

    tempArray[columnIndex].data.push(newTicketValue);
    setAllTasks(tempArray);
    setTicketName("");
    setIsAdding(false);
  } 

  const deleteTicket = (index: number) => {
    const tempArray = [...allTasks];
    tempArray[columnIndex].data.splice(index, 1);
    setAllTasks(tempArray);
  }

  const deleteColumn = () => {
    const tempArray = [...allTasks];
    tempArray.splice(columnIndex, 1);
    setAllTasks(tempArray);
  }

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>, columnValue: any, index: number) => {
    setCurrentColumn({value: columnValue, index});
  }

  const dropHandler = (e: any, columnValue: any) => {
    e.preventDefault();
    const tempArray = [...allTasks];
    tempArray.splice(currentColumn.index, 1);
    const indexNewColumn = allTasks.indexOf(columnValue);
    tempArray.splice(indexNewColumn, 0, currentColumn.value);
    setAllTasks(tempArray);
    e.target.style.background = '#f0f0f0';
  }

  const dropOverHandler = (e: any) => {
    e.preventDefault();
    e.target.style.background = 'grey';
  }

  const dragEndHandler = (e: any, isWhite = false) => {
    e.target.style.background = isWhite? 'white': '#f0f0f0';
  }

  const dragStartHandlerTicket = (e: React.DragEvent<HTMLDivElement>, ticketValue: any, index: number) => {
    setCurrentTicket({value: ticketValue.data[index], index, columnIndex});
  }

  const dropHandlerTicket = (e: any, ticketValue: any) => {
    e.preventDefault();
    const tempArray = [...allTasks];
    tempArray[currentTicket.columnIndex].data.splice(currentTicket.index, 1);
    const indexNewColumn = allTasks[columnIndex].data.indexOf(ticketValue);
    tempArray[columnIndex].data.splice(indexNewColumn, 0, currentTicket.value);
    setAllTasks(tempArray);
    e.target.style.background = 'white';
  }

  return (
    <div className="column">
      <div 
        className="column__header"
        draggable
        onDragStart={(e) => dragStartHandler(e, columnValue, columnIndex)}
        onDrop={(e) => dropHandler(e, columnValue)}
        onDragOver={(e) => dropOverHandler(e)}
        onDragLeave={(e) => dragEndHandler(e)}
        onDragEnd={(e) => dragEndHandler(e)}
      >
        <p>{columnValue.name}</p>
        {isAdding   
          ? <>
            <input onChange={(e) => setTicketName(e.target.value)} value={ticketName}/>
            <button onClick={() => addNewTicket()}>
              Done
            </button>
          </>
          : <button onClick={() => setIsAdding(true)}>
              Add Ticket
            </button>
        }
        <button onClick={() => deleteColumn()}>Delete Column</button>
      </div>
      <div  className="column__body">
        {
          columnValue.data?.map((ticket: any, index: number) => (
            <div 
              key={`${ticket}-${index}`} 
              className="column__ticket"
              draggable
              onDragStart={(e) => dragStartHandlerTicket(e, columnValue, index)}
              onDrop={(e) => dropHandlerTicket(e, columnValue)}
              onDragOver={(e) => dropOverHandler(e)}
              onDragLeave={(e) => dragEndHandler(e, true)}
              onDragEnd={(e) => dragEndHandler(e, true)}
            > 
              <p>{ticket.name}</p>
              <button onClick={() => deleteTicket(index)}>Delete Ticket</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Column;
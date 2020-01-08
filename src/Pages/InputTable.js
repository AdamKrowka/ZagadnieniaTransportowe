import React from "react";
import { Link } from "react-router-dom";

const InputTable = ({ table, handleSendData, getResolution, handleStart }) => {
  let tempTable = table;

  const handleFillCell = e => {
    let i = e.target.getAttribute("row");
    let j = e.target.getAttribute("col");
    let tab = tempTable.map(e => e);
    tab[i][j] = +e.target.value;
    tempTable = tab;
    console.table(tempTable);
    handleSendData(tempTable);
  };

  let tableRow = [];
  for (let i = 0; i < table.length; i++) {
    let cell = [];
    for (let j = 0; j < table[i].length; j++) {
      cell.push(
        <input
          onFocus={e => (e.target.value = "")}
          style={
            i === table.length - 1 && j === table[i].length - 1
              ? { opacity: 0, cursor: "default" }
              : i === table.length - 1 || j === table[i].length - 1
              ? { backgroundColor: "#35ADC0" }
              : {}
          }
          type="number"
          key={i + "" + j}
          row={i}
          col={j}
          onChange={handleFillCell}
          value={table[i][j]}
        ></input>
      );
    }

    let row = (
      <div className="table" key={i}>
        {cell}
      </div>
    );
    tableRow.push(row);
  }
  return (
    <>
      {tableRow}
      <div className="btnWrap">
        <Link to="/">WSTECZ</Link>
        <Link onClick={handleStart} to="/step">
          KROK PO KROKU
        </Link>
        <Link onClick={getResolution} to="/resolution">
          ROZWIĄZANIE
        </Link>
      </div>
    </>
  );
};

export default InputTable;

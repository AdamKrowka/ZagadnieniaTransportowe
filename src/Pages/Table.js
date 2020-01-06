import React from "react";
import "../CSS/Table.css";
const Table = ({ table = [[]], title }) => {
  let tabViev = [];
  for (let i = 0; i < table.length; i++) {
    let row = [];
    for (let j = 0; j < table[i].length; j++) {
      row.push(
        <div
          key={j}
          className="tableCell"
          style={
            i === table.length - 1 && j === table[i].length - 1
              ? { fontSize: 0, backgroundColor: "#35ADC0" }
              : i === table.length - 1 || j === table[i].length - 1
              ? { backgroundColor: "#35ADC0" }
              : {}
          }
        >
          {table[i][j] != null ? table[i][j] : 0}
        </div>
      );
    }

    tabViev.push(
      <div key={i} className="tableRow">
        {" "}
        {row}
      </div>
    );
  }

  return (
    <>
      <h3 className="tableTitle">{title}</h3>
      <div className="tableBorder">{tabViev}</div>
    </>
  );
};

export default Table;

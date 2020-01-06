import React, { useState } from "react";
import { Link } from "react-router-dom";

const CreateTable = ({ handleSubmit }) => {
  const [size, setSize] = useState({ row: 4, col: 4 });

  const handleChange = e => {
    if (e.target.id === "row")
      setSize({
        row:
          e.target.value < 10 && e.target.value > 1 ? e.target.value : size.row,

        col: size.col
      });
    else if (e.target.id === "col")
      setSize({
        row: size.row,
        col:
          e.target.value < 10 && e.target.value > 1 ? e.target.value : size.col
      });
  };

  const sendData = () => {
    handleSubmit(size);
  };
  const handleFocus = e => {
    e.target.value = "";
  };

  const handleBlur = e => {
    if (e.target.id === "row") e.target.value = size.row;
    else if (e.target.id === "col") e.target.value = size.col;
  };
  return (
    <div className="CreateWrapper">
      <label htmlFor="row">Ilość wierszy </label>
      <input
        type="number"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={size.row}
        onChange={handleChange}
        id="row"
      />
      <label htmlFor="col">Ilość kolumn </label>
      <input
        type="number"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={size.col}
        onChange={handleChange}
        id="col"
      />
      <Link onClick={sendData} to="/inputTable">
        STWÓRZ TABELE
      </Link>
    </div>
  );
};

export default CreateTable;

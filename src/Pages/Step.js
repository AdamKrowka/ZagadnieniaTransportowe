import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "./Table";

const Step = ({ zt }) => {
  const [newData, setNewData] = useState([[]]);
  const nextStep = () => {
    let data = zt.kolejnyKrok();
    setNewData(data);
  };

  return (
    <>
      <div className="btnWrap">
        <Link to="/">POWRÓT</Link>
        <button onClick={nextStep}>NASTĘPNY</button>
      </div>
      <Table table={newData.data} title={newData.desc}></Table>
    </>
  );
};

export default Step;

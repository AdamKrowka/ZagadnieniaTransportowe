import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "./Table";

const Step = ({ handleNextStep, zt }) => {
  let data = { data: 0 };
  const [newData, setNewData] = useState(data);
  const nextStep = () => {
    data = zt.kolejnyKrok();
    setNewData(data);
    handleNextStep(data);
  };

  return (
    <>
      <div className="btnWrap">
        <Link to="/">POWRÓT</Link>
        <Link to="/step" onClick={nextStep}>
          NASTĘPNY
        </Link>
      </div>
      <Table table={newData.data} title={newData.desc}></Table>
      {/* <Table table={zt.Rozwiazanie} title={newData.message}></Table> */}
    </>
  );
};

export default Step;

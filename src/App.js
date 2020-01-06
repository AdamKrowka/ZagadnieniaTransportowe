import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import "./CSS/App.css";
import CreateTable from "./Pages/CreateTable";
import InputTable from "./Pages/InputTable";
import Table from "./Pages/Table";
import Step from "./Pages/Step.js";
import { ZT } from "./ZT";

const zt = new ZT();
function App() {
  const [table, setTable] = useState([[]]);
  const [resolution, setResolution] = useState([[]]);
  const [cost, setCost] = useState(0);
  let tabelaTestowa = [];
  const handleCreate = size => {
    let tab = [];
    for (let i = 0; i < +size.row; i++) {
      let row = [];
      for (let j = 0; j < +size.col; j++) {
        row.push(1);
      }
      tab.push(row);
    }
    setTable(tab);
  };

  const handleSendData = tab => {
    setTable(tab);
  };

  const getResolution = e => {
    zt.setTable(table);
    while (!zt.Optymalne) {
      zt.kolejnyKrok();
    }
    setResolution(zt.getRozwiazanie());
    tabelaTestowa = zt.Tabela;
    setCost(zt.kosztOptymalny);
  };

  const handleStart = () => {
    zt.setTable(table);
  };
  const handleNextStep = data => {
    // setNewData(data);
    console.table(data);
  };

  return (
    <Router basename="/">
      <div className="App">
        <header className="App-header">
          <h1>Zagadnienie Transoprtowe</h1>
          <Redirect to="/"></Redirect>
          <Switch>
            <Route exact path="/">
              <CreateTable handleSubmit={handleCreate}></CreateTable>
            </Route>
            <Route path="/inputTable">
              <InputTable
                table={table}
                handleSendData={handleSendData}
                getResolution={getResolution}
                handleStart={handleStart}
              ></InputTable>
            </Route>
            <Route path="/step">
              <Step handleNextStep={handleNextStep} zt={zt}></Step>
            </Route>
            <Route path="/resolution">
              <Table table={zt.Tabela} title="Tablela kosztów"></Table>
              <Table table={resolution} title="Tabela wyników"></Table>
              <h4>Koszt jest równy: {cost}</h4>

              <Link to="/">POWRÓT</Link>
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;

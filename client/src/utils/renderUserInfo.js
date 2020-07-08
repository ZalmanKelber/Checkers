import React from 'react';
import ReactDOM from 'react-dom';
import Table from "react-bootstrap/Table";

function renderUserInfo(tableData) {

  ReactDOM.render(
    <React.StrictMode>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Game Link</th>
          <th>Game Status</th>
          <th>Black Player</th>
          <th>Red Player</th>
          <th>Winner</th>
        </tr>
      </thead>
      <tbody>
        {
          tableData.map((row, i) => {
            return (
              <tr key={i}>
                <td><a className="game-link" href={"http://localhost:3000/game/" + row.gameId} >Go to game</a></td>
                <td>{row.gameStatus}</td>
                <td>{row.blackPlayer}</td>
                <td>{row.redPlayer}</td>
                <td>{row.winner}</td>
              </tr>
          )
          })
        }
      </tbody>
    </Table>
    </React.StrictMode>,
    document.getElementById("user-info-table")
  );
}

export default renderUserInfo;

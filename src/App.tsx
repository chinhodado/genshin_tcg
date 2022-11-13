import React from 'react';
import './App.css';

function App() {
  return (
    <div id="main-container">
      <div id="left-panel">somethging</div>
      <div id="right-panel">
        <div id="top-field"></div>
        <div id="bottom-field">
          <div id="active-char-1"></div>
          <div id="bench1-char-1"></div>
          <div id="bench2-char-1"></div>
          <div id="dice-1">
            <table id="dice-table-1">
              <tr>
                <td><div id="dice1-1" className="dice"></div></td>
                <td><div id="dice2-1" className="dice"></div></td>
                <td><div id="dice3-1" className="dice"></div></td>
                <td><div id="dice4-1" className="dice"></div></td>
              </tr>
              <tr>
                <td><div id="dice5-1" className="dice"></div></td>
                <td><div id="dice6-1" className="dice"></div></td>
                <td><div id="dice7-1" className="dice"></div></td>
                <td><div id="dice8-1" className="dice"></div></td>
              </tr>
            </table>
          </div>
          <div id="deck-1">Deck</div>
        </div>
      </div>
    </div>
  );
}

export default App;

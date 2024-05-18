import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  let image;
  if (props.value === "X") {
    image = (
      <img src="/X.png" alt="X" style={{ width: "100%", height: "100%" }} />
    );
  } else if (props.value === "O") {
    image = (
      <img src="/O.png" alt="O" style={{ width: "100%", height: "100%" }} />
    );
  }

  return (
    <button
      className={`square ${props.value ? "vertical-rotate" : ""}`}
      onClick={props.onClick}
    >
      {image}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="flex justify-center">
        <div>
          <div className="board-row flex">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row flex">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>

          <div className="board-row flex">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Volver a la jugada " + move : "TABLERO VACÍO";
      return (
        <div key={move}>
          <button className="historyButton" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </div>
      );
    });

    let status;
    if (winner) {
      status = "HA GANADO EL JUGADOR " + winner;
    } else {
      status = "TURNO DEL JUGADOR: " + (this.state.xIsNext ? "1" : "2");
    }

    return (
      <>
        <div className="all">

          <h1>JUGUEMOS A 3 EN RAYA</h1>
          <p>
            Empieza el jugador 1 (X) <br />
            eligiendo casilla primero. <br />
            Los movimientos quedarán guardados y <br />
            se podrá volver a cualquiera.
          </p>
          <div className="status">{status}</div>
        
        
        <div className="game-board ">
          <Board className="cuadrados"
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        
          <div className="infoButtons">
            <div>{moves}</div>
          </div>
        </div>
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
}

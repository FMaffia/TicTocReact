import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

function Square(props) {

    let value = props.value;
    let clazz = 'square';

    if (value === 'X') {
        clazz += ' btn btn-primary ';
    } else if (value === 'O') {
        clazz += ' btn btn-danger ';
    }

    if (!props.gameState.winningIndices && (!value || value === '') && props.gameState.hoverIndex === props.index) {
        value = props.gameState.xIsNext ? "X" : "O";
        clazz += " btn-secondary";
    }

    if (props.gameState.winningIndices && props.gameState.winningIndices.includes(props.index)) {
      clazz = "square btn-success";
  }

    if (props.gameState.selectedIndices) {

        let elemIndex = props.gameState.selectedIndices.indexOf(props.index);

        if (elemIndex !== -1) {
            if (elemIndex !== 0) {
                value = '';
                clazz = 'square';
            }
        }
    }

    return (
        <button className={clazz} onClick={props.onClick} onMouseEnter={props.mouseEnterFunc} onMouseLeave={props.mouseLeaveFunc}>
            {value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {

        return (
            <Square
                key={i}
                index={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                mouseEnterFunc={() => this.props.mouseEnterFunc(i)}
                mouseLeaveFunc={() => this.props.mouseLeaveFunc()}
                gameState={this.props.gameState}
            />
        );
    }

    createDivs() {
        const divs = [];
        for (let i = 0; i < 3; i++) {
            const innerDivs = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                innerDivs.push(this.renderSquare(j));
            }
            divs.push(<div className="board-row" key={i}>{innerDivs}</div>);
        }
        return divs;
    }

    render() {
        return (
            <div>{this.createDivs()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastIndex: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            selectedIndices: null,
            winningIndices: null,
            hoverIndex: null,
        }
    }

    calculateWinner(squares) {

        if (this.state.winningIndices) {
            return;
        }

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
                this.setState({
                    winningIndices: [a, b, c],
                });
                return;
            }
        }
    }

    handleSquareMouseEnter(i) {
        this.setState({
            hoverIndex: i
        });
    }

    handleSquareMouseLeave() {
        this.setState({
            hoverIndex: null
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        this.calculateWinner(squares);
        if (this.state.winningIndices || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.calculateWinner(squares);
        this.setState({
            history: history.concat([{
                squares: squares,
                lastIndex: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {

        const history = this.state.history.slice(0, step + 1);

        this.setState({
            history: history,
            stepNumber: step,
            winningIndices: null,
            xIsNext: (step % 2) === 0,
        });
    }

    evidenziaElemento(historyStep, pos) {

        const indices = [];
        if (historyStep) {
            let steps = this.state.history.slice(pos, this.state.history.length);

            steps.map((currHistory) => {
                indices.push(currHistory.lastIndex);
            });
        }
        this.setState({
            selectedIndices: indices,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        this.calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const showCoords =
                move ? ' coords: ' + calculateCoords(step.lastIndex) : '';
            const desc = move ?
                'Go to move #' + move
                : 'Restart';

            return (
                <li key={move}>
                    <button className=" btn btn-info historyButton"
                        onMouseEnter={() => this.evidenziaElemento(step, move)}
                        onMouseLeave={() => this.evidenziaElemento(null)}
                        onClick={() => this.jumpTo(move)}>{desc}</button>
                    {showCoords}
                </li>
            );
        });

        let title;
        let btnClazz;
        let buttonText;
        let img;
        let margin;
        let btn;

        if (this.state.winningIndices) {
            let winningPlayer = current.squares[this.state.winningIndices[0]];
            buttonText = winningPlayer;
            title = 'The Winner is ' ;
            btnClazz = 'square btn btn-success';
            img = <img src='/winner.png' width="150px"/>;
            margin = '20px';
            btn = <button className = {btnClazz} style={{ borderRadius: '48px' }}> {buttonText} </button>
        } else if (!current.squares.includes(null) && !current.squares.includes('')) {
          buttonText = 'O';
          title = 'Draw : No one wins ' ;
          btnClazz = 'square btn btn-warning';
          img = <img width="150px" src='/draw.jpg' />;
          margin='20px';
        } else {
          title = 'Next Player' ;
          btnClazz = (this.state.xIsNext ? 'square btn btn-primary' : 'square btn btn-danger')
          buttonText = (this.state.xIsNext ? 'X' : 'O'); 
          margin ='80px';  
          btn = <button className = {btnClazz} style={{ borderRadius: '48px' }}> {buttonText} </button>     
        }
        
        let status = <div style={{ textAlign: 'center' }}>
        <div className="row justify-content-center" style={{ background: '#e3f2fd' }}><h3 >{title}</h3></div>
        <div className="row justify-content-center" style={{ marginTop: margin }}>{img}</div>
        <div className="row justify-content-center">{btn}</div>

    </div>
        return (
            <div className="game">
                <div className="row">
                    <div className="jumbotron jumbotron-fluid col-12">
                        <div className="container">
                            <h1 className="display-4">TicTacToe</h1>
                            <p className="lead">React tutorial</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="game-status col-4"  style={{ background: 'aliceblue' }} >
                        {status}
                    </div>
                    <div className="col-4" style={{ background: '#bce0ff' }} >
                    <div className="row justify-content-center" style={{ background: '#8bceff' }}><h3 >Board</h3></div>
                    <div className="row justify-content-center">
                        <div className="game-board">
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)}
                                mouseEnterFunc={(i) => this.handleSquareMouseEnter(i)}
                                mouseLeaveFunc={() => this.handleSquareMouseLeave()}
                                gameState={this.state}
                            />
                        </div>
                    </div>
                    </div>
                    <div className="game-info col-4"  style={{ background: 'aliceblue' }}>
                    <div className="row justify-content-center" style={{ background: '#e3f2fd' }}><h3 >Moves</h3></div>
                    <div className="row justify-content-center"> <ol>{moves}</ol></div>
                       
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateCoords(index) {
    let row = Math.floor(index / 3) + 1;
    let col = index % 3 + 1;

    return row + "," + col;
}
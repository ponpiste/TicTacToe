import React from 'react';
import './App.css';

const App = () => <Game />;

const Fill = {
   EMPTY: "",
   X: "X",
   O: "O",
};

Object.freeze(Fill);

const WIN = 1;
const DRAW = 0;
const LOSE = -1;
const RUNNING = -2;

class Game extends React.Component {

	constructor(props) {
		
		super(props)
		this.state = {
			current: RUNNING,
			board: [[Fill.EMPTY,Fill.EMPTY,Fill.EMPTY],
							[Fill.EMPTY,Fill.EMPTY,Fill.EMPTY],
							[Fill.EMPTY,Fill.EMPTY,Fill.EMPTY]]
		}

		this.onClick = this.onClick.bind(this);
		this.calcNext = this.calcNext.bind(this);
		this.minimax = this.minimax.bind(this);

		const ai = Math.random() < 0.5 ? true : false;

		if(ai) {
			const row = Math.floor(Math.random() * 3);
			const col = Math.floor(Math.random() * 3);
			this.state.board[row][col] = Fill.O;
		}
	}

	isWinner(board, player) {

		for(var i=0;i<3;i++) {

			if(board[i][0] === player 
				&& board[i][1] === player 
				&& board[i][2] === player){
				return true;
			}
			if(board[0][i] === player 
				&& board[1][i] === player 
				&& board[2][i] === player){
				return true;
			}
		}

		if (board[0][0] === player 
			&& board[1][1] === player 
			&& board[2][2] === player) {
			return true;
		}
		if (board[0][2] === player 
			&& board[1][1] === player 
			&& board[2][0] === player) {
			return true;
		}

		return false;
	}

	emptyCells(board) {

		var empty = 0;
		for(let i=0;i<3;i++){
			for(let j=0;j<3;j++){
				if(board[i][j] === Fill.EMPTY) {
					empty++;
				}
			}
		}
		return empty;
	}

	minimax(b, p) {

		const board = JSON.parse(JSON.stringify(b)); 
		const empty = this.emptyCells(board);

		if(this.isWinner(board, p)) {
			return {outcome: WIN};
		}

		const oponent = p => p === Fill.X ? Fill.O : Fill.X;
		if(this.isWinner(board, oponent(p))) {
			return {outcome: LOSE};
		}

		if(empty === 0) {
			return {outcome: DRAW};
		}

		const win = []
		const lose = []
		const draw = []

		for(let i=0;i<3;i++){
			for(let j=0;j<3;j++){
				if(board[i][j] === Fill.EMPTY) {

					board[i][j] = p;
					const ret = this.minimax(board, oponent(p));
					board[i][j] = Fill.EMPTY;

					if(ret.outcome === LOSE) win.push({i,j});
					else if(ret.outcome === WIN) lose.push({i,j});
					else draw.push({i,j});
				}
			}
		}

		if(win.length > 0) {
			return {outcome: WIN, move: win[0]};
		}
		if(draw.length > 0) {
			return {outcome: DRAW, move: draw[0]};
		}
		return {outcome: LOSE, move: lose[0]};
	}

	calcNext() {

		const board = this.state.board;
		const ret = this.minimax(board, Fill.O);
		console.log(ret);
		return ret.move;
	}

	onClick(i,j) {

		if(this.state.current !== RUNNING) {
			return;
		}

		const board = this.state.board;

		if(board[i][j] !== Fill.EMPTY) {
			return;
		}

		board[i][j] = Fill.X;
		if(this.isWinner(board, Fill.X)) {
			this.setState({board: board, current:LOSE});
			return;
		}
		if(this.emptyCells(board) === 0) {
			this.setState({board: board, current:DRAW});
			return;
		}

		var next = this.calcNext();

		board[next.i][next.j] = Fill.O;
		if(this.isWinner(board, Fill.O)) {
			this.setState({board: board, current:WIN});
			return;
		}
		if(this.emptyCells(board) === 0) {
			this.setState({board: board, current:DRAW});
			return;
		}

		this.setState({board: board});
	}

	render() {
		return (
			<div className = "game">
				<Title current = {this.state.current} />
				<Board onClick = {this.onClick} board = {this.state.board} />
			</div>
		);
	}
};

const Square = ({onClick, value}) => (

	<button className = "square" onClick = {onClick}>{Fill[value]}</button>
);

const Title = ({current}) => (

	<div className = "title">
		{current === WIN ? "You lost" 
		: current === LOSE ? "Your won" 
		: current === DRAW ? "Draw" : "Your turn"}
	</div>
);

const Board = ({board, onClick}) => {

	const squares = []
	for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
			squares.push(<Square key = {i*3+j} 
				value = {board[i][j]} onClick = {() => onClick(i,j)} />)
		}
	}

	return (
		<div className = "board">
			{squares}
		</div>
	);
};

export default App;

import React, { Component } from 'react'
import Board from '../Board/Board'
import './Gamescene.css'
import { observe } from '../Game'
import { pieceObserve } from '../Game'
import { getValidMoves } from '../Utilities/GetValidMoves'
import { getRequiredMoves } from '../Utilities/GetRequiredMoves'
import { setRequiredMoves } from '../Game'

class gamescene extends Component {
  constructor(props) {
    super(props)
    this.state = {
      black_knightA: { x: 1, y: 0 },
      black_knightB: { x: 6, y: 0 },
      black_bishopA: { x: 2, y: 0 },
      black_bishopB: { x: 5, y: 0 },
      black_rookA: { x: 0, y: 0 },
      black_rookB: { x: 7, y: 0 },
      black_queen: { x: 3, y: 0 },
      black_king: { x: 4, y: 0 },
      black_pawnA: { x: 0, y: 1, firstMove: true },
      black_pawnB: { x: 1, y: 1, firstMove: true },
      black_pawnC: { x: 2, y: 1, firstMove: true },
      black_pawnD: { x: 3, y: 1, firstMove: true },
      black_pawnE: { x: 4, y: 1, firstMove: true },
      black_pawnF: { x: 5, y: 1, firstMove: true },
      black_pawnG: { x: 6, y: 1, firstMove: true },
      black_pawnH: { x: 7, y: 1, firstMove: true },

      white_knightA: { x: 1, y: 7 },
      white_knightB: { x: 6, y: 7 },
      white_bishopA: { x: 2, y: 7 },
      white_bishopB: { x: 5, y: 7 },
      white_rookA: { x: 0, y: 7 },
      white_rookB: { x: 7, y: 7 },
      white_queen: { x: 3, y: 7 },
      white_king: { x: 4, y: 7 },
      white_pawnA: { x: 0, y: 6, firstMove: true },
      white_pawnB: { x: 1, y: 6, firstMove: true },
      white_pawnC: { x: 2, y: 6, firstMove: true },
      white_pawnD: { x: 3, y: 6, firstMove: true },
      white_pawnE: { x: 4, y: 6, firstMove: true },
      white_pawnF: { x: 5, y: 6, firstMove: true },
      white_pawnG: { x: 6, y: 6, firstMove: true },
      white_pawnH: { x: 7, y: 6, firstMove: true },
      validTiles: [],
      requiredMoves: [],

      whiteTurn: true,

      whiteWin: false,
      blackWin: false,

      selectedPiece: null
    }
    observe(this.handlePieceMove.bind(this))
    pieceObserve(this.handlePieceSelect.bind(this))
  }

  handlePieceMove (pieces, changesMade) {
    let blackWin = true
    let whiteWin = true
    for(var property in pieces) {
      if(pieces.hasOwnProperty(property)) {
        if(pieces[property].x !== -1) {
          if(property.substring(0,5) === "black") {
            blackWin = false
          } else {
            whiteWin = false
          }
        }
      }
    }

    if(blackWin || whiteWin) {
      this.setState({
        whiteWin: whiteWin,
        blackWin: blackWin,
      })
    }

    if(this.state && changesMade) {
      let requiredMoves = [];
      if(this.state.whiteTurn) {
        requiredMoves = getRequiredMoves(pieces, false);
      } else {
        requiredMoves = getRequiredMoves(pieces, true);
      }
      setRequiredMoves(requiredMoves);
      this.setState({
        validTiles: [],
        ...pieces,
        selectedPiece: null,
        requiredMoves: requiredMoves,
        whiteTurn: changesMade ? !this.state.whiteTurn : this.state.whiteTurn,
      })
    } else {
      this.setState({
        selectedPiece: null,
        validTiles: []
      })
    }
  }
  handlePieceSelect (piece) {
    let validTiles = getValidMoves(this.state, piece)
    if(Object.keys(this.state.requiredMoves).length > 0) {
      validTiles = [];
      if(Object.keys(this.state.requiredMoves).includes(piece)) {
        for(var move in this.state.requiredMoves[piece]) {
          validTiles.push(this.state.requiredMoves[piece][move]);
        }
      } else {
        validTiles = [];
      }
    }
    if(piece !== null && this.state.whiteTurn && piece.substring(0,5) === "white") {
      this.setState({
        validTiles: validTiles,
        selectedPiece: piece
      })
    } else if (piece !== null && !this.state.whiteTurn && piece.substring(0,5) === "black") {
      this.setState({
        validTiles: validTiles,
        selectedPiece: piece
      })
    }
  }

  render() {
    return (
      <div className="Gamescene">
        <h2>{this.state.blackWin ? "Black won!" : this.state.whiteWin ? "White won!" : this.state.whiteTurn ? "White's Turn" : "Black's Turn"}</h2>
        <Board state={this.state} selectedPiece={this.state.selectedPiece} validTiles={this.state.validTiles}/>
      </div>
    );
  }
}

export default gamescene;

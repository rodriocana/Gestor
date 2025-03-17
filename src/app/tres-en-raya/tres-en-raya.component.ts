import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tres-en-raya',
  imports: [CommonModule],
  templateUrl: './tres-en-raya.component.html',
  styleUrl: './tres-en-raya.component.scss'
})
export class TresEnRayaComponent {
  board: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  currentPlayer: string = 'X';
  winner: string | null = null;

  play(row: number, col: number): void {
    if (!this.board[row][col] && !this.winner) {
      this.board[row][col] = this.currentPlayer;

      setTimeout(() => {
        if (this.checkWinner()) {
          this.winner = this.currentPlayer;
        } else {
          this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
          if (this.currentPlayer === 'O') {
            setTimeout(() => this.cpuMove(), 500);
          }
        }
      }, 2300);
    }
  }

  cpuMove(): void {
    if (this.winner) return;
    let availableMoves: [number, number][] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.board[i][j]) availableMoves.push([i, j]);
      }
    }
    if (availableMoves.length > 0) {
      const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      this.board[row][col] = 'O';
      if (this.checkWinner()) {
        this.winner = 'O';
      } else {
        this.currentPlayer = 'X';
      }
    }
  }

  checkWinner(): boolean {
    const lines = [
      ...this.board,
      [this.board[0][0], this.board[1][0], this.board[2][0]],
      [this.board[0][1], this.board[1][1], this.board[2][1]],
      [this.board[0][2], this.board[1][2], this.board[2][2]],
      [this.board[0][0], this.board[1][1], this.board[2][2]],
      [this.board[0][2], this.board[1][1], this.board[2][0]]
    ];
    return lines.some(line => line.every(cell => cell === this.currentPlayer));
  }

  resetGame(): void {
    this.board = [['', '', ''], ['', '', ''], ['', '', '']];
    this.currentPlayer = 'X';
    this.winner = null;
  }
}

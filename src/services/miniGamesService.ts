// Mini Games Service - Handles game logic and AI for mini games

export class MiniGamesService {
  // Sudoku game logic - 6x6 grid with 2x3 subgrids (LinkedIn style)
  generateSudokuPuzzle(difficulty: 'easy' | 'medium' | 'hard'): number[][] {
    const cellsToRemove = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 18 : 24;
    const board = this.generateCompleteSudoku();
    return this.removeCells(board, cellsToRemove);
  }

  private generateCompleteSudoku(): number[][] {
    const board = Array(6).fill(null).map(() => Array(6).fill(0));
    this.fillSudoku(board);
    return board;
  }

  private fillSudoku(board: number[][]): boolean {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col] === 0) {
          const nums = this.shuffleArray([1, 2, 3, 4, 5, 6]);
          for (const num of nums) {
            if (this.isValidSudoku(board, row, col, num)) {
              board[row][col] = num;
              if (this.fillSudoku(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isValidSudoku(board: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let i = 0; i < 6; i++) {
      if (board[row][i] === num) return false;
    }
    // Check column
    for (let i = 0; i < 6; i++) {
      if (board[i][col] === num) return false;
    }
    // Check 2x3 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 2; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    return true;
  }

  private removeCells(board: number[][], count: number): number[][] {
    const puzzle = board.map(row => [...row]);
    let removed = 0;
    while (removed < count) {
      const row = Math.floor(Math.random() * 6);
      const col = Math.floor(Math.random() * 6);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }
    return puzzle;
  }

  // ZIP game - Quick number matching game
  generateZipGame(): { target: number; numbers: number[]; timeLimit: number } {
    const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
    const target = numbers[Math.floor(Math.random() * numbers.length)] + 
                   numbers[Math.floor(Math.random() * numbers.length)];
    return { target, numbers, timeLimit: 30 }; // 30 seconds
  }

  checkZipSolution(numbers: number[], indices: number[]): boolean {
    const sum = indices.reduce((acc, idx) => acc + numbers[idx], 0);
    return sum > 0; // Basic validation - user provides solution
  }



  // Utility functions
  private shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export const miniGamesService = new MiniGamesService();

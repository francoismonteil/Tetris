package fr.asser.tetris.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.asser.tetris.model.GameBoard;
import fr.asser.tetris.model.Tetromino;
import fr.asser.tetris.service.TetrisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TetrisController {

    @Autowired
    private TetrisService tetrisService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/gameState")
    @ResponseBody
    public String getGameState() {
        return serializeGameState();
    }

    @PostMapping("/moveDown")
    @ResponseBody
    public String moveDown() {
        tetrisService.moveTetrominoDown();
        return serializeGameState();
    }

    @PostMapping("/moveLeft")
    @ResponseBody
    public String moveLeft() {
        tetrisService.moveTetrominoLeft();
        return serializeGameState();
    }

    @PostMapping("/moveRight")
    @ResponseBody
    public String moveRight() {
        tetrisService.moveTetrominoRight();
        return serializeGameState();
    }

    @PostMapping("/rotate")
    @ResponseBody
    public String rotate() {
        tetrisService.rotateTetromino();
        return serializeGameState();
    }

    @PostMapping("/lock")
    @ResponseBody
    public String lock() {
        tetrisService.lockTetromino();
        tetrisService.clearLines();
        tetrisService.generateNewTetromino();
        return serializeGameState();
    }

    @PostMapping("/restart")
    @ResponseBody
    public String restart() {
        tetrisService.restartGame();
        return serializeGameState();
    }

    @PostMapping("/save")
    @ResponseBody
    public String saveGameState() {
        return serializeGameState();
    }

    @PostMapping("/load")
    @ResponseBody
    public String loadGameState(@RequestBody String savedState) {
        try {
            GameState gameState = objectMapper.readValue(savedState, GameState.class);
            tetrisService.setGameBoard(new GameBoard(gameState.gameBoard, gameState.score, gameState.level, gameState.linesCleared));
            tetrisService.setCurrentTetromino(gameState.currentTetromino);
            tetrisService.setNextTetromino(gameState.nextTetromino);
            tetrisService.setGameOver(gameState.gameOver);
            return serializeGameState();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }
    }

    private String serializeGameState() {
        try {
            return objectMapper.writeValueAsString(new GameState(
                    tetrisService.getGameBoard().getBoard(),
                    tetrisService.getCurrentTetromino(),
                    tetrisService.getNextTetromino(),
                    tetrisService.getGameBoard().getScore(),
                    tetrisService.getGameBoard().getLevel(),
                    tetrisService.getGameBoard().getLinesCleared(),
                    tetrisService.isGameOver()
            ));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }
    }

    private static class GameState {
        public int[][] gameBoard;
        public Tetromino currentTetromino;
        public Tetromino nextTetromino;
        public int score;
        public int level;
        public int linesCleared;
        public boolean gameOver;

        public GameState(int[][] gameBoard, Tetromino currentTetromino, Tetromino nextTetromino, int score, int level, int linesCleared, boolean gameOver) {
            this.gameBoard = gameBoard;
            this.currentTetromino = currentTetromino;
            this.nextTetromino = nextTetromino;
            this.score = score;
            this.level = level;
            this.linesCleared = linesCleared;
            this.gameOver = gameOver;
        }
    }
}

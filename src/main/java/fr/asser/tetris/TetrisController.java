// src/main/java/fr/asser/tetris/TetrisController.java
package fr.asser.tetris;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.asser.tetris.model.GameBoard;
import fr.asser.tetris.model.Tetromino;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TetrisController {

    @Autowired
    private TetrisService tetrisService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/gameState")
    @ResponseBody
    public String getGameState() throws JsonProcessingException {
        return getCurrentGameState();
    }

    @PostMapping("/moveDown")
    @ResponseBody
    public String moveDown() throws JsonProcessingException {
        tetrisService.moveTetrominoDown();
        return getCurrentGameState();
    }

    @PostMapping("/moveLeft")
    @ResponseBody
    public String moveLeft() throws JsonProcessingException {
        tetrisService.moveTetrominoLeft();
        return getCurrentGameState();
    }

    @PostMapping("/moveRight")
    @ResponseBody
    public String moveRight() throws JsonProcessingException {
        tetrisService.moveTetrominoRight();
        return getCurrentGameState();
    }

    @PostMapping("/rotate")
    @ResponseBody
    public String rotate() throws JsonProcessingException {
        tetrisService.rotateTetromino();
        return getCurrentGameState();
    }

    @PostMapping("/lock")
    @ResponseBody
    public String lock() throws JsonProcessingException {
        tetrisService.lockTetromino();
        tetrisService.clearLines();
        tetrisService.generateNewTetromino();
        return getCurrentGameState();
    }

    @PostMapping("/restart")
    @ResponseBody
    public String restart() throws JsonProcessingException {
        tetrisService.restartGame();
        return getCurrentGameState();
    }

    private String getCurrentGameState() throws JsonProcessingException {
        return objectMapper.writeValueAsString(new GameState(
                tetrisService.getGameBoard().getBoard(),
                tetrisService.getCurrentTetromino(),
                tetrisService.getGameBoard().getScore(),
                tetrisService.getGameBoard().getLevel(),
                tetrisService.isGameOver()
        ));
    }

    private static class GameState {
        public int[][] gameBoard;
        public Tetromino currentTetromino;
        public int score;
        public int level;
        public boolean gameOver;

        public GameState(int[][] gameBoard, Tetromino currentTetromino, int score, int level, boolean gameOver) {
            this.gameBoard = gameBoard;
            this.currentTetromino = currentTetromino;
            this.score = score;
            this.level = level;
            this.gameOver = gameOver;
        }
    }
}

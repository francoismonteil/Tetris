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

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/gameState")
    @ResponseBody
    public String getGameState() {
        return getCurrentGameState();
    }

    @PostMapping("/moveDown")
    @ResponseBody
    public String moveDown() {
        return handleGameAction(tetrisService::moveTetrominoDown);
    }

    @PostMapping("/moveLeft")
    @ResponseBody
    public String moveLeft() {
        return handleGameAction(tetrisService::moveTetrominoLeft);
    }

    @PostMapping("/moveRight")
    @ResponseBody
    public String moveRight() {
        return handleGameAction(tetrisService::moveTetrominoRight);
    }

    @PostMapping("/rotate")
    @ResponseBody
    public String rotate() {
        return handleGameAction(tetrisService::rotateTetromino);
    }

    @PostMapping("/lock")
    @ResponseBody
    public String lock() {
        return handleGameAction(() -> {
            tetrisService.lockTetromino();
            tetrisService.clearLines();
            tetrisService.generateNewTetromino();
        });
    }

    @PostMapping("/restart")
    @ResponseBody
    public String restart() {
        return handleGameAction(tetrisService::restartGame);
    }

    @PostMapping("/save")
    @ResponseBody
    public String saveGameState() {
        return getCurrentGameState();
    }

    @PostMapping("/load")
    @ResponseBody
    public String loadGameState(@RequestBody String savedState) {
        try {
            GameState gameState = objectMapper.readValue(savedState, GameState.class);
            tetrisService.setGameBoard(new GameBoard(gameState.gameBoard, gameState.score, gameState.level, gameState.linesCleared));
            tetrisService.setCurrentTetromino(gameState.currentTetromino);
            tetrisService.setNextTetromino(gameState.nextTetromino); // Ajout de la restauration du prochain tétrimino
            tetrisService.setGameOver(gameState.gameOver);
            return getCurrentGameState();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }
    }

    private String handleGameAction(Runnable gameAction) {
        gameAction.run();
        return getCurrentGameState();
    }

    private String getCurrentGameState() {
        try {
            return objectMapper.writeValueAsString(new GameState(
                    tetrisService.getGameBoard().getBoard(),
                    tetrisService.getCurrentTetromino(),
                    tetrisService.getNextTetromino(), // Ajout du prochain tétrimino
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
        public Tetromino nextTetromino; // Ajout du prochain tétrimino
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

package fr.asser.tetris.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.asser.tetris.service.TetrisService;
import fr.asser.tetris.service.TetrisService.GameState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/tetris")
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

    @PostMapping("/move")
    @ResponseBody
    public String move(@RequestParam String direction) {
        switch (direction) {
            case "down":
                tetrisService.moveTetrominoDown();
                break;
            case "left":
                tetrisService.moveTetrominoLeft();
                break;
            case "right":
                tetrisService.moveTetrominoRight();
                break;
            case "rotate":
                tetrisService.rotateTetromino();
                break;
            case "lock":
                tetrisService.lockTetromino();
                tetrisService.clearLines();
                tetrisService.generateNewTetromino();
                break;
        }
        return serializeGameState();
    }

    @PostMapping("/restart")
    @ResponseBody
    public String restart() {
        tetrisService.restartGame();
        return serializeGameState();
    }

    @PostMapping("/load")
    @ResponseBody
    public String loadGameState(@RequestBody String savedState) {
        try {
            GameState gameState = objectMapper.readValue(savedState, GameState.class);
            tetrisService.loadGameState(gameState);
            return serializeGameState();
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }
    }

    private String serializeGameState() {
        try {
            return objectMapper.writeValueAsString(tetrisService.getCurrentGameState());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing JSON", e);
        }
    }
}

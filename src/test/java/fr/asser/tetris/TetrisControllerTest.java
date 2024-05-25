// src/test/java/fr/asser/tetris/TetrisControllerTest.java
package fr.asser.tetris;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.asser.tetris.controller.TetrisController;
import fr.asser.tetris.model.GameBoard;
import fr.asser.tetris.model.Tetromino;
import fr.asser.tetris.service.TetrisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TetrisController.class)
public class TetrisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TetrisService tetrisService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetGameState() throws Exception {
        GameBoard gameBoard = new GameBoard();
        Tetromino tetromino = new Tetromino();
        when(tetrisService.getGameBoard()).thenReturn(gameBoard);
        when(tetrisService.getCurrentTetromino()).thenReturn(tetromino);
        when(tetrisService.isGameOver()).thenReturn(false);

        mockMvc.perform(get("/gameState"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameBoard").exists())
                .andExpect(jsonPath("$.currentTetromino").exists())
                .andExpect(jsonPath("$.score").exists())
                .andExpect(jsonPath("$.level").exists())
                .andExpect(jsonPath("$.gameOver").value(false));
    }

    @Test
    public void testMoveDown() throws Exception {
        GameBoard gameBoard = new GameBoard();
        Tetromino tetromino = new Tetromino();
        when(tetrisService.getGameBoard()).thenReturn(gameBoard);
        when(tetrisService.getCurrentTetromino()).thenReturn(tetromino);

        mockMvc.perform(post("/moveDown")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameBoard").exists())
                .andExpect(jsonPath("$.currentTetromino").exists())
                .andExpect(jsonPath("$.score").exists())
                .andExpect(jsonPath("$.level").exists())
                .andExpect(jsonPath("$.gameOver").exists());
    }

    @Test
    public void testMoveLeft() throws Exception {
        GameBoard gameBoard = new GameBoard();
        Tetromino tetromino = new Tetromino();
        when(tetrisService.getGameBoard()).thenReturn(gameBoard);
        when(tetrisService.getCurrentTetromino()).thenReturn(tetromino);

        mockMvc.perform(post("/moveLeft")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameBoard").exists())
                .andExpect(jsonPath("$.currentTetromino").exists())
                .andExpect(jsonPath("$.score").exists())
                .andExpect(jsonPath("$.level").exists())
                .andExpect(jsonPath("$.gameOver").exists());
    }

    @Test
    public void testMoveRight() throws Exception {
        GameBoard gameBoard = new GameBoard();
        Tetromino tetromino = new Tetromino();
        when(tetrisService.getGameBoard()).thenReturn(gameBoard);
        when(tetrisService.getCurrentTetromino()).thenReturn(tetromino);

        mockMvc.perform(post("/moveRight")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameBoard").exists())
                .andExpect(jsonPath("$.currentTetromino").exists())
                .andExpect(jsonPath("$.score").exists())
                .andExpect(jsonPath("$.level").exists())
                .andExpect(jsonPath("$.gameOver").exists());
    }

    @Test
    public void testRotate() throws Exception {
        GameBoard gameBoard = new GameBoard();
        Tetromino tetromino = new Tetromino();
        when(tetrisService.getGameBoard()).thenReturn(gameBoard);
        when(tetrisService.getCurrentTetromino()).thenReturn(tetromino);

        mockMvc.perform(post("/rotate")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameBoard").exists())
                .andExpect(jsonPath("$.currentTetromino").exists())
                .andExpect(jsonPath("$.score").exists())
                .andExpect(jsonPath("$.level").exists())
                .andExpect(jsonPath("$.gameOver").exists());
    }

    @Test
    public void testRestart() throws Exception {
        GameBoard gameBoard = new GameBoard();
        Tetromino tetromino = new Tetromino();
        when(tetrisService.getGameBoard()).thenReturn(gameBoard);
        when(tetrisService.getCurrentTetromino()).thenReturn(tetromino);

        mockMvc.perform(post("/restart")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameBoard").exists())
                .andExpect(jsonPath("$.currentTetromino").exists())
                .andExpect(jsonPath("$.score").exists())
                .andExpect(jsonPath("$.level").exists())
                .andExpect(jsonPath("$.gameOver").exists());
    }
}

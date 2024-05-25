// src/test/java/fr/asser/tetris/TetrisServiceTest.java
package fr.asser.tetris;

import fr.asser.tetris.model.Tetromino;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TetrisServiceTest {

    private TetrisService tetrisService;

    @BeforeEach
    void setUp() {
        tetrisService = new TetrisService();
    }

    @Test
    void testMoveTetrominoDown() {
        Tetromino tetromino = tetrisService.getCurrentTetromino();
        int initialY = tetromino.getY();
        tetrisService.moveTetrominoDown();
        assertEquals(initialY + 1, tetromino.getY());
    }

    @Test
    void testMoveTetrominoLeft() {
        Tetromino tetromino = tetrisService.getCurrentTetromino();
        int initialX = tetromino.getX();
        tetrisService.moveTetrominoLeft();
        assertEquals(initialX - 1, tetromino.getX());
    }

    @Test
    void testMoveTetrominoRight() {
        Tetromino tetromino = tetrisService.getCurrentTetromino();
        int initialX = tetromino.getX();
        tetrisService.moveTetrominoRight();
        assertEquals(initialX + 1, tetromino.getX());
    }

    @Test
    void testRotateTetromino() {
        Tetromino tetromino = tetrisService.getCurrentTetromino();
        int[][] initialShape = tetromino.getShape();
        tetrisService.rotateTetromino();
        assertNotEquals(initialShape, tetromino.getShape());
    }
}

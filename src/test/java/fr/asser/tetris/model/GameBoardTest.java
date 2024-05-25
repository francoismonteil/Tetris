// src/test/java/fr/asser/tetris/GameBoardTest.java
package fr.asser.tetris.model;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GameBoardTest {

    private GameBoard gameBoard;

    @BeforeEach
    void setUp() {
        gameBoard = new GameBoard();
    }

    @Test
    void testClearLines() {
        // Remplir une ligne complète
        for (int i = 0; i < gameBoard.getBoard()[0].length; i++) {
            gameBoard.getBoard()[19][i] = 1;
        }
        gameBoard.clearLines();
        // Vérifier que la ligne a été effacée
        for (int i = 0; i < gameBoard.getBoard()[0].length; i++) {
            assertEquals(0, gameBoard.getBoard()[19][i]);
        }
    }

    @Test
    void testCanPlaceTetromino() {
        Tetromino tetromino = new Tetromino();
        assertTrue(gameBoard.canPlaceTetromino(tetromino));
        // Placer un tetromino au bord du plateau
        tetromino.setX(-1);
        assertFalse(gameBoard.canPlaceTetromino(tetromino));
    }
}

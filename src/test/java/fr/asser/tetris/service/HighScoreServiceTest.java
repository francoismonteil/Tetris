package fr.asser.tetris.service;

import fr.asser.tetris.model.HighScore;
import fr.asser.tetris.repository.HighScoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class HighScoreServiceTest {

    @Mock
    private HighScoreRepository highScoreRepository;

    @InjectMocks
    private HighScoreService highScoreService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetHighScores() {
        HighScore highScore1 = new HighScore("Player1", 100);
        HighScore highScore2 = new HighScore("Player2", 200);
        List<HighScore> highScores = Arrays.asList(highScore1, highScore2);

        when(highScoreRepository.findAll()).thenReturn(highScores);

        List<HighScore> result = highScoreService.getHighScores();
        assertEquals(2, result.size());
        assertEquals("Player1", result.get(0).getName());
        assertEquals(200, result.get(1).getScore());
    }

    @Test
    public void testAddHighScore() {
        HighScore highScore = new HighScore("Player", 300);

        highScoreService.addHighScore(highScore);

        verify(highScoreRepository, times(1)).save(highScore);
    }
}

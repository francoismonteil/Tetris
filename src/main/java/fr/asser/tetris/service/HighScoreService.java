package fr.asser.tetris.service;

import fr.asser.tetris.model.HighScore;
import fr.asser.tetris.repository.HighScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HighScoreService {

    @Autowired
    private HighScoreRepository highScoreRepository;

    public List<HighScore> getHighScores() {
        return highScoreRepository.findAll();
    }

    public void addHighScore(HighScore highScore) {
        highScoreRepository.save(highScore);
    }
}

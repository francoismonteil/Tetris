package fr.asser.tetris.controller;

import fr.asser.tetris.model.HighScore;
import fr.asser.tetris.service.HighScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class HighScoreController {

    @Autowired
    private HighScoreService highScoreService;

    @GetMapping("/highScores")
    @ResponseBody
    public List<HighScore> getHighScores() {
        return highScoreService.getHighScores();
    }

    @PostMapping("/submitScore")
    @ResponseBody
    public void submitScore(@RequestBody HighScore highScore) {
        highScoreService.addHighScore(highScore);
    }

    @GetMapping("/scores")
    public String scores() {
        return "scores";
    }
}

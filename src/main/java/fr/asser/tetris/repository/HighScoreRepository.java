package fr.asser.tetris.repository;

import fr.asser.tetris.model.HighScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HighScoreRepository extends JpaRepository<HighScore, Long> {
}

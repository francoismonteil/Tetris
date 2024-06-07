# Spring Tetris Game

## Description

Ce projet est une implémentation du jeu Tetris utilisant Java pour le backend avec Spring Boot et JavaScript pour le frontend. Le jeu permet aux utilisateurs de jouer à Tetris, de mettre le jeu en pause, de sauvegarder leur progression et de charger une partie sauvegardée. Le niveau de difficulté augmente à mesure que le joueur progresse, augmentant la vitesse de chute des pièces et les points gagnés.

## Fonctionnalités

- Déplacement des tétriminos (gauche, droite, bas, rotation).
- Pause et reprise du jeu.
- Sauvegarde et chargement de l'état du jeu.
- Augmentation de la vitesse des pièces en fonction du niveau.
- Augmentation du niveau tous les 100 points.
- Affichage des scores et du niveau actuel.
- Gestion du son (mute et unmute de la musique de fond).

## Prérequis

- Java 11 ou supérieur
- Maven
- Node.js et npm

## Installation

1. Clonez le dépôt:
    ```sh
    git clone https://github.com/votre-utilisateur/tetris-game.git
    cd tetris-game
    ```

2. Construisez le backend:
    ```sh
    mvn clean install
    ```

3. Installez les dépendances frontend:
    ```sh
    cd src/main/resources/static
    npm install
    ```

## Exécution

1. Démarrez le backend:
    ```sh
    mvn spring-boot:run
    ```

2. Ouvrez votre navigateur et accédez à:
    ```
    http://localhost:8080
    ```

## Utilisation

- **Démarrer le jeu**: Cliquez sur le bouton "Start Game".
- **Déplacer les tétriminos**:
    - Flèche gauche : déplacer à gauche
    - Flèche droite : déplacer à droite
    - Flèche bas : descendre
    - Flèche haut : rotation
- **Pause/Reprise du jeu**: Appuyez sur la touche 'P' ou cliquez sur le bouton "Pause".
- **Sauvegarder le jeu**: Appuyez sur la touche 'S'.
- **Charger le jeu**: Appuyez sur la touche 'L'.
- **Redémarrer le jeu**: Cliquez sur le bouton "Restart" après la fin du jeu.
- **Mute/Unmute la musique**: Cliquez sur le bouton "Mute Music".

## Structure du projet

```
tetris-game
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── fr
│   │   │       └── asser
│   │   │           ├── controller
│   │   │           │   └── TetrisController.java
│   │   │           ├── service
│   │   │           │   └── TetrisService.java
│   │   │           └── model
│   │   │               ├── GameBoard.java
│   │   │               └── Tetromino.java
│   │   └── resources
│   │       ├── static
│   │       │   ├── css
│   │       │   │   └── style.css
│   │       │   ├── js
│   │       │   │   ├── controls.js
│   │       │   │   ├── gameState.js
│   │       │   │   ├── main.js
│   │       │   │   └── renderer.js
│   │       │   └── sounds
│   │       │       ├── background.mp3
│   │       │       ├── line-clear.mp3
│   │       │       ├── move.mp3
│   │       │       └── rotate.mp3
│   │       └── templates
│   │           └── index.html
│   └── test
│       └── java
│           └── fr
│               └── asser
│                   └── tetris
│                       └── TetrisApplicationTests.java
└── pom.xml
```

## Contribuer

Les contributions sont les bienvenues ! Veuillez soumettre une issue ou un pull request sur GitHub.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Ce README devrait fournir une bonne base pour comprendre, installer, et utiliser votre projet Tetris. N'hésitez pas à le personnaliser en fonction des besoins spécifiques de votre projet.

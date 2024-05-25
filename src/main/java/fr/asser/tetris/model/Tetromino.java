// src/main/java/fr/asser/tetris/model/Tetromino.java
package fr.asser.tetris.model;

public class Tetromino {
    private int[][] shape;
    private int x;
    private int y;
    private String type;
    private int rotationIndex;

    private static final String[] TYPES = {"I", "J", "L", "O", "S", "T", "Z"};
    private static final int[][][] SHAPES = {{{1, 1, 1, 1}, {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}}, {{1, 0, 0}, {1, 1, 1}, {0, 0, 0}}, {{0, 0, 1}, {1, 1, 1}, {0, 0, 0}}, {{1, 1}, {1, 1}}, {{0, 1, 1}, {1, 1, 0}, {0, 0, 0}}, {{0, 1, 0}, {1, 1, 1}, {0, 0, 0}}, {{1, 1, 0}, {0, 1, 1}, {0, 0, 0}}};

    public Tetromino() {
        this.rotationIndex = 0;
        int typeIndex = (int) (Math.random() * SHAPES.length);
        this.shape = SHAPES[typeIndex];
        this.type = TYPES[typeIndex];
        this.x = 3;
        this.y = 0;
    }

    public int[][] getShape() {
        return shape;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public String getType() {
        return type;
    }

    public void rotate() {
        int n = shape.length;
        int[][] rotatedShape = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotatedShape[j][n - 1 - i] = shape[i][j];
            }
        }
        shape = rotatedShape;
    }

    public void rotateBack() {
        int n = shape.length;
        int[][] rotatedShape = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotatedShape[i][j] = shape[j][n - 1 - i];
            }
        }
        shape = rotatedShape;
    }
}

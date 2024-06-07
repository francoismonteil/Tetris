package fr.asser.tetris.model;

public class Tetromino {
    private int[][] shape;
    private int x;
    private int y;
    private String type;

    private static final String[] TYPES = {"I", "J", "L", "O", "S", "T", "Z"};
    private static final int[][][] SHAPES = {
            {{1, 1, 1, 1}},
            {{1, 0, 0}, {1, 1, 1}},
            {{0, 0, 1}, {1, 1, 1}},
            {{1, 1}, {1, 1}},
            {{0, 1, 1}, {1, 1, 0}},
            {{0, 1, 0}, {1, 1, 1}},
            {{1, 1, 0}, {0, 1, 1}}
    };

    public Tetromino() {
        int typeIndex = (int) (Math.random() * SHAPES.length);
        this.shape = SHAPES[typeIndex];
        this.type = TYPES[typeIndex];
        this.x = 3;
        this.y = 0;
    }

    public int[][] getShape() {
        return shape;
    }

    public void setShape(int[][] shape) {
        this.shape = shape;
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

    public void setType(String type) {
        this.type = type;
    }

    public void rotate() {
        shape = rotateMatrix(shape);
    }

    public void rotateBack() {
        shape = rotateMatrixCounterClockwise(shape);
    }

    private int[][] rotateMatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        int[][] rotatedMatrix = new int[n][m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                rotatedMatrix[j][m - 1 - i] = matrix[i][j];
            }
        }
        return rotatedMatrix;
    }

    private int[][] rotateMatrixCounterClockwise(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        int[][] rotatedMatrix = new int[n][m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                rotatedMatrix[n - 1 - j][i] = matrix[i][j];
            }
        }
        return rotatedMatrix;
    }
}

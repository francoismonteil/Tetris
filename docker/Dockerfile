# Utiliser une image de base Maven pour construire l'application
FROM maven:3.8.1-openjdk-17 AS build

# Définir le répertoire de travail
WORKDIR /home/app

# Copier les fichiers de l'application dans le conteneur
COPY ../pom.xml .
COPY ../src ./src

# Construire l'application avec des options de débogage
RUN mvn -e -X -Dfile.encoding=UTF-8 clean package

# Utiliser une image de base Java pour exécuter l'application
FROM openjdk:17-jdk-slim

# Copier le jar de l'application du conteneur de construction
COPY --from=build /home/app/target/Tetris-1.0-SNAPSHOT.jar /usr/local/lib/app.jar

# Exposer le port de l'application
EXPOSE 8080

# Commande pour lancer l'application
ENTRYPOINT ["java", "-jar", "/usr/local/lib/app.jar"]

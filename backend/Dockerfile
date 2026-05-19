# Stage 1: Build the application
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (caches them for faster rebuilds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the minimal runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Render uses the PORT environment variable, defaults to 8080)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy Maven multi-module project structure
COPY pom.xml .
COPY libs ./libs
COPY services ./services

# Build only the gl-service module (and any required dependencies)
RUN mvn clean package -pl services/gl-service -am -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/services/gl-service/target/*.jar app.jar

# Expose GL service port
EXPOSE 8082

# Run the service
ENTRYPOINT ["java", "-jar", "app.jar"]

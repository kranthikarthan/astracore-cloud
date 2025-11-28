# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY libs ./libs
COPY services/pom.xml ./services/pom.xml
COPY services/billing-service ./services/billing-service
# Build dependencies first to cache them (optimistic approach, might need more granular copies for true caching)
# For now, just build the specific module
RUN mvn clean package -pl services/billing-service -am -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/services/billing-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

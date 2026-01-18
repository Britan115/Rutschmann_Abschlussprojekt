# ============================================================================
# Dockerfile für Backend (Spring Boot)
# ============================================================================
# Multi-Stage Build für optimierte Image-Grösse
# ============================================================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Kopiere POM und Dependencies (für Caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kopiere Source-Code und baue
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Erstelle non-root User für Sicherheit
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Kopiere JAR aus Build-Stage
COPY --from=build /app/target/*.jar app.jar

# Exponiere Port
EXPOSE 8080

# Healthcheck
# Prüft ob die Anwendung läuft (ohne Actuator)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/criteria || exit 1

# Starte Anwendung
ENTRYPOINT ["java", "-jar", "app.jar"]

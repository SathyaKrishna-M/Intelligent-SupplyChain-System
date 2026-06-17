FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Create a writable directory for persistent data
RUN mkdir -p /app/persistent_data

# Set the STORAGE_PATH environment variable to point to the persistent data folder
ENV STORAGE_PATH=/app/persistent_data/

# Copy the source code
COPY src/ /app/src/

# Compile the Java application
RUN mkdir -p bin && \
    javac -d bin $(find src -name "*.java")

# Expose the default port (Render dynamically sets PORT, but exposing 8081 is standard locally)
EXPOSE 8081

# Run the application
CMD ["java", "-cp", "bin", "Main"]

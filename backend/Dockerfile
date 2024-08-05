# Use the OpenJDK 21 image as the base image
FROM openjdk:21-jdk

# Set the working directory in the container
WORKDIR /opt

# Set environment variable for the port
ENV PORT 8080

# Expose the port your application will run on
EXPOSE 8080

# Copy the application JAR file to the container
COPY target/*.jar /opt/app.jar

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/opt/app.jar"]

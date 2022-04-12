FROM adoptopenjdk/openjdk11:alpine-jre

MAINTAINER An BQ <buiquang.a92@gmail.com>

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]

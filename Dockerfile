# Use the official PostgreSQL image from the Docker Hub
FROM postgres:16

# Add the init.sql script to the Docker image
COPY init.sql /docker-entrypoint-initdb.d/

ARG POSTGRES_DB
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD

ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

# To build and run this container run the following commands

# docker build -t enpal-coding-challenge-db .
# docker run --name enpal-coding-challenge-db -p 5432:5432 -d enpal-coding-challenge-db

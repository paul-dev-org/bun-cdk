FROM --platform=linux/amd64 ubuntu:24.04
COPY ../apps/auth-service/auth-service .
RUN chmod +x auth-service
CMD ["./auth-service"]

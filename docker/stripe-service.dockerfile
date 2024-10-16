# MINIMAL LINUX IMAGE
FROM --platform=linux/amd64 ubuntu:24.04
COPY ../apps/stripe-service/stripe-service .
RUN chmod +x stripe-service
CMD ["./stripe-service"]

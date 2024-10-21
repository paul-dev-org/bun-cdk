FROM --platform=linux/amd64 ubuntu:24.04
COPY ./dist/stripe-service .
RUN chmod +x stripe-service
CMD ["./stripe-service"]

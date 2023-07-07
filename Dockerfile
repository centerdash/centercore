FROM rust:alpine as builder
WORKDIR /usr/src/centercore

RUN apk add pkgconfig openssl-dev libc-dev

COPY . .
RUN cargo build --release

FROM alpine:latest
WORKDIR /root

RUN apk update && apk --no-cache add openssl ca-certificates

COPY --from=builder /usr/src/centercore/target/release/centercore ./

CMD ["./centercore"]
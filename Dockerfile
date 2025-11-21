FROM node:22-bookworm

RUN curl -fsSL https://bun.sh/install | bash

COPY . /app
WORKDIR /app

RUN ~/.bun/bin/bun install

ENV RUNTIME="bun"
EXPOSE 3000

CMD ["sh", "-c", "if [ \"$RUNTIME\" = \"node\" ]; then node ./index.js; else ~/.bun/bin/bun ./index.js; fi"]

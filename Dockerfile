FROM gcr.io/feisty-return-300415/pumba-ubi-minimal-node14:latest

WORKDIR /software/
RUN mkdir ./pkgs4test
COPY . .
RUN npm i

CMD [ "node", "index.js" ]
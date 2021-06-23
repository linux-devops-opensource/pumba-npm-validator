FROM gcr.io/sodium-inverter-285420/pumba-ubi-minimal-node14:latest

WORKDIR /software/
RUN mkdir ./pkgs4test
COPY . .
RUN npm i

CMD [ "node", "index.js" ]
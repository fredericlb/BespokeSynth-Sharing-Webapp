FROM node:16

ADD . /app
RUN cd /app && sh build.sh

WORKDIR /app/bespoke-patches-server
EXPOSE 8000
CMD ["npm", "start"]

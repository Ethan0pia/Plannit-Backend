FROM node:lts
WORKDIR /app

COPY package.json /app
ENV HTTP_PROXY "http://proxy.tcs.com:8080"
ENV HTTPS_PROXY "http://proxy.tcs.com:8080"
RUN npm i

COPY . .

CMD if [ -z "$_TEST_FLAG" ] ; then npm start ; else npm test ; fi
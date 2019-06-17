FROM node

ARG APP_ID
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG SIGNING_SECRET
ARG VERIFICATION_TOKEN
ARG INCOMING_WEB_HOOK_URL
ARG PORT

ENV APP_ID=${APP_ID}
ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}
ENV SIGNING_SECRET=${SIGNING_SECRET}
ENV VERIFICATION_TOKEN=${VERIFICATION_TOKEN}
ENV INCOMING_WEB_HOOK_URL=${INCOMING_WEB_HOOK_URL}
ENV PORT=${PORT}

WORKDIR /
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}
CMD ["npm", "start"]
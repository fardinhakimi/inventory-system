FROM node:current-alpine AS DEV

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# STAGE 2 BUILDER
FROM dev AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=dev /app ./
RUN npm run build

# FINAL STAGE COPY REQUIRED FILES AND FOLDERS FROM BUILDER TO PROD AND RUN THE APP
FROM node:current-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public

RUN npm install next

EXPOSE 3000

CMD npm run start
# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm run build

COPY --from=build /usr/src/app/dist ./dist

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["node", "dist/main.js"]

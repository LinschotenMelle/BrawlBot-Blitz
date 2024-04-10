FROM node:latest

# Create the bot's directory
RUN mkdir -p /home/mspcnl700/projects/BrawlBotBlitz/src
WORKDIR /home/mspcnl700/projects/BrawlBotBlitz/src

COPY package.json /home/mspcnl700/projects/BrawlBotBlitz/src

RUN npm install

COPY . /home/mspcnl700/projects/BrawlBotBlitz/src

# Start the bot.
CMD ["node", "index.ts"]
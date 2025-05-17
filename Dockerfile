# Dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Ensure the wait-for-it script is executable
RUN chmod +x wait-for-it.sh

EXPOSE 4001

CMD ["npm", "start"]


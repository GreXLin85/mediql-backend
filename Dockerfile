# add the Node.js docker image
FROM node:16

# Create directory that runs the app on docker
WORKDIR /app

# COPY package.json and yarn.lock files
COPY package.json yarn.lock ./
COPY package*.json ./

# COPY
COPY ./src/ ./

# COPY ENV variable
COPY ./src/.env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# Install package.json dependencies
RUN yarn install --production
RUN yarn cache clean

# COPY
COPY . .

ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mediqldb\?schema=public

# Generate prisma client
RUN npx prisma generate

# Run and expose the server on port 3000
EXPOSE 4000

# A command to start the server
CMD [ "npm", "run", "migrate:start" ]
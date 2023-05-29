FROM node:18-alpine as builder

ARG NEXT_PUBLIC_FIREBASE_CONFIG
ARG FIREBASE_ADMIN_CONFIG
ARG NEXTAUTH_SECRET
ARG OPENAI_API_KEY

ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_FIREBASE_CONFIG=$NEXT_PUBLIC_FIREBASE_CONFIG
ENV FIREBASE_ADMIN_CONFIG=$FIREBASE_ADMIN_CONFIG
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN apk add --no-cache python3 py3-pip
RUN apk update && apk add make g++ && rm -rf /var/cache/apk/*

WORKDIR /app/

COPY . .
RUN yarn
RUN yarn build

FROM node:18-alpine

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

WORKDIR /app/
# copy from build image
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["yarn", "start"]
FROM node:20-alpine AS builder

WORKDIR /app

# Install Python and build dependencies required for node-gyp
# Add eudev-dev which provides libudev.h
RUN apk add --no-cache python3 make g++ git linux-headers eudev-dev

# Skip building optional USB dependencies
ENV SKIP_USB_BUILD=1
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV LIBUSB_SKIP=1

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with flags to avoid native module issues
RUN npm ci --no-optional --ignore-scripts

# Copy all other files
COPY . .

# Build the Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy built files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
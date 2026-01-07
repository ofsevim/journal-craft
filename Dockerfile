# Use Node.js with Debian for LaTeX support
FROM node:20-bookworm-slim

# Install TeX Live with XeLaTeX and required packages
# Latin Modern fonts are included in lmodern package
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    texlive-lang-european \
    texlive-science \
    lmodern \
    fontconfig \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -fv

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY server/package*.json ./

# Install all dependencies (including dev for tsx)
RUN npm ci

# Copy server source files
COPY server/*.ts ./

# Copy the LaTeX class file
COPY scd.cls ./

# Create img directory (in case images are needed)
RUN mkdir -p img

# Expose port (Hugging Face uses 7860)
EXPOSE 7860

# Set environment variable
ENV PORT=7860
ENV NODE_ENV=production

# Start the server
CMD ["npx", "tsx", "index.ts"]

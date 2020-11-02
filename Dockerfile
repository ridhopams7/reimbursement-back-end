FROM reimbursement/alpine:nodejs-8.9.3-puppeteer

WORKDIR /usr/src/app

COPY package.json* /usr/src/app/

RUN npm install -g npm \
    && npm install \
    && mkdir -p /.pm2 \
    && mkdir -p /.pki/nssdb \
    && chown -R root:root /.pm2 \
    && chown -R root:root /.pki/nssdb \
    && chmod -R 775 /.pm2 \
    && chmod -R 775 /.pki/nssdb

COPY . .

CMD ["sh", "-c", "npm run build:${NODE_ENV}"]

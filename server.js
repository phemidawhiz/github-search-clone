/* eslint-disable @typescript-eslint/no-var-requires,no-console */
require('dotenv').config();

const express = require('express');
const next = require('next');
const { join } = require('path');
const { parse } = require('url');
const compression = require('compression');
const cors = require('cors');
const request = require('request');
const fs = require('fs');
const UglifyJS = require('uglify-js');
const helmet = require('helmet');
const expectCt = require('expect-ct');

const isDev = process.env.NODE_ENV !== 'production';
const devBuildMode = isDev;

console.log('************************************');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log('************************************');

const port = parseInt(process.env.APP_PORT, 10) || 80;
const app = next({ dev: devBuildMode });

const handler = app.getRequestHandler(app);

const validUrl = (req, res, nxt) => {
    if (!req.query.url) {
        nxt(new Error('No url specified'));
    } else if (typeof req.query.url !== 'string' || parse(req.query.url).host === null) {
        nxt(new Error(`Invalid url specified: ${req.query.url}`));
    } else {
        nxt();
    }
};

app
    .prepare()
    .then(() => {
        const server = express();
        server.use(helmet());
        server.use(helmet.contentSecurityPolicy({
            directives: {
              childSrc: ["blob: *"],
              defaultSrc: ["'self'",'data:',"http://localhost:*", "*.github.com"],
                // TODO: Replace all inline styles with class based styles and revert this rule to self only
                styleSrc: [
                    "'self'",
                    'data:',
                    "'unsafe-inline'",
                    'fonts.googleapis.com',
                    'paystack.com',
                    'cdn.jsdelivr.net',
                    'tagmanager.google.com',
                    'assets.calendly.com'
                ],
                scriptSrc: [
                    "'self'",
                    'https:',
                    "blob: *",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "'unsafe-inline'",
                    'connect.facebook.net',
                    'snap.licdn.com',
                    'js.paystack.co',
                    '*.tawk.to',
                    'cdn.jsdelivr.net',
                    'cdnjs.cloudflare.com',
                    '*.google-analytics.com',
                    '*.googletagmanager.com',
                    '*.googleapis.com',
                    'tagmanager.google.com',
                    'assets.calendly.com',

                ],
                fontSrc: [
                    "'self'",
                    'data:',
                    'fonts.gstatic.com'
                ],
                imgSrc: [
                    "'self'",
                    'data:',
                    '*.verifyme.ng',
                    'p.adsymptotic.com',
                    'www.facebook.com',
                    'px.ads.linkedin.com',
                    'play.google.com',
                    '*.amazonaws.com',
                    'linkedin.com',
                    'res.cloudinary.com',
                    '*.google-analytics.com',
                    'https://ssl.gstatic.com',
                    'https://www.gstatic.com',
                    '*.googleusercontent.com',
                    '*.doubleclick.net',
                    'https://images.verifyme.ng',
                    'https://www.pngkey.com/',
                    'avatars.githubusercontent.com',
                    '*.github.com'
                ],
                connectSrc: [
                    "'self'",
                    '*.tawk.to',
                    '*.verifyme.ng',
                    'verifyme.us19.list-manage.com',
                    'https://www.google-analytics.com',
                    'https://stats.g.doubleclick.net/',
                    'https://tagmanager.google.com/debug',
                    "http://localhost:*",
                    "https://9uj0ihoex6.execute-api.eu-west-1.amazonaws.com/dev/auth",
                    "https://api.github.com/graphql"
                ],
                frameSrc: [
                    "'self'",
                    '*.google.com',
                    'github.com',
                    '*.github.com'
                ]
            }
        }))
        server.use(expectCt({
            enforce: true,
            maxAge: 31536000
        }));
        server.use(helmet.xssFilter())
        server.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
        server.disable('x-powered-by');
        server.set('trust proxy', 'loopback');
        server.use(compression());

        // Basic auth protection for staging environments.
        const enableBasicAuth = !!parseInt(process.env.BASIC_AUTH_ENABLED, 10);

        server.use((req, res, nxt) => {
            //TODO Remove this block once we start using heml chart in production
            if (req.path === '/health-status') {
                return res.send('Health status OK');
            }

            if (req.path === '/health') {
                return res.send('Health status OK');
            }

            return nxt();
        });

        /*
            html2pdf hits this proxy and converts images that are not on the same orgin to base64 in order for it to be displayed on the reports.
            see https://github.com/niklasvh/html2canvas-proxy-nodejs/blob/master/server.js
        */
        server.get('/pdf-proxy', cors(), validUrl, (req, res, nxt) => {
            switch (req.query.responseType) {
                case 'blob':
                    req.headers.authorization = ''; // to avoid authorization cached on users browser
                    req.pipe(request(req.query.url).on('error', nxt)).pipe(res);
                    break;
                case 'text':
                default:
                    request({ encoding: 'binary', url: req.query.url }, (error, response, body) => {
                        if (error) {
                            return nxt(error);
                        }
                        res.send(
                            `data:${response.headers['content-type']};base64,${Buffer.from(body, 'binary').toString('base64')}`,
                        );

                        return request;
                    });
            }
        });

        server.all('*', (req, res) => {
            const parsedUrl = parse(req.url, true);
            const { pathname } = parsedUrl;

            // handle GET request to /service-worker.js
            if (pathname === '/service-worker.js') {
                // Ensure this matches the distDir value in next.config.js
                const distDir = '.next';

                const filePath = join(__dirname, distDir, pathname);

                app.serveStatic(req, res, filePath);
            } else if (pathname === '/v1/inline.js') {
              const host = req.get('host');
              const filePath = join(__dirname, 'external-scripts/v1/inline.js');
              const content = fs.readFileSync(filePath, 'utf8');
              const protocol = (process.env.KUBERNETES_SERVICE_HOST) ? 'https' : 'http';
              const result = content.replace('"use strict";', '')
                .replace(/\\n/g, '')
                .replace(/\s\s+/g, '')
                .replace('Object.defineProperty(exports, "__esModule", { value: true });', '')
                .replace(/http\:\/\/localhost\//g, `${protocol}://${host}/`);

              res.setHeader('content-type', 'application/javascript');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(UglifyJS.minify(result).code)

            } else if (pathname === '/v2/inline.js') {
                const host = req.get('host');
                const filePath = join(__dirname, 'external-scripts/v2/inline.js');
                const content = fs.readFileSync(filePath, 'utf8');
                const protocol = (process.env.KUBERNETES_SERVICE_HOST) ? 'https' : 'http';
                const result = content.replace('"use strict";', '').replace(/\\n/g, '').replace(/\s\s+/g, '')
                  .replace('Object.defineProperty(exports, "__esModule", { value: true });', '')
                  .replace(/http\:\/\/localhost\//g, `${protocol}://${host}/`);

                res.setHeader('content-type', 'application/javascript');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(UglifyJS.minify(result).code);
            } else {
                handler(req, res, parsedUrl);
            }
        });

        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    });

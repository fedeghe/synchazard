module.exports = {
    appUrl: 'http://$DOMAIN_OR_IP$:$WEBSERVER.PORT$',
    puppeteer: {
        headless: true,
        slowMo: 100,
        timeout: 10000
    }
};
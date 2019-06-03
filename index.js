// Fill in your client ID and client secret that you obtained
// while registering the application
// First Step: Registering for an github OAuth application.
// Second Step: Fill in the generated client ID and client secret.

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');


const clientID = 'd902b6bd4de3dfdef4eb';
const clientSecret = '889908dcd9db36c8c03f919ffef0403d160c1f4d';

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async(ctx) => {
    const requestToken = ctx.request.query.code;
    console.log('Authorization code:', requestToken);
    // got the token info
    const tokenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(`Access token: ${accessToken}`);
    // got the data collection 
    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
        }
    });
    console.log(result.data);
    const username = result.data.name;

    ctx.response.redirect(`/welcome.html?user=${username}`);
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));
const port  = 8080;
app.listen(port);
console.log('Running in localhost:'+port);

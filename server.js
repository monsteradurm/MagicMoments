const express = require("express")
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');
const httpProxy = require('http-proxy');
const _ = require('underscore');
const BoxSDK = require('box-node-sdk');
const ejs = require('ejs');
const DELIVERIES = '151409262839'

const environment = {
    boxAppSettings: {
      clientID: 'jvlhdebgtb6bwuwpibbvi9cjzyr4us48',
      clientSecret: '0F5sTCB9fevzNzvy5zE8ckSpLlzNrDVh',
      appAuth: {
        publicKeyID: 'gvr6gbx5',
        privateKey: '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIGrxKFrBjIvkCAggA\nMBQGCCqGSIb3DQMHBAhE3HVp7qS7DgSCBMhrOAlp4G7psdPj2XlZN7564pbql1U7\nOKBTcgp1zeIArddDtpsxa7lCwj83ds8GAEV8AySMjQ2iGF3HyFO48eCYHQqUmfPs\n9UK6y6ud/pynqXFTOiucMwplHgG0YSPrvMVFBJdxd1nJUDyBmBJxfpAj8GI/ZEcb\nUheoXyNFJerBCdnkrajz1LEfDIWG1TEkjvlx+vrWc6oTMfF1GvRfKL+02ZaeqAX1\nfXOnLPyyFIpZWWlyR6bflAqqqTLr39lAz8X7ZeYFJRmz54jRLAnKvSpxw9fAaeSe\nl7r02mEFuvACsfksoVB17aTejGYicTjjm2yBwjtMR1mIfce8cuB0O9KI4BRjgwHg\nZMyBdwZGYUnBZjTS6YwUyrO5g5/hOrsDfvJ8rNYM7MQbQHt0BQw8YY/TQTsB2ghO\nP7AfzLaCAU70G8riFh24WPAM2+VymGV5c4gkUlng/9P1acbh/YuwBjkxP3NY4GBf\nqx+BNygigyzqHOKxzf8X6fFte15tB6QzTQNwDuuqkCs47Ot/HwJJNmobJ3dEWi9a\n/B9BMYlYOlsXlNkEiLmcO/lBLuwNgaJGo+DKW8YgNr2JHTqww1mYcC7b2XdkpIIr\nJjgqk7jjZ7d/t/hUXvxlMXaEHaj4X1I84PPmeu4BOl+uOVnC401TG2ndCFiN88QR\nLAefypAYNzDib/iK4cgyggd0HZVE+pmDwCIl3n7bEoxBTOCXNFDSrgtbSAUZkdEt\nQ303qAKl8JPeuxf+ToV2t2zEFjSHlQgNNX6lFNjHhztZnthuRcik1kAwEuWuktIM\nKzqk+mR9/+iG1EV5C46Nmp+9kjl8jt2+DgSvyJr1hrn8IV9iqv3wQoUKDB94DPBF\nyE+HrlwH2zmQ+SlrNyylZey0i5mLxDOmW2Lyf5kdbcudzlwrm/zwGGcGlaa5UHgr\n0feNOxqU/h6cgWpkNCE1ptgDeTqaNb6x4yCS+RESb6HvVg63RxeVzG46x2UwHTww\n/TOb+n2ISOnuxO1VF35Xk1IqAnKzIGlnm/779VXDwmKIT9QFaqzPQySWS5SAtTMW\n2B5sWM21BfKpOiOEC4L7Ut5C09JaiZAZTZtBlukOzM9qIycVZg9iI7aXnLSsi+tK\nngwJWiJnLOukpgl4+IvInVyrcxTLmzz5vU7WO+C8Y3tsHX9xqSrmM2Ci0Q5xpxp3\nhafhZSJDeXKxDbz17H6RII6SUA0e4T3CF56uiU1arc9x2CbbLkW7UGFFXepnmNm/\nKG9jyj8cXa32IgU2oCK6UYEAlO/xY8cCT2yno618ZuFMvgmRaKw3T4uukShO5FXv\nT4LvQm5EZ+k5Y3x5l7FybEjUWl1WVEHAVkjpgUuDEq2JqQWGNUscPGS/aSjECvwY\nnlV0jZ/Xoo/2/zwr3cYGt257qO2xdgeaS1bHackBTFOS6HBzNLaGJaVMMexMRZ9n\nfAacgcX27pxNxfvVPY54MkqJX1PCgivmBZk22kreMJrKdwoIGahgj6H7t7q32dux\ncREUWZUmWHQj2IUk0Gl9qFvtaR+zLk58Ck87Rrl+HL6Yd9g56CUq01JsrJQGxTnm\n4gErK4mOYLiIMIzQZmG2uiJlRh/gT6P8gIKBsvewX/Y0ElL984wFN4j1pTUTEdqf\n4co=\n-----END ENCRYPTED PRIVATE KEY-----\n',
        passphrase: 'fa61b902971a403d71f5146c304f1428'
      }
    },
    enterpriseID: '203146362'
  };



var proxy = httpProxy.createProxyServer({});
const cors = require('cors');
proxy.on('error', function(e) {
    console.log(e);
});
app.options('*', cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.static(path.join(__dirname, '/views')));



app.use('/MagicMoments/assets', express.static(path.join(__dirname, '/assets')));

app.get('/MagicMoments',function(req,res) {
    const filename = req.query.file;
    
    if (!filename) {
        res.send('Identifiable "Box File" Could not be Found!\n\n' + 
        'Please use /MagicMoments?file=[FILENAME]');
    }

    
    const SDK = BoxSDK.getPreconfiguredInstance(environment);
    const client = SDK.getAppAuthClient('enterprise', environment.enterpriseID);

    client.folders.getItems(DELIVERIES, { fields: 'name', offset: 0, limit: 1000}).then((result => {

        const entries = result.entries;

        if (entries.length < 1) {
            res.send("Folder is empty!")
            return;
        }

        const entry = _.find(entries, r => r.name.indexOf(filename) == 0);
        if (!entry) {
            res.send('Could not find file for franchise review: ' + filename);
            return;
        }

        const BoxId = entry.id;
        client.files.getDownloadURL(BoxId).then(downloadURL => {
            console.log(downloadURL);
            fs.readFile(path.join(__dirname, '/index.html'), 'utf-8', (err, html) => {
                res.send(ejs.render(html.replace('_ReviewURL_', downloadURL)))
             });
        });  
    }));
  });



var server = app.listen(() => {
        console.log("MagicMoments --> listening ", server.address().port)
});
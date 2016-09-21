/**
 * Created by lunber on 16/9/21.
 */

var app = require('koa')();
var Router = require('koa-router');
var json = require('koa-json');
var cors = require('koa-cors');
var co = require('co');
var serve = require('koa-static')
var session = require('koa-session');
// var mongoose = require('mongoose');



app.use(json());
app.use(cors());
app.keys = ['some secret hurr'];
app.use(session(app));

app.use(serve('dist'))

app.listen(3001);
console.log("listen port 3001")
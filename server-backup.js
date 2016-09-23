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
var koaBody = require('koa-body')();
var fs = require('fs')

var api_router = new Router({
    prefix: '/api'
});

var date = new Date();
var time = {
    date: date,
    year: date.getFullYear(),
    month: date.getFullYear() + "-" + (date.getMonth() + 1),
    day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
}
var path = './data/' + time.day + '.json';
api_router.post('/intention', koaBody, function *(next) {
    var body = this.request.body
    var data = new Array()
    fs.readFile(path, (err, fileData) => {
        console.log('readfile' + fileData)
    })
    fs.open(path, 'w', (err, fd) => {
        fs.stat(path , (err , stats) => {
            fs.readFile(path, {encoding: 'utf-8'}, (err, fileData) => {
                //文件内容
                console.log(fd)
                console.log('readfile'+fileData)
                console.log(stats.size)
                if (stats.size == 0) {
                    data.push(body)
                    console.log('none')
                } else {
                    data = JSON.parse(fileData)
                    console.log('读取的data值' + data)
                    data.push(body)
                }
                console.log(JSON.stringify(data))

                // var jsonData = fileData
                // console.log(jsonData)
                fs.writeFile(fd, JSON.stringify(data), (err) => {
                });
            })
        })
    })
    this.response.body = {
        msg: 'success',
        code: '1'
    }
})

app.use(json());
app.use(cors());
app.keys = ['some secret hurr'];
app.use(session(app));

app.use(api_router.routes())

app.use(serve('dist'))

app.listen(3001);
console.log("listen port 3001")
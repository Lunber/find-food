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

api_router.post('/intention',koaBody,function *(next) {
    console.log(this.request.body)
    var body = this.request.body
    var data =
    // data.push(JSON.stringify(this.request.body))
    // console.log(data)
    fs.open('./data/'+time.day+'.json', 'a' , (err , fd) => {
        fs.readFile('./data/'+time.day+'.json', {encoding: 'utf-8'} ,(err, fileData) => {
            //文件内容
            if (fileData == false){
                data.push(JSON.stringify(this.request.body))
                console.log('none')
            }else {
                data = JSON.parse(fileData)
                data.push(JSON.stringify(this.request.body))
            }
            // var jsonData = JSON.parse(fileData)
            fs.writeFile(fd,data,(err) => {
            });
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
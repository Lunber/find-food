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
var mongoose = require('mongoose');

var place = require('./setting.js')
var Record = require('./model/record.js')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://lunber:19920928@ds041556.mlab.com:41556/find-food');
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));

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

app.use(json());
app.use(cors());
app.keys = ['some secret hurr'];
app.use(session(app));

api_router
    .post('/intention', koaBody, function *(next) {
        var body = this.request.body
        var intention = Number(body.intention) * Number(body.type)
        Record.find({id: body.id, date: time.day}, (err, docs) => {
            if (docs == '') {
                var data = {
                    date: time.day,
                    place: place[body.id].name,
                    id: body.id,
                    weight: intention
                }
                var record = new Record(data)
                record.save()
            } else {
                var newWeight = docs[0].weight + intention
                Record.update({id: body.id, date: time.day}, {weight: newWeight}, (err, numAffected) => {
                    console.log('update')
                })
            }
        })
        this.response.body = {
            msg: 'success',
            code: '1'
        }
    })
    .get('/information', function *(next) {
        this.response.body = place;
    })
    .get('/result', function *(next) {
        var result_arr = new Array()
        var max_weight;
        yield Record.find({date: time.day}, (err, docs) => {
            if (docs.length > 0 ) {
                max_weight = docs[0].weight
                for (let i = 0; i < docs.length; i++) {
                    docs[i].id > max_weight ? max_weight = docs[i].weight : max_weight = max_weight;
                }
                for (let i = 0; i < docs.length; i++) {
                    if(docs[i].weight == max_weight)  {
                        result_arr.push(docs[i])
                    }
                }
                let n = Math.floor(Math.random() * result_arr.length + 1)-1;
                return this.response.body = {
                    result:result_arr[n].place
                }
            }
        })

    })

app.use(api_router.routes())

app.use(serve('dist'))

app.listen(3001);
console.log("listen port 3001")
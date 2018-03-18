# todolist

> A Vue.js project

>分为在线模式和离线模式

>因为没有设计师，不要吐槽样式

>临时用的api混在大杂烩里面所以不放出来了

>api的跨域地址设定地址为http://localhost:8088/

>在线测试地址https://www.kooritea.cc/public_file/pro/todolist/

>更改openid   http://localhost:8088/?openid=22336699

>默认的openid为"testopenid"

>暂时就这么多吧

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8088
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## 已知BUG
>在微信客户端浏览器中，改变事件状态后马上删除事件会导致浏览器崩溃



## enhancement
>事件排序


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 接口

POST <base>/todolist

---

### 请求参数
参数名 | 数据类型 | 是否必需 | 备注 | 可能取值
:-: | :-: | :-: | :- | :-:
do | String| 是 | 用于判断该次请求的目的
keyname | String | 否 | 所有用户所有事件的唯一标志，由前端生成
openid | String | 否 | openid
status | String | 否 | 单个事件的状态 | ok/no
text | String | 否 | 单个事件的内容
todos | Array | 否 | 事件数组，具体组成见下面

#### 具体方法

##### 1、获取当前用户所有事件
> POST <base>/todolist

request
``` javascript
{
	do:"getall",
	openid:"testopenid"
}
```
reponse
``` javascript
{
	status:"ok",
	data:[
		{
			keyname:"006717c42ca03afa602d543b05e527ee",
			status:"no",
			text:"1"
		},
		{
			keyname:"93c996a2b7eb13b7e4ebf4b7c8013384",
			status:"yes",
			text:"1"
		}
	]
}
```

##### 2、上传服务器缺少的事件
> POST <base>/todolist

request
``` javascript
{
	do:"updateall",
	openid:"testopenid",
	todos:[
		{
			do:"add",
			keyname:"006717c42ca03afa602d543b05e527ee",
			status:"no",
			text:"1"
		},
		{
			do:"add",
			keyname:"93c996a2b7eb13b7e4ebf4b7c8013384",
			status:"yes",
			text:"1"
		}
	]
}
```
reponse
``` javascript
{
	status:"ok"
}
```

##待续
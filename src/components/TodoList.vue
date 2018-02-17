<template>
	<div class="main" id="main">
		<div class="setting">
			<div class="online" v-on:click="setonline()">
				<input type="checkbox" v-model="setting.online" onclick="return false" />
				<span>在线模式</span>
			</div>
			<div style="clear:both"></div>
		</div>
		<div class="input" id="input">
			<input id="add_new" type="text" ref="add_new" placeholder="What needs to be done" v-on:keyup.13="push_event">
			<span  v-on:click="complete_all"  v-if="todos.length"><i class="iconfont icon-xiajiantou" v-bind:class="{ have: sum }"></i></span>
			<span class="add_button" v-on:click="push_event" v-if="true">添加</span>
		</div>
		<div class="list" id="event_list">
			<div class="list_son list-item" v-for="(todo,index) in filterlist"  v-bind:todo="todo" v-bind:key="index">
				<span class="evented" v-on:click="change_event_status(index)"><i class="iconfont icon-gou" v-bind:class="todo.status"></i></span>
				<div class="node" v-bind:class="todo.status" v-on:click="todo.edit=true" v-if="!todo.edit">{{todo.text}}</div>
				<p class="del" v-on:click="del_event(index,1)">×</p>
				<input type="text" v-if="todo.edit" v-on:keyup.13="push_edit(index)" v-model="todo.text" v-focus="todo.edit">
				<div class="bg" id="bg" v-if="todo.edit" v-on:click="push_edit(index)"></div>
				<div style="clear: both;"></div>
			</div>
		</div>
		<div class="footer" id="footer" v-if="todos.length">
			<span class="sum" id="sum">{{sum}} items left</span>
			<div class="buttom_all">
				<span id="button_all" class="buttom all" v-bind:class="{buttom_select:(view=='all')}" v-on:click="view='all'">All</span>
				<span id="button_active" class="buttom active" v-bind:class="{buttom_select:(view === 'no')}" v-on:click="view='no'">Active</span>
				<span id="button_completed" class="buttom completed" v-bind:class="{buttom_select:(view === 'ok')}" v-on:click="view='ok'">Completed</span>
			</div>
			<span class="clear" id="clear" v-if="(todos.length!=sum)"  v-on:click="clear_complete">Clear complete</span>
			<div style="clear:both"></div>
		</div>
	</div>
</template>
<script>
export default {
	name:'todolist',
	data () {
		return {
			todos: [
				// {
				// 	text: '233' ,
				// 	status:'no',
				// 	edit:false,
				// 	edit_value:"",
				// 	keyname:"事件唯一标示计算方法：md5(毫秒级时间戳+openid)"
				// }
			],
			view:'all', // 列表筛选条件
			todoDB:null,// indexedDB对象
			openid:null,
			setting:{
				online:(localStorage.online === 'true')
			},
			api:'https://wechat.kooritea.cc/todolist'
		}
	},
	computed:{
		filterlist:function(){// 条件筛选
			if(this.view === "no"){
				return this.todos.filter(function(todo){
					return todo.status === "no"
				})
			}
			if(this.view === "ok"){
				return this.todos.filter(function(todo){
					return todo.status === "ok"
				})
			}
			return this.todos
		},
		sum:function(){    //统计未完成事件
			let sum = 0;
			for(let i = 0;i < this.todos.length;i++){
				if(this.todos[i].status === "no"){
					sum++;
				}
			}
			return sum
		},
		online:function(){
			return this.setting.online
		}
	},
	methods:{
		del_event:function(index,type){            //删除事件      当type为0时不需要确认
			if(type){
				if(!confirm("你确认要删除这条事件吗？")){
					return
				}
			}
			let keyname = this.filterlist[index].keyname;
			for (let key in this.todos) {
			    if (this.todos[key].keyname === keyname) {
			        this.todos.splice(key, 1);
			    }
			}
			this.DB_del_event(keyname)
			if(this.setting.online){
				this.axios.post(this.api,{
					do:'del',
					keyname:keyname
				});
			}
		},
		change_event_status:async function(index){                  //更改事件状态
			let newstatus = '';
			let keyname = this.filterlist[index].keyname;
			let text = this.filterlist[index].text;
			if(this.filterlist[index].status === "ok"){
				newstatus = "no";
				this.DB_edit_event(this.filterlist[index].keyname,{status:"no"})
				this.filterlist[index].status = "no";	
			}
			else{
				newstatus = "ok";
				this.DB_edit_event(this.filterlist[index].keyname,{status:"ok"})
				this.filterlist[index].status = "ok";
			}
			if(this.setting.online){
				await this.axios.post(this.api,{
					do:'update',
					keyname:keyname,
					text:text,
					status:newstatus
				});
			}
		},
		push_edit:async function(index){// 提交事件编辑
			this.filterlist[index].edit = false; // 关闭编辑框
			if(!this.filterlist[index].text){// 如果编辑后内容为空则删除事件
				this.del_event(index,0)
			}
			else{
				this.DB_edit_event(this.filterlist[index].keyname,{text:this.filterlist[index].text})// 将编辑结果提交到本地数据库
				if(this.setting.online){// 将编辑结果提交到在线数据库
					await this.axios.post(this.api,{
						do:'update',
						keyname:this.filterlist[index].keyname,
						text:this.filterlist[index].text,
						status:this.filterlist[index].status
					});
				}
			}
		},
		clear_complete:function(){
			if(confirm("你确认要删除全部已完成事件吗？")){
				if(this.setting.online){
					this.axios.post(this.api,{
						do:'delall_ok',
						openid:this.openid
					})
				}
				for(let i = 0;i < this.todos.length;i){
					if(this.todos[i].status === "ok"){
						let keyname = this.todos[i].keyname
						this.DB_del_event(keyname);
						this.todos.splice(i, 1);
					}
					else{
						i++;
					}
				}
			}
		},
		push_event:async function(){// 提交新的事件
			if(this.$refs.add_new.value){    //refs是这个组件中带有ref属性的元素的集合
				let keyname = this.md5((new Date()).valueOf() + this.openid);
				let data = {
					text: this.$refs.add_new.value ,
					status:'no',
					edit:false,
					edit_value:"",
					keyname:keyname
				}
				let DB_data = {
					text: this.$refs.add_new.value ,
					status:'no',
					keyname:keyname
				}
				this.todos.push(data);
				this.DB_push_event(DB_data);
				DB_data.do = 'add';
				DB_data.openid = this.openid;
				this.$refs.add_new.value = "";
				if(this.setting.online){
					this.axios.post(this.api,DB_data);
				}
			}
		},
		complete_all:function(){// 输入框左边的箭头，当有未完成时设为全部完成。否则全部设为未完成
			let newstatus = '';
			if(this.sum){
				newstatus = 'ok'
			}
			else{
				newstatus = 'no'
			}
			if(this.setting.online){
				this.axios.post(this.api,{
					do:'setall_status',
					openid:this.openid,
					status:newstatus
				});
			}
			for(let i = 0;i < this.todos.length;i++){
				this.DB_edit_event(this.todos[i].keyname,{status:newstatus})
				this.todos[i].status = newstatus
			}
		},
		setonline:function(){//  切换在线离线模式
			if(this.setting.online === false){
				if(confirm("切换为在线模式后，所有事件将同步到服务器上")){
					this.setting.online = true;
					localStorage.online = true;
					// this.axios.post(this.api,{
					// 	do:'updateall',
					// 	openid:this.openid,
					// 	todos:this.todos
					// })
					this.synchronous();
				}
			}
			else{
				if(confirm("切换为离线模式后，所有事件将从服务器上删除")){
					this.setting.online = false
					localStorage.online = false
					this.axios.post(this.api,{
						do:'delall',
						openid:this.openid
					})
				}
			}
		},
		synchronous:async function(){
			if(this.setting.online){// 如果为在线模式，则开始同步
				let data = (await this.axios.post(this.api,{
					do:'getall',
					openid:this.openid
				})).data.data;
				//线上线下同步
				let local = this.Getkeyname(this.todos);// Getkeyname作用是将含有keyname的对象数组转换后，返回一个只有keyname的数组
				let online = this.Getkeyname(data);
				let diff = this.Getkeyname_diff(local,online);// Getkeyname_diff用与获取两个数组差异的部分

				let local_diff = this.Getkeyname_diff(this.Getkeyname_inter(local,diff),diff);// Getkeyname_inter用于获取两个数组相交的部分
				//local_diff为本地缺少的keyname
				for(let i = 0;i < local_diff.length;i++){// 遍历local_diff，从服务器返回的data获取本地缺少的数据分别提交到本地数据库和vue实例
					for(let j = 0;j < data.length;j++){
						if(local_diff[i] === data[j].keyname){
							delete data[j].id;
							delete data[j].openid;
							this.DB_push_event(data[j]);
							data[j].edit = false;
							data[j].edit_value = "";
							this.todos.push(data[j]);
							continue
						}
					}
				}

				let online_diff = this.Getkeyname_diff(this.Getkeyname_inter(online,diff),diff);
				//online_diff为服务器缺少的keyname
				let willpush = [];
				// 将要被发送的数组
				for(let i = 0;i < online_diff.length;i++){// 遍历online_diff，从vue实例中获取服务器缺少的数据并提交
					for(let j = 0;j < this.todos.length;j++){
						if(online_diff[i] === this.todos[j].keyname){
							willpush.push({
								openid:this.openid,
								do:'add',
								keyname:this.todos[j].keyname,
								text:this.todos[j].text,
								status:this.todos[j].status
							})
							continue
						}
					}
				}
				await this.axios.post(this.api,{
					do:'updateall',
					openid:this.openid,
					todos:willpush
				})
			}
		},
		DB_push_event:function(data){// 向本地数据库提交事件
			// var vue_todo_obj = this;
			// return new Promise(function(resolve, reject){
			// 	vue_todo_obj.todoDB.result.transaction('todo', "readwrite").objectStore('todo').add(data);
			// 	vue_todo_obj.todoDB.result.transaction('todo', "readwrite").objectStore('todo').onsuccess=function(event){
			// 		resolve(event)
			// 	}
			// })

			this.todoDB.result.transaction('todo', "readwrite").objectStore('todo').add(data);
		},
		DB_edit_event(keyname, data) {// 编辑本地数据库的事件，keyname是事件唯一标示(索引)，data是一个对象{要修改的值的名字:要修改的值}
			// 新建事务
			let transaction = this.todoDB.result.transaction('todo', "readwrite");
			// 打开已经存储的数据对象
			let objectStore = transaction.objectStore('todo');
			// 获取存储的对应键的存储对象
			let keypath = objectStore.index('keyname');
			let objectStoreRequest = keypath.get(keyname);
			// 获取成功后替换当前数据
			objectStoreRequest.onsuccess = function(event) {
			// 当前数据
				let myRecord = objectStoreRequest.result;
				// 遍历替换
				for (let key in data) {
				    if (typeof myRecord[key] !== 'undefined') {
				        myRecord[key] = data[key];
				    }
				}
				// 更新数据库存储数据             
				objectStore.put(myRecord);
			};
		},
		DB_del_event(keyname){
			let transaction = this.todoDB.result.transaction('todo', "readwrite");
			// 打开已经存储的数据对象
			let objectStore = transaction.objectStore('todo');
			// 获取存储的对应键的存储对象
			let keypath = objectStore.index('keyname');
			let objectStoreRequest = keypath.getKey(keyname);
			objectStoreRequest.onsuccess = function(event) {
				objectStore.delete(objectStoreRequest.result)
			};
		},
		create_DB:function(openid){
			let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
			if(indexedDB){// 创建一个indexedDB对象，数据库命名为openid
				this.todoDB = indexedDB.open(openid,1);
				this.todoDB.onupgradeneeded = function (event) {
					let db = event.target.result;
					if(!db.objectStoreNames.length){
						let objectStore = db.createObjectStore("todo", { 
					        keyPath: 'id',
					        autoIncrement: true
					    });
					    objectStore.createIndex('keyname', 'keyname', {
					        unique: true    
					    });
					    // objectStore.createIndex('text', '');
					    // objectStore.createIndex('status', '');
					    // objectStore.createIndex('keyname', '');
					}
				}
				var vue_todo_obj = this;
				this.todoDB.onsuccess =function (event) {           //读取indexedDB的数据到实例里面
					let objectStore = event.target.result.transaction('todo', "readwrite").objectStore('todo');
					objectStore.openCursor(null, IDBCursor.prev).onsuccess = function(event) {
						let cursor = event.target.result;
						if (cursor) {
							let data = cursor.value;
							data.edit = false;
							data.edit_value = "";
							vue_todo_obj.todos.push(data);
							cursor.continue();
						}
						else{// 本地数据库读取完成后,执行同步
							vue_todo_obj.synchronous();
						}
					};
				}
			}
			else{
				alert("你的老牛不行了呀")
			}
		},
		Getkeyname:function(arry){// 将含有keyname的对象数组转换后，返回一个只有keyname的数组
			let a = new Array()
			for(let i = 0;i<arry.length;i++){
				a[i] = arry[i].keyname;
			}
			return a
		},
		Getkeyname_diff:function(a,b){// 取两个数组相异部分
			let difference = a.concat(b).filter(v => !a.includes(v) || !b.includes(v));
			return difference
		},
		Getkeyname_inter:function(a,b){
			let intersection = a.filter(v => b.includes(v)) //交集
			return intersection
		},
		GetQueryString:function(name){// 获取url上的参数
			let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
			let r = window.location.search.substr(1).match(reg);
			if (r !== null) return unescape(r[2]); return null;
		}
	},
	watch:{
		
	},
	mounted () {// vue实例创建后、页面渲染前执行
		this.openid = this.GetQueryString('openid')||'testopenid';// 若url上没有openid则让openid="testopenid"
		this.create_DB(this.openid);  //创建数据库
	},
	directives: {
		focus:{
			inserted: function (el) {
				el.focus();
			}
		}
	}
}
</script>
<style>
body{
	margin:0;
	background-color: #eee;
}
.main{
	position: relative;
	margin: 0 auto;
	max-width: 550px;
	width: 100%;
	background-color: #fff;
}
.main .setting{
	position: relative;
	background-color: #eee;
	line-height: 40px;
}
.main .setting .online{
	float: right;
	margin-right: 10px;
}
.main .input
{
	overflow: hidden;
	position: relative;
}
.main .input input{
	height: 50px;
	line-height: 50px;
	width: calc(100% - 120px);
	max-width: 500px;
	font-size: 30px;
	padding: 0 70px 0 50px;
	border: 0;
	box-shadow: 0px 0px 15px #bbb;
	outline: 0;
}
.main .input span{
	position: absolute;
	width: 50px;
	height: 50px;
	display: block;
	top: 0;
	cursor: pointer;
}
.main .input span i{
	position: absolute;
	top: 50%;
	transform: translateY(-60%);
	left: 12px;
	color: #eee;
}
.main .input .add_button{
	right: 0;
	height: 48px;
	line-height: 50px;
	text-align: center;
	border:1px solid #000;
}
.main .input span .have{
	color:#000;
}
.main .input #add_new::-webkit-input-placeholder{
	color: #eee;
	font-style: oblique;
	font-size: 25px;
}
.main .input #add_new::-moz-placeholder{
	color: #eee;
	font-style: oblique;
	font-size: 25px;
}
.main .list{
	position: relative;
}
.main .list .list_son{
	position: relative;
	min-height: 50px;
	line-height: 50px;
	width: calc(100% - 50px);
	max-width: 500px;
	font-size: 30px;
	padding-left: 50px;
	border-bottom: 1px solid #ddd;
}
.main .list .list_son .evented{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 10px;
	height: 30px;
	border: 1px solid #000;
	border-radius: 50%;
	height: 30px;
	width: 30px;
	float: left;
	cursor: pointer;
	border-color: #eee;
	transition: border-color 0.1s;
}
.main .list .list_son .evented i{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-47%);
	color: #00ff00;
}
.main .list .list_son .evented .no{
	display: none;
}
.main .list .list_son .evented .ok{
	display: block;
}
.main .list .list_son .node{
	outline: 0;
	font-size: 20px;
	width: calc(100% - 50px);
	max-width: 450px;
	float: left;
	transition: color 0.2s;
	min-height: 50px;
	word-wrap:break-word; 
	word-break:normal; 
}
.main .list .list_son >.ok{
	text-decoration:line-through;
	color: #eee;
}
.main .list .list_son >.no{
}
.main .list .list_son .del{
	user-select:none;
	float: left;
	line-height: 50px;
	text-align: center;
	margin: 0;
	width: 50px;
	cursor: pointer;
	transition: opacity 0.5s,color 0.5s;
	color: #000;
}
.main .list .list_son .del:hover{
	color: #888;
}
.main .list .list_son input{
	width: calc(100% - 75px);
	max-width: 480px;
	position: absolute;
	height: 50px;
	left: 50px;
	font-size: 20px;
	top: 50%;
	transform: translateY(-50%);
	outline: 0;
	box-shadow: inset 0 0 2px 2px #eee;
	border: 1px solid #000;
	padding-left: 20px;
	z-index: 99;
}
.main .bg{
	z-index: 80;
	position: fixed;
	width: 100vw;
	height: 100%;
	min-height: 100vh;
	top: 0;
	left: 0;
}
.main .footer
{
	position: relative;
	line-height: 23px;
	color: #777;
	user-select:none;
}
.main .footer .sum{
	position: relative;
	float: left;
	margin-left: 10px;
	cursor: default;
}
.main .footer .buttom_all{
	position: relative;
	float: left;
	margin-left: 10px;
	display: inline-block;
}
.main .footer .buttom_all .buttom{
	padding: 0 5px;
	border-radius: 5px;
	cursor: pointer;
}
.main .footer .buttom_all .buttom:hover{
	border: 1px solid #777;
	padding: 0 4px;
}
.main .footer .buttom_all .buttom_select{
	border: 1px solid #777;
	padding: 0 4px;
}
.main .footer .clear{
	float: right;
	margin-right: 10px;
	cursor: pointer;
}
.main .footer .clear:hover{
	text-decoration: underline;
}

/*anime*/

</style>
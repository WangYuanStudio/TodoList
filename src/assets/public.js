var pubjs = {
  format:function(time, format){
    let t = new Date(time);
    let tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
      switch(a){
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    })
  },
  loadingToast(){
    let loadingToast = document.createElement("div");
    loadingToast.id = 'loadingToast'
    loadingToast.style = `opacity: 1;transition:opacity 0.2s`
    loadingToast.innerHTML = `
      <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">数据加载中</p>
      </div>`
    document.body.appendChild(loadingToast)
  },
  toast(text){
    if(document.getElementById('loadingToast')){
      document.body.removeChild(document.getElementById('loadingToast'))
    }
    let toast = document.createElement("div");
    toast.id = 'toast'
    toast.style = `pointer-events;opacity: 0;transition:opacity 0.2s`
    //<div class='weui-mask_transparent'></div>
    toast.innerHTML = `
        <div class='weui-toast'>
            <i class='weui-icon-success-no-circle weui-icon_toast'></i>
            <p class='weui-toast__content'>${text}</p>
        </div>`
    document.body.appendChild(toast)
    setTimeout(()=>{
      toast.style.opacity=1
    },100)
    setTimeout(()=>{
      toast.style.opacity=0
    },2000)
    setTimeout(()=>{
      document.body.removeChild(toast)
    },2200)
  },
  alert(title,text){
    if(document.getElementById('loadingToast')){
      document.body.removeChild(document.getElementById('loadingToast'))
    }
    let alert = document.createElement("div");
    alert.id='alert'
    alert.innerHTML = `
    <div class="weui-mask"></div>
    <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title">${title}</strong></div>
        <div class="weui-dialog__bd">${text}</div>
        <div class="weui-dialog__ft">
            <a href="javascript:document.body.removeChild(document.getElementById('alert'));" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>
        </div>
    </div>`
    document.body.appendChild(alert)
  },
  confirm(text,accept,cancel){
    let connfirmBG=  document.createElement("div");
    connfirmBG.id = 'connfirmBG'
    connfirmBG.className = 'confirmBG'
    let connfirm = document.createElement("div");
    connfirm.className = 'confirm'
    connfirm.innerHTML = `
      <div class="text">
        <p>${text}</p>
      </div>`
    let button=document.createElement("div");
    button.className = 'button'
    let acceptb = document.createElement("div");
    acceptb.className = 'accept'
    acceptb.innerHTML = '确定'
    acceptb.onclick=accept
    acceptb.addEventListener('click',function(){
      document.body.removeChild(document.getElementById('connfirmBG'))
    })
    let cancelb = document.createElement("div");
    cancelb.className = 'cancel'
    cancelb.innerHTML = '取消'
    cancelb.onclick=cancel
    cancelb.addEventListener('click',function(){
      document.body.removeChild(document.getElementById('connfirmBG'))
    })
    button.appendChild(acceptb)
    button.appendChild(cancelb)
    connfirm.appendChild(button)
    connfirmBG.appendChild(connfirm)
    document.body.appendChild(connfirmBG)
  }
}
export default pubjs

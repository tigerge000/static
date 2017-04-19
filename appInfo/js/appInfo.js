$(function(){
  var queryInfo = {searchAll:0};
  fetchData(queryInfo);
});

function searchData(){
  $("#list").html('');
  var osValue = document.getElementById("os").value;
  var envValue = document.getElementById("env").value;
  var modeValue = document.getElementById("mode").value;

  if(osValue == "All" ){
    osValue = null;
  }

  if(envValue == "All" ){
    envValue = null;
  }

  if(modeValue == "All" ){
    modeValue = null;
  }

  var queryInfo = {os:osValue,env:envValue,appmode:modeValue,searchAll:1};
  fetchData(queryInfo);
}

function fetchData(query){
  $.ajax(
    {
      type:"POST",
      dataType:'json',
      cache:false,
      data:JSON.stringify(query),
          contentType: 'application/json; charset=utf-8',
      url:window.location.origin + "/FingerAppPublish/getLatestAppInfo",
      success: succFuction,
      error:errFuction
  }
  );
}

function errFuction(){
  $("#info").html('网络异常...');
}

function succFuction(tt){
  $("#list").html('');
  if(!tt.res){
    $("#info").html('哦哦，没数据咋办，凉拌吧!!');
    return;
  }
  var arrayList = eval(tt.res);
  // var htmlValue = '';
  var uathtmlValue = '';
  var betahtmlValue = '';
  var livehtmlValue = '';
  //var result = {tEnv:env,tHTML:html1};
  $.each(arrayList,function(index,item){
    var result = eval(eachValue(arrayList,index,item));
    if(result.tEnv == "uat"){
      uathtmlValue += result.tHTML;
    }
    if(result.tEnv == "beta"){
      betahtmlValue += result.tHTML;
    }
    if(result.tEnv == "live"){
      livehtmlValue += result.tHTML;
    }
    // htmlValue +=eachValue(arrayList,index,item);
    // $("#info").html($("#info").html() + html1);
  });
  // $("#info").html(htmlValue);
  $("#uatinfo").html(uathtmlValue);
  $("#betainfo").html(betahtmlValue);
  $("#liveinfo").html(livehtmlValue);
}

//遍历数据
function eachValue(arrayList,index,item){
  //{{picname}} {{osname}} {{envname}} {{branchname}} {{modename}} {{datename}} {{fileUrl}}
  var html1 = '<div class="col-sm-4"><div class="contact-box"><div class="col-sm-4"><div class="text-center"><img alt="image" class="img-circle m-t-xs img-responsive" src="{{picname}}"><div class="m-t-xs font-bold">{{osname}}</div></div></div><div class="col-sm-8"><br/><input type="button" id="download" name="download" class="btn btn-primary" value="下载" onclick=window.open("{{fileUrl}}")><br/><small>环境: {{envname}}</small><br><small>分支: {{branchname}}</small><br><small>类型: {{modename}}</small><br><small>日期: {{datename}}</small></div><div class="clearfix"></div></div></div>'
  var picname = arrayList[index].qrcodeUrl;
  var osname = arrayList[index].os;
  var env = arrayList[index].env;
  var fileUrl = arrayList[index].fileUrl;
  if(env === "uat"){
    var envname = "测试环境";
  }else if (env === "beta") {
    var envname = "预发环境";
  }else if (env === "live") {
    var envname = "线上环境";
  }else {
    var envname = "未知环境";
  }
  var branchname = arrayList[index].branchName;
  var modename = arrayList[index].appmode;
  var dateValue = arrayList[index].gmtCreate;
  var datename = getLocalTime(dateValue);

  if(picname != null){
    html1 = html1.replace("{{picname}}",picname);
  }else {
    html1 = html1.replace("{{picname}}","imges/logo.png");
  }
  if(osname != null){
    html1 = html1.replace("{{osname}}",osname);
  }else {
    html1 = html1.replace("{{osname}}","未知系统");
  }

  html1 = html1.replace("{{envname}}",envname);

  if(branchname != null){
    html1 = html1.replace("{{branchname}}",branchname);
  }else {
    html1 = html1.replace("{{branchname}}","未知分支");
  }

  if(modename != null){
    html1 = html1.replace("{{modename}}",modename);
  }else {
    html1 = html1.replace("{{modename}}","未知mode");
  }

  if(datename != null){
    html1 = html1.replace("{{datename}}",datename);
  }else {
    html1 = html1.replace("{{datename}}","时间未知");
  }

  if(fileUrl != null){
    html1 = html1.replace("{{fileUrl}}",fileUrl);
  }else {
    html1 = html1.replace("{{fileUrl}}","http://www.baidu.com");
  }

  var result = {tEnv:env,tHTML:html1};

  return result;
}


//清除查询
function clearSearchInfo(){
  document.getElementById("os").value = "All";
  document.getElementById("env").value = "All";
  document.getElementById("mode").value = "All";
}


//时间戳转换成日期
function getLocalTime(timestamp) {
   return new Date(parseInt(timestamp)).toLocaleString().replace(/:\d{1,2}$/,' ');
}

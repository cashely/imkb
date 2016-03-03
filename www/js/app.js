// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controller','starter.config','ngCordova'])

.run(function($ionicPlatform,$cordovaStatusbar,Pusher,$ionicModal,$timeout,$log,$ionicPopup,$ionicScrollDelegate,$ionicLoading,$ionicPosition,$rootScope,$http,$state,$cordovaContacts) {
  $ionicPlatform.ready(function() {
      console.log('检测平台:',Pusher);
      Pusher.init();
      // 清除bradge
      Pusher.resetBradge();
      // 获取通知内容
      document.addEventListener("jpush.openNotification", Pusher.onOpenNotification, false);
      // 获取自定义消息推送内容
      document.addEventListener("jpush.receiveMessage", Pusher.onReceiveMessage, false);
      // 获取通知内容
      document.addEventListener("jpush.receiveNotification", Pusher.onReceiveNotification, false);
    // $cordovaStatusbar.style(2);
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.style(2);
    }
    //搜索modal
    $ionicModal.fromTemplateUrl('views/search-template.html',{
      scope:$rootScope,
      animation:'slide-in-up',
      focusFirstInput:true,
      hardwareBackButtonClose:true
    }).then(function(modal){
      $rootScope.searchModal = modal;
    });
    $rootScope.openSearchModal = function(){
      $rootScope.searchModal.show();
    };
    $rootScope.hideSearchModal = function(){
      $rootScope.searchModal.hide();
    };
    //单篇文章modal
    
    // 分享
    $rootScope.sharePage = function(){
      var alertPopup = $ionicPopup.show({
                   title: '分享到',
                   templateUrl:'views/share.html',
                   buttons:[{
                    text:'取消',
                    type: 'button-default',
                    onTap:function(e){
                      alertPopup.close();
                      e.preventDefault();
                    }
                   }]
                  });
    };
    $rootScope.showPage = function(id){
        $ionicModal.fromTemplateUrl('views/page.html', {
          scope: $rootScope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $rootScope.pageModal = modal;
          $rootScope.pageModal.show();

          showLoading();
          $http({
            url:$rootScope.serviceAddress + 'showSmsApp',
            method:'POST',
            timeout:60 * 1000,
            params:{
              id:id
            }
          }).success(function(res){
            console.log('文章结果',res);
            $rootScope.page = res;
            hideLoading();
          })
        });
        
    };

    $rootScope.hidePage = function(){
      $rootScope.pageModal.remove();
      // $rootScope.page = [];
      // console.log($rootScope.page);
      $ionicScrollDelegate.$getByHandle('pageScroll').scrollTop();
    };
    // 文章锚链接
    // $rootScope.linkScroll = function(ele){
    //   if($('#'+ele).length>0){
    //     var position = $ionicPosition.position($('#'+ele)).top;
    //     console.log($ionicScrollDelegate.$getByHandle('pageScroll'));
    //       $ionicScrollDelegate.scrollBottom();
    //   }
    // }
    //获取手机通讯录
    getContacts = function(fn){
      var options = {};
       options.filter = "";
       options.multiple = true;
       $cordovaContacts.find(options).then(function(res){
        var b=[];
        for(var i =0;i<res.length;i++){
          b.push(res[i]);
        }
        $rootScope.contacts = b;
       });
    };
    getContacts();
  });
  $rootScope.serviceAddress = "http://192.168.1.235:8082/imkb/";
  // $rootScope.serviceAddress = "http://192.168.1.103:8080/imkb/";
  // $rootScope.serviceAddress = "http://192.168.1.103:8088/imkb/";

  $rootScope.login = function(id,psw){
      showLoading('正在登录...');
      $http({
        url: $rootScope.serviceAddress + 'login',
        method:'POST',
        params:{
          userName : id,
          password : psw
        },
        timeout:10 * 1000
      }).success(function(res){
        hideLoading();
        if(res.status == 1){
          console.log(res);
          var userInfo = {
            id : id,
            psw : psw
          };
          localStorage.setItem('autoLogin',true);
          localStorage.setItem('userInfo',JSON.stringify(userInfo));
          $state.go('index.search');
        }else{
          alertMsg(res.message);
        }
      }).error(function(res){
        hideLoading();
        alertMsg('网络故障');
      });
    };
    
    // 获取单篇文章
    getDocument =function(id,callback){
      var fn = callback || function(){};
      showLoading('数据正在加载中...');
      $http({
        url:$rootScope.serviceAddress + 'sms',
        params:{
          id : id
        }
      }).success(function(res){
        fn(res);
        hideLoading();
      }).error(function(res,code){
        hideLoading();
        alertMsg(code)
      });
    };
    //显示加载状态
    showLoading = function(text){
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-light">'+ (text ? text : '数据加载中...') +'</ion-spinner>'
      });
    };
    //关闭加载状态
    hideLoading = function(){
      $ionicLoading.hide();
    }
    // alertMsg
    alertMsg = function(msg){
      var alertPopup = $ionicPopup.alert({
                         title: '温馨提示',
                         template: msg
                       });
      $timeout(function () {
          alertPopup.close();
      }, 3000);
    }
    ajaxFail = function(){
      var alertPopup = $ionicPopup.alert({
                         title: '温馨提示',
                         template: '网络错误'
                       });
      $timeout(function () {
          alertPopup.close();
      }, 3000);
    }
})
.factory('Pusher', function ($ionicPopup, $state) {
  var pusher = null;
  return {
    onReceiveMessage: function (event) {
      if(pusher){
        $ionicPopup.alert({
         title: '温馨提示',
         template: pusher.receiveMessage.message
       });
      };
    },
    onOpenNotification: function (event) {
      if(ionic.Platform.isAndroid()){
        window.plugins.jPushPlugin.resetBadge();
      }//清除bradge
      var alertContent = null;
      if(pusher && ionic.Platform.isAndroid()){
        alertContent = pusher.openNotification.alert;
      }else{
        alertContent = event.aps.alert;
      };
      console.log('onOpenNotification:',alertContent);
      alert('onOpenNotification:',alertContent);
    },
    onReceiveNotification: function (event) {
      if(ionic.Platform.isAndroid()){
        alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
      }else{
        alertContent = event.aps.alert;
      }

      console.log('onReceiveNotification',alertContent);
      alert('onReceiveNotification',alertContent);
    },
    getRegistradionID: function () {
      return localStorage.getItem('jPushID', null);
    },
    resetBradge: function(){
      if(ionic.Platform.isAndroid()){
        window.plugins.jPushPlugin.resetBadge();
      }
    },
    init: function () {
      if (window.plugins && window.plugins.jPushPlugin) {
        pusher = window.plugins.jPushPlugin;
        // 初始化
        pusher.init();
        // 获取注册ID
        pusher.getRegistrationID(function (id) {
          localStorage.setItem('jPushID', id);
        });
        // 设置
        if (!ionic.Platform.isAndroid()){
          pusher.setDebugModeFromIos();
          pusher.setApplicationIconBadgeNumber(0);
        } else {
          pusher.setDebugMode(true);
        };
      };
    }
  };
})

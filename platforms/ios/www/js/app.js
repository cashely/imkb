// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'starter.config', 'ngCordova'])

.run(function($location, $ionicPlatform, $ionicScrollDelegate, $cordovaStatusbar, Pusher, $ionicModal, $timeout, $log, $ionicPopup, $ionicScrollDelegate, $ionicLoading, $ionicPosition, $rootScope, $http, $state, $cordovaContacts) {
    // android返回键事件处理
    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();

      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });

        confirmPopup.then(function(res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {}
        });
      }

      // Is there a page to go back to?
      // if ($location.path() == '/index/search') {
      showConfirm();
      // } else if ($ionicHistory.backView()){
      // console.log('currentView:', $rootScope.$viewHistory.currentView);
      // $ionicHistory.goBack();
      // }
      return false;
    }, 101);


    $ionicPlatform.ready(function() {
      Pusher.init();
      // 清除bradge
      Pusher.resetBradge();
      // 获取通知内容
      document.addEventListener("jpush.openNotification", Pusher.onOpenNotification, false);
      // 获取自定义消息推送内容
      document.addEventListener("jpush.receiveMessage", Pusher.onReceiveMessage, false);
      // 获取通知内容
      document.addEventListener("jpush.receiveNotification", Pusher.onReceiveNotification, false);
      console.log('检测平台:', Pusher);
      // $cordovaStatusbar.style(2);
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusbar.style(2);
      }
      //搜索modal
      $ionicModal.fromTemplateUrl('views/search-template.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
        focusFirstInput: true,
        hardwareBackButtonClose: true
      }).then(function(modal) {
        $rootScope.searchModal = modal;
      });
      $rootScope.openSearchModal = function() {
        $rootScope.searchModal.show();
      };
      $rootScope.hideSearchModal = function() {
        $rootScope.searchModal.hide();
      };
      //单篇文章modal

      // 分享
      $rootScope.sharePage = function() {
        var alertPopup = $ionicPopup.show({
          title: '分享到',
          templateUrl: 'views/share.html',
          buttons: [{
            text: '取消',
            type: 'button-default',
            onTap: function(e) {
              alertPopup.close();
              e.preventDefault();
            }
          }]
        });
      };
      $rootScope.goTop = function() {
        // $timeout(function() {
        // console.log('获取的滚动元素',$ionicScrollDelegate.$getByHandle('pagepScroll').scrollTop(0));
        // $ionicScrollDelegate.$getByHandle('pagepScroll').scrollTop(0)
        console.log();
        $('#pagepScroll').children('.scroll').css('transform', 'translate3d(0px, 0px, 0px)');

        console.log($('#pagepScroll').css('transform'));
        // }, 10);
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
      getContacts = function(fn) {
        var options = {};
        options.filter = "";
        options.multiple = true;
        $cordovaContacts.find(options).then(function(res) {
          var b = [];
          for (var i = 0; i < res.length; i++) {
            b.push(res[i]);
          }
          $rootScope.contacts = b;
        });
      };
      getContacts();
    });
    $rootScope.showPage = function(id) {
      $ionicModal.fromTemplateUrl('page.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $rootScope.pageModal = modal;
        $rootScope.pageModal.show();
        showLoading();
        $http({
          url: $rootScope.serviceAddress + 'showSmsApp',
          method: 'POST',
          timeout: 60 * 1000,
          params: {
            id: id,
            sign: 0,
            indexPath: '5241e1d1ef224c6db86356560bf6ddd5',
            imagePath:$rootScope.imagePath,
            createUser: localStorage.getItem('sid')
          }
        }).success(function(res) {
          console.log('文章结果', res);
          $rootScope.page = res;
          $rootScope.page.id = id;
          console.log('文章信息', $rootScope.page);
          hideLoading();
        }).error(function() {
          hideLoading();
          ajaxFail();
        });
      });
    };
    $rootScope.hidePage = function() {
      $rootScope.pageModal.remove();
    };
    $rootScope.showFullPage = function(ns) {
        if(localStorage.getItem('sid')){
            $ionicModal.fromTemplateUrl('views/page-all.html', {
              scope: $rootScope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $rootScope.pageAllModal = modal;
              $rootScope.pageAllModal.show();
            });
        }else{
          $ionicPopup.confirm({
            template:'您暂未登录，请登录',
            cancelText:'暂不',
            okText:'去登录'
          }).then(function(res){
            if(res){
              Wechat.isInstalled(function (installed) {
              //     WEIXININSTALL=installed;
                if(installed){
                  $rootScope.hidePage();
                  $state.go('login')
                }else{
                  alertMsg('请安装微信后重试！');
                }
              });
            }
          })
        }
      }
      // 添加收藏
    $rootScope.addCollect = function() {
      $http({
        url: $rootScope.serviceAddress + 'insertUserHouseApp',
        method: 'POST',
        params: {
          sourceId: $rootScope.page.id,
          indexPath: '5241e1d1ef224c6db86356560bf6ddd5',
          createUser: localStorage.getItem('sid')
        }
      }).success(function(res) {
        $rootScope.page.isUserHouse = 1;
        alertMsg(res.message);
      }).error(function(res){
        ajaxFail();
      });
    }
    $rootScope.removeCollect = function() {
      $http({
        url: $rootScope.serviceAddress + 'deleteUserHouseApp',
        method: 'POST',
        params: {
          sourceId: $rootScope.page.id,
          indexPath: '5241e1d1ef224c6db86356560bf6ddd5',
          createUser: localStorage.getItem('sid')
        }
      }).success(function(res) {
        $rootScope.page.isUserHouse = 0;
      });
    };
    // 纠错
    $rootScope.showEditPage = function() {
      $ionicModal.fromTemplateUrl('views/edit-page.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $rootScope.editPage = modal
        $rootScope.editPage.show();
        showLoading();
        //查询说明书标签
        $rootScope.pageTag = [];
        $http({
          url: $rootScope.serviceAddress + 'getSmsLabelApp',
          method: 'POST',
          params: {
            id: $rootScope.page.id
          }
        }).success(function(res) {
          if (res.state == '1') {
            $rootScope.pageTag = res.datas;
            hideLoading();
          } else {
            alertMsg(res.message);
          }
        }).error(function() {
          ajaxFail();
        });
      });
    };
    $rootScope.serviceAddress = "http://www.immortalshealth.com/imkb/imkbapp/";
    $rootScope.imagePath = "http://www.immortalshealth.com/imkb/";
    // $rootScope.serviceAddress = "http://192.168.1.103:8080/imkb/";
    // $rootScope.serviceAddress = "http://192.168.1.103:8088/imkb/";

    $rootScope.login = function(id, psw) {
      showLoading('正在登录...');
      $http({
        url: $rootScope.serviceAddress + 'login',
        method: 'POST',
        params: {
          userName: id,
          password: psw
        },
        timeout: 10 * 1000
      }).success(function(res) {
        hideLoading();
        if (res.status == 1) {
          console.log(res);
          var userInfo = {
            id: id,
            psw: psw
          };
          localStorage.setItem('autoLogin', true);
          localStorage.setItem('sid', res.createUser);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          $state.go('index.search');
        } else {
          alertMsg(res.message);
        }
      }).error(function(res) {
        hideLoading();
        alertMsg('网络故障');
      });
    };

    // 获取单篇文章
    getDocument = function(id, callback) {
      var fn = callback || function() {};
      showLoading('数据正在加载中...');
      $http({
        url: $rootScope.serviceAddress + 'sms',
        params: {
          id: id
        }
      }).success(function(res) {
        fn(res);
        hideLoading();
      }).error(function(res, code) {
        hideLoading();
        alertMsg(code)
      });
    };
    //显示加载状态
    showLoading = function(text) {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-light">' + (text ? text : '数据加载中...') + '</ion-spinner>'
      });
    };
    //关闭加载状态
    hideLoading = function() {
        $ionicLoading.hide();
      }
      // alertMsg
    alertMsg = function(msg) {
      var alertPopup = $ionicPopup.alert({
        title: '温馨提示',
        template: msg
      });
      $timeout(function() {
        alertPopup.close();
      }, 3000);
    }
    ajaxFail = function() {
      var alertPopup = $ionicPopup.alert({
        title: '温馨提示',
        template: '网络错误'
      });
      $timeout(function() {
        alertPopup.close();
      }, 3000);
    }
    // 返回顶部
    iconGoTop = function(obj){
      $(obj).parents('.modal').find('ion-content.slider-bar-p:last').scrollTop(0);
    };
  })
  .factory('Pusher', function($ionicPopup, $state) {
    var pusher = null;
    return {
      onReceiveMessage: function(event) {
        if (pusher) {
          $ionicPopup.alert({
            title: '温馨提示',
            template: pusher.receiveMessage.message
          });
        };
      },
      onOpenNotification: function(event) {

        if (ionic.Platform.isAndroid()) {
          window.plugins.jPushPlugin.resetBadge();
        } //清除bradge
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
        var alertContent = null;
        if (pusher && ionic.Platform.isAndroid()) {
          alertContent = pusher.openNotification.alert;
        } else {
          alertContent = event.aps.alert;
        };
        console.log('onOpenNotification:', alertContent);
      },
      onReceiveNotification: function(event) {
        if (ionic.Platform.isAndroid()) {
          alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
        } else {
          alertContent = event.aps.alert;
        }

        console.log('onReceiveNotification', alertContent);
      },
      getRegistradionID: function() {
        return localStorage.getItem('jPushID', null);
      },
      resetBradge: function() {
        if (ionic.Platform.isAndroid()) {
          window.plugins.jPushPlugin.resetBadge();
        }
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);

      },
      init: function() {
        if (window.plugins && window.plugins.jPushPlugin) {
          pusher = window.plugins.jPushPlugin;
          // 初始化
          pusher.init();
          // 获取注册ID
          pusher.getRegistrationID(function(id) {
            localStorage.setItem('jPushID', id);
          });
          // 设置
          if (!ionic.Platform.isAndroid()) {
            pusher.setDebugModeFromIos();
            pusher.setApplicationIconBadgeNumber(0);
          } else {
            pusher.setDebugMode(true);
          };
        };
      }
    };
  })
  .filter('htmlContent',['$sce', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
}])

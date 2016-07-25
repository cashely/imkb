angular.module('starter.config', ['ionic', 'starter.controller', 'ngCordova', 'jett.ionic.filter.bar']).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.scrolling.jsScrolling(true);
  $ionicConfigProvider.backButton.previousTitleText(false).text('').icon('ion-ios-arrow-back');
  $stateProvider.state('index', {
      abstract: true,
      url: '/index',
      templateUrl: 'index.html',
      controller: function($state) {
        if (localStorage.getItem('autoLogin') == 'false' || !localStorage.getItem('autoLogin')) {
          // $state.go('login');
        }
      }
    }).state('index.search', {
      url: '/search',
      cache: false,
      views: {
        'index': {
          templateUrl: 'views/search.html',
          controller: 'indexSearchController'
        }
      }
    })
    //我的
    .state('index.member', {
      url: '/member',
      cache: false,
      views: {
        'member': {
          templateUrl: 'member.html',
          controller: function($scope, $state, $rootScope, $http) {
            $scope.isLogin = false;
            if(localStorage.getItem('sid')){
              $scope.isLogin = true;
            }
            $scope.loginOut = function() {
              localStorage.setItem('autoLogin', false);
              localStorage.removeItem('sid');
              $state.go('login');
            };
            // 获取收藏文章总数
            $http({
              url: $scope.serviceAddress + 'selectUserHouseCountApp',
              method: 'POST',
              params: {
                createUser: localStorage.getItem('sid')
              }
            }).success(function(res) {

              if (res.state == '1') {
                $scope.collectTotals = res.userHouseCount;
              }
            });
            //默认用户的所有个人信息个人信息

            //获取用户个人信息
            $scope.person = {};
            $scope.person = {
              headImgUrl:false,
              userAlias:'正在获取中...'
            }
            showLoading('正在加载....');
            $http({
              url: $scope.serviceAddress + 'getUserByIdApp',
              params: {
                createUser: localStorage.getItem('sid')
              },
              method: 'POST'
            }).success(function(res) {
              if(res.state ==1){
                $scope.person = res.datas;
              }else{
                $scope.person.userAlias = '暂未登录';
              }
              hideLoading();
            });
          }
        }
      }
    })
    // 客户中心.个人信息
    .state('index.member-data', {
      url: '/member/data',
      views: {
        'member': {
          templateUrl: 'member-data.html',
          controller: function($scope, $ionicPopup, $http) {
            // 修改密码

            $scope.data = {};
            $scope.person = {};
            // 请求数据
            $http({
              url: $scope.serviceAddress + 'getUserByIdApp',
              params: {
                createUser: localStorage.getItem('sid')
              },
              method: 'POST'
            }).success(function(res) {
              $scope.person.data = res.datas;
              console.log('用户信息', $scope.person.data);
            });
            $scope.editPassword = function() {

              var passwordPopup = $ionicPopup.show({
                template: '<input type="password" autofocus ng-model="data.password">',
                title: '请输入新密码',
                scope: $scope,
                buttons: [{
                  text: '取消'
                }, {
                  text: '<b>确定</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    $http({
                      url: $scope.serviceAddress + 'updateUserApp',
                      params: {
                        createUser: localStorage.getItem('sid'),
                        field: 'password',
                        fieldValue: $scope.data.password,
                        version: $scope.person.data.version
                      },
                      method: 'POST'
                    }).success(function(res) {
                      if (res.state == '1') {
                        var local = localStorage.getItem('userInfo');
                        local = JSON.parse(local);
                        local.psw = $scope.data.password;
                        localStorage.setItem('userInfo', JSON.stringify(local));
                        passwordPopup.close();
                        alertMsg(res.message);
                        $scope.person.data.version = res.datas.version;
                      }
                    })
                  }
                }, ]
              });
            };
            // 修改昵称
            $scope.editOthername = function() {
              $scope.data = {};
              var othernamePopup = $ionicPopup.show({
                template: '<input type="text" autofocus ng-model="data.othername">',
                title: '昵称修改',
                scope: $scope,
                buttons: [{
                  text: '取消'
                }, {
                  text: '<b>确定</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    $http({
                      url: $scope.serviceAddress + 'updateUserApp',
                      params: {
                        createUser: localStorage.getItem('sid'),
                        field: 'userAlias',
                        fieldValue: $scope.data.othername,
                        version: $scope.person.data.version
                      },
                      method: 'POST'
                    }).success(function(res) {
                      if (res.state == '1') {
                        othernamePopup.close();
                        alertMsg(res.message);
                        $scope.person.data.userAlias = $scope.data.othername;
                        $scope.person.data.version = res.datas.version;
                      }
                    })
                  }
                }, ]
              });
            };
            // 修改机构
            $scope.editOrganization = function() {
              $scope.data = {};
              var organizationPopup = $ionicPopup.show({
                template: '<input type="text" autofocus ng-model="data.organization">',
                title: '机构修改',
                scope: $scope,
                buttons: [{
                  text: '取消'
                }, {
                  text: '<b>确定</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    $http({
                      url: $scope.serviceAddress + 'updateUserApp',
                      params: {
                        createUser: localStorage.getItem('sid'),
                        field: 'agencyName',
                        fieldValue: $scope.data.organization,
                        version: $scope.person.data.version
                      },
                      method: 'POST'
                    }).success(function(res) {
                      if (res.state == '1') {
                        organizationPopup.close();
                        alertMsg(res.message);
                        $scope.person.data.agencyName = $scope.data.organization;
                        $scope.person.data.version = res.datas.version;
                      }
                    })
                  }
                }, ]
              });
            };
            // 修改邮箱
            $scope.editEmail = function() {
              $scope.data = {};
              var emailPopup = $ionicPopup.show({
                template: '<input type="text" autofocus ng-model="data.email">',
                title: '邮箱修改',
                scope: $scope,
                buttons: [{
                  text: '取消'
                }, {
                  text: '<b>确定</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    $http({
                      url: $scope.serviceAddress + 'updateUserApp',
                      params: {
                        createUser: localStorage.getItem('sid'),
                        field: 'email',
                        fieldValue: $scope.data.email,
                        version: $scope.person.data.version
                      },
                      method: 'POST'
                    }).success(function(res) {
                      if (res.state == '1') {
                        emailPopup.close();
                        alertMsg(res.message);
                        $scope.person.data.email = $scope.data.email;
                        console.log('修改后的信息', $scope.person.data);
                        $scope.person.data.version = res.datas.version;
                      }
                    })
                  }
                }, ]
              });
            }
          }
        }
      }
    })
    //客户中心.产品介绍
    .state('index.member-produceList', {
      url: '/member/produceList',
      views: {
        'member': {
          templateUrl: 'member-produceList.html',
          controller: function($scope, $cordovaInAppBrowser) {
            $scope.openBrower = function() {
              $cordovaInAppBrowser.open('http://www.baidu.com', '_blank', {
                location: 'no'
              })
            };
          }
        }
      }
    })
    //客户中心.历史服务单
    .state('index.member-serviceList', {
      url: '/member/serviceList',
      views: {
        'member': {
          templateUrl: 'member-serviceList.html',
          controller: function($scope) {

          }
        }
      }
    })
    //客户中心.个人收藏
    .state('index.member-collect', {
      url: '/member/collect',
      views: {
        'member': {
          templateUrl: 'member-collect.html',
          controller: function($scope, $http) {
            $scope.isLoadCollectMore = true;
            var p = 1,
              ps = 10;
            $scope.collectList = [];
            $scope.collectLoadMore = function() {
              $http({
                url: $scope.serviceAddress + 'selectUserHouseApp',
                method: 'POST',
                params: {
                  createUser: localStorage.getItem('sid'),
                  pageNo: p,
                  pageSize: ps
                }
              }).success(function(res) {
                if (res.state == '1') {
                  p++;
                  $scope.collectList = $scope.collectList.concat(res.datas);
                }
                if ($scope.collectList.length >= res.totalSize) {
                  $scope.isLoadCollectMore = false;
                }
                hideLoading();
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }).error(function() {
                ajaxFail();
                hideLoading();
                $scope.$broadcast('scroll.infiniteScrollComplete');
              });
            };
            // 取消收藏
            $scope.deleteCollect = function(cid, tid) {
              $http({
                url: $scope.serviceAddress + "deleteUserHouseApp",
                method: 'POST',
                params: {
                  createUser: localStorage.getItem('sid'),
                  sourceId: tid,
                  indexPath: '5241e1d1ef224c6db86356560bf6ddd5'
                }
              }).success(function(res) {
                if (res.state == '1') {
                  $scope.collectList.splice(cid, 1);
                  console.log(cid);
                  alertMsg(res.message);
                } else {
                  alertMsg(res.message);
                }
              }).error(function() {
                ajaxFail();
              });
            }
          }
        }
      }
    })
    //客户中心.软件推荐
    .state('index.member-push', {
      url: '/member/push',
      views: {
        'member': {
          templateUrl: 'views/member-push.html'
        }
      }
    })
    //关于
    .state('index.about', {
      url: '/about',
      views: {
        'about': {
          templateUrl: 'about.html',
          // controller: 'memberController'
        }
      }
    })
    // 在线服务
    .state('index.service', {
      url: '/service',
      cache: false,
      views: {
        'service': {
          templateUrl: 'views/service-list.html',
          controller: 'serviceListController'
        }
      }
    })
    // 意见反馈列表
    .state('index.service-feedback', {
      url: '/service/feedback',
      cache: false,
      views: {
        'service': {
          templateUrl: 'views/service-feedback.html',
          controller: function($scope, $http) {
            var p = 1,
              ps = 10;
            $scope.isScrollServiceFeedbackList = true;
            $scope.serviceFeedbackList = [];
            $scope.loadMoreServiceFeedbackList = function() {
              $http({
                url: $scope.serviceAddress + 'selectOnlineApp',
                method: 'POST',
                params: {
                  createUser: localStorage.getItem('sid'),
                  pageNo: p,
                  pageSize: ps
                }
              }).success(function(res) {
                if (res.state == '1') {
                  p++;
                  $scope.serviceFeedbackList = $scope.serviceFeedbackList.concat(res.datas);

                  if ($scope.serviceFeedbackList.length >= res.totalSize) {
                    $scope.isScrollServiceFeedbackList = false;
                  }
                } else {
                  alertMsg(res.message);
                };
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }).error(function() {
                ajaxFail();
                $scope.$broadcast('scroll.infiniteScrollComplete');
              });
            }

          }
        }
      }
    })
    .state('index.service-edit', {
      url: '/service/edit',
      cache: false,
      views: {
        'service': {
          templateUrl: 'views/service-edit.html',
          controller: function($scope, $http) {
            var p = 1,
              ps = 10;
            $scope.isScrollServiceEditList = true;
            $scope.serviceEditList = [];
            $scope.loadMoreServiceEditList = function() {
              $http({
                url: $scope.serviceAddress + 'selectSmsRecoveryApp',
                method: 'POST',
                params: {
                  createUser: localStorage.getItem('sid'),
                  pageNo: p,
                  pageSize: ps
                }
              }).success(function(res) {
                if (res.state == '1') {
                  p++;
                  $scope.serviceEditList = $scope.serviceEditList.concat(res.datas);

                  if ($scope.serviceEditList.length >= res.totalSize) {
                    $scope.isScrollServiceEditList = false;
                  }
                } else {
                  alertMsg(res.message);
                };
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }).error(function() {
                ajaxFail();
                $scope.$broadcast('scroll.infiniteScrollComplete');
              });
            }

          }
        }
      }
    })
    // 查看说明书纠错
    .state('index.service-edit-page', {
      url: '/service/edit/page/:id',
      views: {
        'service': {
          templateUrl: 'views/service-edit-page.html',
          controller: function($scope, $http, $state) {
            showLoading();
            $scope.serviceEditPage = [];
            $http({
              url: $scope.serviceAddress + 'selectSmsRecoveryByIdSeeApp',
              method: 'POST',
              params: {
                id: $state.params.id
              }
            }).success(function(res) {
              if (res.state == '1') {
                $scope.serviceEditPage = res.datas;
              } else {
                alertMsg(res.message);
              }
              hideLoading();
            }).error(function() {
              ajaxFail();
              hideLoading();
            });
          }
        }
      }
    })
    // 添加说明书纠错
    .state('index.service-add', {
      url: '/service/add',
      views: {
        'service': {
          templateUrl: 'service-add.html',
          controller: function($scope, $rootScope, $http,$state) {
            $scope.service = {};
            $scope.serviceCommit = function() {
              if (!$scope.service.content) {
                hideLoading();
                alertMsg('请填写反馈内容');
                return;
              }
              showLoading();
              $http({
                url: $scope.serviceAddress + 'insertOnlineApp',
                method: 'POST',
                params: {
                  createUser: localStorage.getItem('sid'),
                  needs: $scope.service.content
                }
              }).success(function(res) {
                hideLoading();
                alertMsg(res.message);
                $state.go('index.service-feedback');

              }).error(function() {
                ajaxFail();
                hideLoading();
              });
            }
          }
        }
      }
    })
    // 查看反馈建议
    .state('index.service-check', {
      url: '/service/check/:id',
      views: {
        'service': {
          templateUrl: 'service-page.html',
          controller: function($scope, $state, $http) {
            $http({
              url: $scope.serviceAddress + 'selectOnlineByIdSeeApp',
              method: 'POST',
              params: {
                id: $state.params.id
              }
            }).success(function(res) {
              if (res.state == '1') {
                $scope.serviceFeedbackPage = res.datas;
              } else {
                alertMsg(res.message);
              }
              hideLoading();
            }).error(function() {
              ajaxFail();
              hideLoading();
            });
          }
        }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: function($scope, $http, $state,$ionicPlatform,$rootScope) {
        
        if (localStorage.getItem('sid')) {
          (function(info) {
            // var scope = "snsapi_userinfo";
            if (localStorage.getItem('autoLogin') == 'true') {
                // 自动登录需要请求地址
                showLoading();
                $http({
                  url:$scope.serviceAddress + 'login',
                  method:'POST',
                  params:{
                    userId:localStorage.getItem('sid')
                  }
                }).success(function(res){
                  if(res.state != 1){
                    alertMsg(res.message);
                  }else{
                    $state.go('index.search');
                  }
                  hideLoading();
                }).error(function(code){
                  hideLoading();
                  alertMsg('网络故障');
                });

            }
          })(localStorage.getItem('sid'));
        }
        $scope.wechatLogin = function() {
            var scope = "snsapi_userinfo";
            Wechat.isInstalled(function (installed) {
              if(installed){
                  Wechat.auth(scope, function(response) {    // you may use response.code to get the access token.
                  //     alert(JSON.stringify(response));
                  showLoading('正在登录...');
                  $http({
                    url:$scope.serviceAddress + 'login',
                    method:'POST',
                    params:{
                      code:response.code
                    }
                  }).success(function(res){
                    if(res.state == 1){
                      hideLoading();
                      localStorage.setItem('autoLogin','true');
                      localStorage.setItem('sid', res.userId);
                      $state.go('index.search');
                    }else{
                      alertMsg(res.message);
                    }
                  })
                }, function(reason) {
                  alertMsg(reason);
                  //     alert("Failed: " + reason);
                });
              }else{
                alertMsg('请安装微信后重试！');
              }
            })
        }
      }

    })
    .state('reg', {
      url: '/reg',
      abstract: true,
      templateUrl: 'views/reg.html'
    })
    .state('reg.code', {
      url: '/code',
      views: {
        'reg': {
          templateUrl: 'views/reg-code.html',
          controller: function($scope, $http, $state, $ionicModal) {
            $scope.form = {
              isClickGetCode: false,
              setDeadTime: 60
            };
            $scope.getCode = function(num) {
              $scope.form.isClickGetCode = true;
              $http({
                url: $scope.serviceAddress + 'register',
                params: {
                  phoneNo: num
                }
              }).success(function(res) {
                if (res.status == 1) {
                  alertMsg(res.message);
                  var t = setInterval(function() {
                    if ($scope.form.setDeadTime > 1) {
                      $scope.form.setDeadTime--;
                      $scope.$apply();
                    } else {
                      $scope.form.setDeadTime = 60;
                      clearInterval(t);
                      $scope.form.isClickGetCode = false;
                      $scope.$apply();
                    }
                  }, 1000);
                } else {
                  alertMsg(res.message);
                }
              }).error(function(res, code) {
                alertMsg(code);
              });
            };
            $scope.subReg = function(num, code) {
              $http({
                url: $scope.serviceAddress + 'validateInfo',
                params: {
                  phoneNo: num,
                  validateNum: code
                }
              }).success(function(res) {
                if (res.status == 1) {
                  // 存储默认用户名跟密码到localStorage
                  localStorage.setItem('userInfo', JSON.stringify({
                    'id': num,
                    'psw': num.slice(-6)
                  }));
                  $state.go('index.search');
                }
              }).error(function(res, code) {
                ajaxFail();
              });
            };

            // 用户协议
            $ionicModal.fromTemplateUrl('views/single.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.singleModal = modal;
            });
            $scope.showSingleModal = function() {
              $scope.singleModal.show();
            };
            $scope.hideSingleModal = function() {
              $scope.singleModal.hide();
            };
          }
        }
      }
    })
    .state('reg.form', {
      url: '/form',
      views: {
        'reg': {
          templateUrl: 'views/reg-form.html'
        }
      }
    });
  $urlRouterProvider.otherwise('/index/search');
})

angular.module('starter.config', ['ionic', 'starter.controller', 'ngCordova','jett.ionic.filter.bar']).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicFilterBarConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    
    // $cordovaStatusbar.styleHex('#000');
    $ionicConfigProvider.backButton.previousTitleText(false).text('').icon('ion-ios-arrow-back');
    $stateProvider.state('index', {
            abstract: true,
            url: '/index',
            templateUrl: 'views/index.html',
            controller:function($state){
            	if(localStorage.getItem('autoLogin') == 'false' || !localStorage.getItem('autoLogin')){
            		$state.go('login');
            	}
            }
        }).state('index.search', {
            url: '/search',
            cache:true,
            views: {
                'index': {
                    templateUrl: 'views/search.html',
                    controller:function($scope,$http,$ionicModal,$rootScope){
                    	showLoading();
                    	var page = 0;
                    	$scope.indexData = [];
    					$scope.canLoadMore = function(){
    						if($scope.indexData && $scope.indexData.length >= $scope.len ){
    							return false;
    						}else{
    							return true;
    						}
    					}
    					
    					$scope.loadMore = function(){
    						if($scope.isLoad) return;
    						$scope.isLoad = true;
    						page++;
    						$http({
	    						url:$scope.serviceAddress + 'indexImkbApp',
	    						params:{
	    							pageNo : page,
	    							pageSize : 10
	    						}
	    					}).success(function(res){
	    						for(v in res.rows){
	    							($scope.indexData).push(res.rows[v]);
                                    console.log(res.rows[v]);
	    						}

	    						console.log($scope.indexData);
	    						$scope.isLoad = false;
	    						hideLoading();
	    						$scope.$broadcast('scroll.infiniteScrollComplete');
	    					}).error(function(res,code){
	    						alertMsg('232');
	    					});
    					};
                    }
                }
            }
        })
        //我的
        .state('index.member', {
            url: '/member',
            views: {
                'member': {
                    templateUrl: 'views/member.html',
                    controller: function($scope,$state,$rootScope){
                    	$scope.loginOut = function(){
                    		localStorage.setItem('autoLogin',false);
                    		$state.go('login');
                    	}

                    }
                }
            }
        })
        // 客户中心.个人信息
        .state('index.member-data',{
        	url:'/member/data',
        	views:{
        		'member':{
        			templateUrl:'views/member-data.html',
        			controller:function($scope,$ionicPopup){
        				// 修改密码
        				$scope.data = {};
        				$scope.editPassword = function(){
        					
        					var passwordPopup = $ionicPopup.show({
        						template:'<input type="password" ng-model="data.password">',
        						title: '请输入新密码',
        						scope: $scope,
        						buttons: [
									       { text: '取消' },
									       {
									         text: '<b>确定</b>',
									         type: 'button-positive',
									         onTap: function(e) {
									           if (!$scope.data.password) {
									             //不允许用户关闭，除非他键入wifi密码
									             e.preventDefault();
									           } else {
									             console.log($scope.data.password);
									           }
									         }
									       },
									     ]
        					});
        				};
        				// 修改昵称
        				$scope.editOthername = function(){
        					$scope.data = {};
        					var othernamePopup = $ionicPopup.show({
        						template:'<input type="text" ng-model="data.othername">',
        						title: '昵称修改',
        						scope: $scope,
        						buttons: [
									       { text: '取消' },
									       {
									         text: '<b>确定</b>',
									         type: 'button-positive',
									         onTap: function(e) {
									           if (!$scope.data.othername) {
									             //不允许用户关闭，除非他键入wifi密码
									             e.preventDefault();
									           } else {
									             console.log($scope.data.othername);
									           }
									         }
									       },
									     ]
        					});
        				};
        				// 修改昵称
        				$scope.editOrganization = function(){
        					$scope.data = {};
        					var organizationPopup = $ionicPopup.show({
        						template:'<input type="text" ng-model="data.organization">',
        						title: '机构修改',
        						scope: $scope,
        						buttons: [
									       { text: '取消' },
									       {
									         text: '<b>确定</b>',
									         type: 'button-positive',
									         onTap: function(e) {
									           if (!$scope.data.organization) {
									             //不允许用户关闭，除非他键入wifi密码
									             e.preventDefault();
									           } else {
									             console.log($scope.data.organization);
									           }
									         }
									       },
									     ]
        					});
        				};
        				// 修改昵称
        				$scope.editEmail = function(){
        					$scope.data = {};
        					var emailPopup = $ionicPopup.show({
        						template:'<input type="text" ng-model="data.email">',
        						title: '邮箱修改',
        						scope: $scope,
        						buttons: [
									       { text: '取消' },
									       {
									         text: '<b>确定</b>',
									         type: 'button-positive',
									         onTap: function(e) {
									           if (!$scope.data.email) {
									             //不允许用户关闭，除非他键入wifi密码
									             e.preventDefault();
									           } else {
									             console.log($scope.data.email);
									           }
									         }
									       },
									     ]
        					});
        				}
        			}
        		}
        	}
        })
        //客户中心.产品介绍
        .state('index.member-produceList',{
        	url:'/member/produceList',
        	views:{
        		'member':{
        			templateUrl:'views/member-produceList.html',
        			controller:function($scope,$cordovaInAppBrowser){
        				$scope.openBrower = function(){
        					$cordovaInAppBrowser.open('http://www.baidu.com','_blank',{location:'no'})
        				};
        			}
        		}
        	}
        })
        //客户中心.历史服务单
        .state('index.member-serviceList',{
        	url:'/member/serviceList',
        	views:{
        		'member':{
        			templateUrl:'views/member-serviceList.html',
        			controller:function($scope){
        				
        			}
        		}
        	}
        })
        //客户中心.个人收藏
        .state('index.member-collect',{
        	url:'/member/collect',
        	views:{
        		'member':{
        			templateUrl:'views/member-collect.html'
        		}
        	}
        })
        //客户中心.软件推荐
        .state('index.member-push',{
        	url:'/member/push',
        	views:{
        		'member':{
        			templateUrl:'views/member-push.html'
        		}
        	}
        })
        //关于
        .state('index.about', {
            url: '/about',
            views: {
                'about': {
                    templateUrl: 'views/about.html',
                    // controller: 'memberController'
                }
            }
        })
        // 在线服务
        .state('index.service',{
        	url:'/service',
        	views:{
        		'service':{
        			templateUrl:'views/service.html',
        			controller:function($scope){
        				var accordion = UIkit.accordion('.uk-accordion', { showfirst:false });
        			}
        		}
        	}
        })
        // 添加服务单
        .state('index.service-add',{
        	url:'/service/add',
        	views:{
        		'service':{
        			templateUrl:'views/service-add.html',
        			controller:function($scope){
        				console.log($scope.serviceAddress);
        				$scope.choiceProduce = function(val,radio){
                            console.log(val);
                            console.log(radio);
                        }
        			}
        		}
        	}
        })
        // 查看服务单
        .state('index.service-check',{
        	url:'/service/check/:id',
        	views:{
        		'service':{
        			templateUrl:'views/service-page.html',
        			controller:function($scope,$state){
        				$scope.id = $state.params.id;
        			}
        		}
        	}
        })
        .state('login',{
        	url:'/login',
        	templateUrl:'views/login.html',
        	controller: function($scope,$http,$state){
        		if(localStorage.getItem('userInfo')){
            			(function(info){
            				var localInfo = JSON.parse(info);
            				$scope.username = localInfo.id,
            				$scope.password = localInfo.psw;
            				if(localStorage.getItem('autoLogin') == 'true'){
            					$scope.login($scope.username,$scope.password);
            				}
            			})(localStorage.getItem('userInfo'));
            		}
            	$scope.checkLogin = function(){
            		var  u = $scope.username,p = $scope.password;
            		$scope.login(u,p);
            	}
            }
        })
        .state('reg',{
        	url:'/reg',
        	abstract:true,
        	templateUrl:'views/reg.html'
        })
        .state('reg.code',{
        	url:'/code',
        	views:{
        		'reg':{
        			templateUrl:'views/reg-code.html',
        			controller:function($scope,$http,$state){

        				$scope.getCode = function(num){
        					$http({
        						url:$scope.serviceAddress + 'register',
        						params:{
        							phoneNo : num
        						}
        					}).success(function(res){
        						if(res.status == 1){
        							alertMsg(res.message);
        						}else{
                                    alertMsg(res.message);
                                }
        					}).error(function(res,code){
        						alertMsg(code);
        					});
        				};
        				$scope.subReg = function(num,code){
        					$http({
        						url:$scope.serviceAddress + 'validateInfo',
        						params:{
        							phoneNo : num,
        							validateNum : code
        						}
        					}).success(function(res){
        						if(res.status == 1){
                                    // 存储默认用户名跟密码到localStorage
        							localStorage.setItem('userInfo',JSON.stringify({'id':num,'psw':num.slice(-6)}));
        							$state.go('index.search');
        						}
        					}).error(function(res,code){
        						ajaxFail();
        					});
        				}
        			}
        		}
        	}
        })
        .state('reg.form',{
        	url:'/form',
        	views:{
        		'reg':{
        			templateUrl:'views/reg-form.html'
        		}
        	}
        });
    $urlRouterProvider.otherwise('/login');
})
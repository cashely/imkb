angular.module('starter.controller',[])
.controller('index',function($scope){})
.controller('searchModalController',function ($scope,$http,$rootScope){
	$scope.searchList = [];
	$scope.searchHistory = [];
	var localSearch = (localStorage.getItem('searchHistory') == null ? '' : localStorage.getItem('searchHistory'));
	if(localSearch.length != 0){
		$scope.searchHistory = localSearch.split(',').slice(0,10).reverse();
	}
	console.log('初始化时拿到的搜索历史:',$scope.searchHistory);
	var pageNum = 1,pageSize = 10;
	$scope.isScroll = false;
	$scope.actionSearch = function(){
		if(!$scope.queryKeys || $scope.queryKeys.length == 0 ) return false;
		pageNum = 1;
		$scope.searchList = [];
		localSearch = (localStorage.getItem('searchHistory') == null ? '' : localStorage.getItem('searchHistory'));
		console.log('搜索字符串：',$scope.queryKeys);
		// 判断是否为重复搜索条件
		if($scope.searchHistory.indexOf($scope.queryKeys) == '-1'){
			$scope.searchHistory.push($scope.queryKeys);
			localStorage.setItem('searchHistory',localSearch + (localSearch == '' ? '' : ',') + $scope.queryKeys);
		}
		$scope.searchInfinite();
	};
	$scope.searchInfinite = function(){
		$http({
			url:$scope.serviceAddress + 'searchApp',
			method:'POST',
			params:{
				queryStr:$scope.queryKeys,
				pageNo:pageNum,
				indexPath : '5241e1d1ef224c6db86356560bf6ddd5'
			}
		}).success(function(res){
				$scope.searchList = $scope.searchList.concat(res.rows);
				pageNum++;
			if(res.rows.length >= res.totalSize){
				$scope.isScroll = false;
			}else{
				$scope.isScroll = true;
			}
			console.log('搜索结果',$scope.searchList.concat(res.rows));
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}).error(function(){
			$scope.isScroll = false;
			ajaxFail();
		});
	}
	$scope.hideSearch = function(){
		$scope.queryKeys = '';
		$scope.searchList = [];
		$rootScope.searchModal.hide();
	}
	$scope.searchSub = function(str){
		$scope.queryKeys = str;
		$scope.actionSearch();
	};
	$scope.searchInputChange = function(){
		if($scope.queryKeys.length !=0 ){
			$scope.isShowClearSearch = true;
		}else{
			$scope.isShowClearSearch = false;
		}
		console.log($scope.queryKeys.length);
	}
	// 清空搜索框
	$scope.clearSearchKeys = function(e){
		$scope.queryKeys = '';
		$scope.isShowClearSearch = false;
		$('#searchInput').focus();
	};
	// 清空搜索历史
	$scope.clearSearchHistory = function(){
		localStorage.setItem('searchHistory','');
		$scope.searchHistory = [];
	}
})
.controller('shareController',function($scope){
	$scope.shareAll = function(){
		window.plugins.socialsharing.share('Message only');
	};
	// 分线给QQ好友
	$scope.shareQQ = function(){
		var args = {};
		args.url = "http://www.immortalshealth.com";
		args.title = "常春树·药--医疗行业知识宝藏";
		args.description = "常春树·药是一款为医生、药师等专业人士度身定做的药学软件，旨在为临床医生、药师、护士及医疗人员提供便捷的药物信息查询工具，并根据临床医生实际工作流程进行优化设计";
		args.imageUrl = "http://www.immortalshealth.com/pubshare/imkb-share-logo.png";
		args.appName = "常春树·药";
		YCQQ.shareToQQ(function(){
		    console.log("share success");
		},function(failReason){
		    console.log(failReason);
		},args);
	};
	// 分享到qq空间
	$scope.shareQQzone = function($scope){
		var args = {};
	 	args.url = "http://www.immortalshealth.com";
		args.title = "常春树·药--医疗行业知识宝藏";
		args.description = "常春树·药是一款为医生、药师等专业人士度身定做的药学软件，旨在为临床医生、药师、护士及医疗人员提供便捷的药物信息查询工具，并根据临床医生实际工作流程进行优化设计";
		 var imgs =['http://www.immortalshealth.com/pubshare/imkb-share-logo.png',
		 'http://www.immortalshealth.com/pubshare/imkb-share-logo.png',
		 'http://www.immortalshealth.com/pubshare/imkb-share-logo.png'];
		  args.imageUrl = imgs;
		  YCQQ.shareToQzone(function () {
		      console.log("share success");
		  }, function (failReason) {
		      console.log(failReason);
		  }, args);
	};
	// 分享到微信
	$scope.shareWechat = function($scope){
		Wechat.share({
			message:{
				title:"常春树·药--医疗行业知识宝藏",
				description:"常春树·药是一款为医生、药师等专业人士度身定做的药学软件，旨在为临床医生、药师、护士及医疗人员提供便捷的药物信息查询工具，并根据临床医生实际工作流程进行优化设计",
				thumb:"http://www.immortalshealth.com/pubshare/imkb-share-logo.png",
				media:{
					type: Wechat.Type.LINK,
					webpageUrl: "http://www.immortalshealth.com"
				}
			},
			scene:Wechat.Scene.SESSION
		},function(){
			console.log('success');
		},function(res){
			cosole.log('failed',res);
		});
	};
	// 分享到朋友圈
	$scope.shareWechatFriends = function($scope){
		Wechat.share({
			message:{
				title:"常春树·药--医疗行业知识宝藏",
				description:"常春树·药是一款为医生、药师等专业人士度身定做的药学软件，旨在为临床医生、药师、护士及医疗人员提供便捷的药物信息查询工具，并根据临床医生实际工作流程进行优化设计",
				thumb:"http://www.immortalshealth.com/pubshare/imkb-share-logo.png",
				media:{
					type: Wechat.Type.LINK,
					webpageUrl: "http://www.immortalshealth.com"
				}
			},
			scene:Wechat.Scene.TIMELINE
		},function(){
			console.log('success');
		},function(res){
			cosole.log('failed',res);
		});
	}
})
.controller('editPageController',function($scope,$rootScope,$http){
	$scope.edit={};
	$scope.editCommit = function(){

		if(!$scope.edit.tag){
			alertMsg('请选择纠错标签');
			return;
		}
		if(!$scope.edit.content){
			alertMsg('请填写纠错内容');
			return;
		}
		showLoading();
		console.log($scope);
		$http({
			url : $rootScope.serviceAddress+'insertSmsRecoveryApp',
			method:'POST',
			params:{
				createUser:localStorage.getItem('sid'),
				smsId:$rootScope.page.id,
				errContent:$scope.edit.tag.target,
				errResult:$scope.edit.content,
				errBasis:$scope.edit.source ? $scope.edit.source : null
			}
		}).success(function(res){
			if(res.state=='1'){
				alertMsg(res.message + ',感谢您的付出！');
			}else{
				alertMsg(res.message);
			}
			hideLoading();
		}).error(function(){
			ajaxFail();
			hideLoading();
		});
	}
	$rootScope.hideEditPage = function(){
		$rootScope.editPage.remove();
	};
})
.controller('serviceListController',function($scope,$http){
	$scope.listTotal = {};
	$http({
		url:$scope.serviceAddress + 'selectOnlineSmsCountApp',
		method:'POST',
		params:{
			createUser:localStorage.getItem('sid')
		}
	}).success(function(res){
		if(res.state == '1'){
			$scope.listTotal = res;
		}
	}).error(function(){
		ajaxFail();
	});

})
.controller('pageAllController',function($scope,$rootScope,$http){
	showLoading();
	$http({
		url:$rootScope.serviceAddress + 'showSmsFullApp',
		method:'POST',
		timeout:60 * 1000,
		params:{
			id:$rootScope.page.id,
			sign:1,
			indexPath:'5241e1d1ef224c6db86356560bf6ddd5',
			imagePath:$rootScope.imagePath,
			createUser:localStorage.getItem('sid')
		}
	}).success(function(res){
		console.log('文章结果',res);
		$scope.pageAll = {};
		for(var k in $rootScope.page){
			$scope.pageAll[k] = $rootScope.page[k];
		}
		$scope.pageAll.sms = res.sms;
		console.log('全版说明书',$scope.pageAll);
		hideLoading();
	}).error(function(){
		hideLoading();
		ajaxFail();
	});
	$scope.hideAllPage = function(){
		$rootScope.pageAllModal.remove();
	};
})
.controller('indexSearchController',function($scope, $http, $ionicModal, $rootScope, $timeout, $ionicSlideBoxDelegate){
	showLoading();
    var page = 0;
    $scope.indexData = [];
    $scope.canLoadMore = function() {
      if ($scope.indexData && $scope.indexData.length >= $scope.len) {
        return false;
      } else {
        return true;
      }
    }
    $scope.loadMore = function() {
      if ($scope.isLoad) return;
      $scope.isLoad = true;
      page++;
      $http({
        url: $scope.serviceAddress + 'indexImkbApp',
        params: {
          pageNo: page,
          pageSize: 10,
          indexPath: '5241e1d1ef224c6db86356560bf6ddd5'
        }
      }).success(function(res) {
        for (v in res.rows) {
          ($scope.indexData).push(res.rows[v]);
        }
        $scope.isLoad = false;
        hideLoading();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).error(function(res, code) {
        alertMsg('232');
      });
    };
})

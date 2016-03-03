angular.module('starter.controller',[])
.controller('index',function($scope){})
.controller('searchModalController',function ($scope,$http,$rootScope){
	$scope.searchList = [];
	$scope.searchHistory = [];
	var localSearch = (localStorage.getItem('searchHistory') == null ? '' : localStorage.getItem('searchHistory'));
	if(localSearch.length != 0){
		$scope.searchHistory = localSearch.split(',');
	}
	console.log('初始化时拿到的搜索历史:',$scope.searchHistory);
	var pageNum = 0,pageSize = 20;
	$scope.isScroll = false;
	$scope.actionSearch = function(){
		$scope.searchList = [];
		localSearch = (localStorage.getItem('searchHistory') == null ? '' : localStorage.getItem('searchHistory'));
		console.log('搜索字符串：',$scope.queryKeys);
		// 判断是否为重复搜索条件
		if($scope.searchHistory.indexOf($scope.queryKeys) == '-1'){
			$scope.searchHistory.push($scope.queryKeys);
			localStorage.setItem('searchHistory',localSearch + (localSearch == '' ? '' : ',') + $scope.queryKeys);
		}
		pageNum++;
		$http({
			url:$scope.serviceAddress + 'searchApp',
			method:'POST',
			params:{
				queryStr:$scope.queryKeys,
				pageNo:pageNum
			}
		}).success(function(res){
			$scope.searchResult  = res;
			if(res.rows.length == 0){
				$scope.isScroll = false;
			}else{
				for(n in res.rows){
					$scope.searchList.push(res.rows[n]);
	                console.log(res.rows[n]);
				}
			}
			console.log($scope.searchList);
		});
		$scope.isScroll = true;
	};
	$scope.searchInfinite = function(){
		pageNum++;
		$http({
			url:$scope.serviceAddress + 'searchApp',
			method:'POST',
			params:{
				queryStr:$scope.queryKeys,
				pageNo:pageNum
			}
		}).success(function(res){
			$scope.searchResult  = res;
			if(res.rows.length == 0){
				$scope.isScroll = false;
			}else{
				for(n in res.rows){
					$scope.searchList.push(res.rows[n]);
	                console.log(res.rows[n]);
				}
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
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
	}
})
.controller('shareController',function($scope){
	$scope.shareAll = function(){
		window.plugins.socialsharing.share('Message only');
	};
	$scope.shareQQ = function(){
		var args = {};
		args.url = "http://www.utimor.com";
		args.title = "临床诊疗助手--医疗行业知识宝藏";
		args.description = "临床诊疗助手是一款为医生、药师等专业人士度身定做的药学软件，旨在为临床医生、药师、护士及医疗人员提供便捷的药物信息查询工具，并根据临床医生实际工作流程进行优化设计";
		args.imageUrl = "http://www.utimor.com/wp-content/themes/ntimor/images/logo.png";
		args.appName = "临床诊疗助手";
		YCQQ.shareToQQ(function(){
		    console.log("share success");
		},function(failReason){
		    console.log(failReason);
		},args);
	}
})
var app = angular.module('webApp', ['ngRoute']);
var urlLogin = "#/login"

app.config(function ($routeProvider) 
{
    $routeProvider.
    when('/home', 
		{
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    }).
    when('/login', 
		{
      templateUrl: 'views/login.html',
			controller: 'LoginController'
    }).
		 when('/about-us', 
		{
      templateUrl: 'views/about-us.html'
    }).
		when('/gym-room', 
		{
      templateUrl: 'views/gym-room.html',
			controller: 'GymRoomController'
    }).
		when('/gym-room-list', 
		{
      templateUrl: 'views/gym-room-list.html',
			controller: 'GymRoomListController'
    }).
		when('/favorite', 
		{
      templateUrl: 'views/favorite.html',
			controller: 'FavoriteController'
    }).
		when('/contact-us', 
		{
      templateUrl: 'views/contact-us.html'
    }).
		when('/quitting-smoking', 
		{
      templateUrl: 'views/quitting-smoking.html',
			controller: 'QuittingSmokingController'
    }).
    otherwise(
		{
    	redirectTo: '/home'
    });
});

app.controller('QuittingSmokingController', ['$scope', '$window', function ($scope, $window) 
{	
	angular.element(document).ready(function () 
	{
		
	});
	angular.element($window).bind('resize', function()
	{
		
	});
}]);

app.controller('FavoriteController', ['$scope', function($scope)
{
	angular.element(document).ready(function ($http) 
	{
		var fav = {};
				fav.act = "postFavourite";
    var temp = "",
				num = "";
		$.ajax({
			url: "#/favorite",
			type: "POST",
			data: fav,
			dataType: 'json',
			success: function (result) 
			{				
				for (i = 0; i < result.length; i++) 
				{	
					if ((i % 2) === 0) {
						num = "odd"
					} else{
						num = "even"
					}
					temp+= "<tr class="+num+">";
					temp+= "<td><span id=\"ff"+i+"\">"+result[i]["name"]+"</span></td>";
					temp+= "<td>"+result[i]["address"]+"</td>";
					temp+= "<td>"+result[i]["phone"]+"</td>";
					temp+= "<td class='icon'><a href='javascript:' onclick='remove("+i+")'><img src='files/img/remove.png' alt='remove'></a></td>";
					temp+= "</tr>";
				}
				$("#favorite-list tbody").html(temp);
				console.log(result);
				if(result.status == 200){
						console.log("hope can see here");
				}	
      },
    	error: function(result){
        console.log(result);
    	}
		});
		return false;
	});
}]);

app.controller('GymRoomListController', ['$scope','$http', function($scope, $http)
{
	$http.get('files/json/facility-fitrm.json').success(function (data)
	{
		$scope.posts = data;
		$scope.search = function(item) 
		{
   		if (!$scope.query || (item.Name_en.toLowerCase().indexOf($scope.query) != -1) || (item.Address_en.toLowerCase().indexOf($scope.query) != -1) || (item.Phone.toLowerCase().indexOf($scope.query) != -1))
			{
        return true;
    	}
    return false;
		};	
		$scope.addFavorite = function(name, address, phone)
		{
			if (confirm("Do you want to add this photo in your favourite list?"))
			{
				addFavorite(name, address, phone);
			}
		}
		
	}).error(function(data, status) {
		alert("Request failed")
  });

}]);

app.controller('GymRoomController', ['$scope', '$window', function ($scope, $window) 
{
	angular.element(document).ready(function () 
	{
		gymRoom();
	});
	angular.element($window).bind('resize', function()
	{
		gymRoom();
	});
	function gymRoom() 
	{
		$('#gym-room').css(
		{
			'height' : $(window).height() - $('header').height()
		});
		if (localStorage.getItem("username") != null) 
		{
			$('#gym-room').css(
			{
				'cursor' : 'pointer'
			});
			$('#gym-room').click(function() 
			{
				window.location.href = '#/gym-room-list';
			});
		}
	}
}]);

app.controller('LoginController', ['$scope', function ($scope) 
{
	angular.element(document).ready(function ($http) 
	{
		$("#login-form-link").click(function(e) 
		{
			$("#login-form").delay(100).fadeIn(100);
			$("#register-form").fadeOut(100);
			$("#register-form-link").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
		});
		$("#register-form-link").click(function(e) 
		{
			$("#register-form").delay(100).fadeIn(100);
			$("#login-form").fadeOut(100);
			$("#login-form-link").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
		});
		$("#register-submit").click(function(e)
		{
			var user = {};
			user.act = "register";
			user.ac = $("input[name='ac']").val();
			user.pw = $("input[name='pw']").val();
			user.email = $("input[name='email']").val();
			var repw = $("input[name='confirm-password']").val();	
			if(user.ac === "" || user.pw === "" || repw === "" || user.email === "")
			{
				alert("Please input all infomration!");
			} else if (repw != user.pw){
				alert("Please input same password at repeat password!");
			} else 
			{
				$.ajax({
					url: urlLogin,
					type: "POST",
					data: user,
					datatype: "json",
					success: function (result) {
						console.log(result)
					},
					error: function(result){
        		console.log(result);
    			}
				});
			}
			return false;	
		});
		$("#login-submit").click(function(e)
		{
			var user = {};
			user.act = "login";
			user.ac = $("input[name='log_ac']").val();
			user.pw = $("input[name='log_pw']").val();
			$.ajax(
			{
					url: urlLogin,
					type: "POST",
					data: user,
					datatype: "json",
					success: function (result) 
					{ 
						console.log("Login")
						console.log(result)
						if (result != 'fail') 
						{
							localStorage.setItem("username", result);
							$('.loginUser').html(localStorage.getItem("username"));
							$('.loginBtn span').html("<a href='javascript:logout()'>Logout</a>");
							$('.favBtn span').html("<a href='#/favorite'>Favorite</a>");
						  window.location.href = "#/home";
						} else
						{
							alert("Login Failed, please retry.");
						}
					},
					error: function(result){
        		console.log(result);
    			}
			});
			return false;
		});
	});
}]);

app.controller('HomeController', ['$scope', '$window', function ($scope, $window) 
{
	angular.element(document).ready(function () 
	{
		main();
	});
	angular.element($window).bind('resize', function()
	{
		main();
	});
	function main() 
	{
		$('#main').css(
		{
			'height' : $(window).height() - $('header').height()
		});
	}
}]);

function logout() {
	var user = {};
			user.act = "logout";
	$.ajax( {
			url: "#/home",
			type: "POST",
			data: user,
			success: function (result) {
				console.log(result)
				localStorage.removeItem("username");
				$('.loginUser').empty();
				$('.loginBtn span').html("<a href='#/login'>Login</a>");
			},
			error: function(result){
				console.log(result);
			}
	});
	$('.favBtn span').html("Favorite");
	window.location = "#/home";
	return false;
}

function addFavorite(name, address, phone) {
	var fav = {};
			fav.act = "addFavourite";
			fav.name = name;
			fav.address = address;
			fav.phone = phone;
	$.ajax( {
			url: "#/gym-room",
			type: "POST",
			data: fav,
			success: function (result) {
				console.log(result)
			},
			error: function(result){
				console.log(result);
			}
	});
	return false;
}

function remove(num) {
	var fav = {};
			fav.act = "removeFavourite";
			fav.id = num;
			fav.name = $("#ff"+num).html();
			
	$.ajax( {
		url: "#/favorite",
		type: "POST",
		data: fav
	});
	location.reload();
	return false;
}

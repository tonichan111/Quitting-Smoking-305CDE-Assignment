$(document).ready(function() {
  if (localStorage.getItem("username") !== null) {
    $('.loginUser').html(localStorage.getItem("username"));
		$('.loginBtn span').html("<a href='javascript:logout()'>Logout</a>");
		$('.favBtn span').html("<a href='#/favorite'>Favorite</a>");
  }
});
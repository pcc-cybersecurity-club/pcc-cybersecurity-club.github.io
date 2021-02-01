// Last updated: 3/5/2020
// Description:  made hide menu on scroll for top navigation

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  // When the user scrolls down, hide the navbar:
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("nav-list").style.top = "0";
  } else {  // When the user scrolls up, show the navbar:
    document.getElementById("nav-list").style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
}

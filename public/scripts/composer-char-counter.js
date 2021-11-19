$(document).ready(function () {
  console.log("WORKING");
  $("#tweet-text").keyup(function () {
    let counter = 140 - $(this).val().length;
    document.getElementById("counter").innerText = counter;
    if (counter < 0) {
      document.getElementById("counter").classList.add("negative");
    } else {
      document.getElementById("counter").classList.remove("negative");
    }
  });
});

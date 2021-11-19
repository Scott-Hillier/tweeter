/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.

$(document).ready(function () {
  // first thing called when the DOM is loaded, pulls information from the database
  loadTweets();

  const error = $(".error");

  $("#create").submit(function (event) {
    event.preventDefault();
    if ($("#tweet-text").val().length > 140) {
      error.text("🚨That's too long!🚨");
      return;
    } else if ($("#tweet-text").val().length === 0) {
      error.text(`🚨You need to write something!🚨`);
      return;
    } else {
      error.text("");
    }
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $("#tweet-text").serialize(),
      success: function () {
        loadTweets();
        $("#tweet-text").val(""), $("#counter").val(140);
      },
    });
  });

  $(".button").on("click", function () {
    document.getElementById("create").classList.add("hidden");
  });
});

const loadTweets = function () {
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: function (response) {
      return renderTweets(response);
    },
  });
};

const renderTweets = function (tweets) {
  const container = $(".tweet-container").empty();
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    container.prepend(newTweet);
  }
};

const createTweetElement = function (tweetData) {
  let $tweet = $(`
  <container class = "tweet-box">
    <header class="tweet-header">
      <div class="user-icon">
        <img src=${tweetData.user.avatars}></img>
        <p>${tweetData.user.name}</p>
      </div>
      <p>${tweetData.user.handle}</p>
    </header>
    <div class="old-tweet">
      <p>${escape(tweetData.content.text)}</p>
    </div>
    <footer class="tweet-footer">
      <div class="date-created">
        <h5>${timeago.format(tweetData.created_at)}</h5>
      </div>
      <div class="icons">
              <button class="icons-button"><i class="fas fa-flag"></i></button>
              <button class="icons-button"><i class="fas fa-retweet"></i></button>
              <button class="icons-button"><i class="fas fa-heart"></i></button>
      </div>
    </footer>
  </container>
  `);

  return $tweet;
};

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

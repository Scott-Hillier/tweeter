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
    // Prevents the normal actions from taking place
    event.preventDefault();
    // Posts an error message if the tweet is too long or if there is no text
    if ($("#tweet-text").val().length > 140) {
      error.text("🚨That's too long!🚨");
      return;
    } else if ($("#tweet-text").val().length === 0) {
      error.text(`🚨You need to write something!🚨`);
      return;
    } else {
      // Clears the error if the tweet was successfully posted
      error.text("");
    }
    // Makes a POST request to /tweets and if it is successful it will load all the tweets
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

  // Buttom reveals the form to make a new tweet
  $(".button").on("click", function () {
    document.getElementById("create").classList.add("hidden");
  });
});

// Makes a GET request for the tweet template
// If successful it will create the tweet in the database
const loadTweets = function () {
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: function (response) {
      return renderTweets(response);
    },
  });
};

// Clears the HTML element so tweets aren't rendered multiple times
// Loops through the array of objects containing information for each tweet
// Fills the HTML element again with tweets to post
const renderTweets = function (tweets) {
  const container = $(".tweet-container").empty();
  for (const tweet of tweets) {
    const newTweet = createTweetElement(tweet);
    container.prepend(newTweet);
  }
};

//Attaches the tweet information to the HTML tag and returns the completed HTML
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

// Protects the site from hackers
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

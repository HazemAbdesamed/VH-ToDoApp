// GETTING THE ITEMS FROM THE SERVER
$(document).ready(function() {
  let username = $("#username").val();
  $.ajax({
    type: "GET",
    url: "/users/" + username + "/items",
    success: function(data) {
      data.items.forEach(item => {
        getItems(username);
      });
    },
    error: function() {
      console.log("could not get items");
    }
  });
});

//FUNCTION FOR DELETING AN ITEM
var deleteItem = function(text, username, $item) {
  let user = $("#username").val();
  $.ajax({
    type: "delete",
    url: "/users/" + user + "/delete",
    data: { text: text },
    success: function(data) {
      alert("deleting");
      document.querySelector("#list1").removeChild($item);
    },
    error: function(err) {
      $item.style.color = "purple";
      alert("Delete request failed");
    }
  });
};

//funtion to create the item and add it to the list

var createItem = function(text, state, username) {
  let $item = document.createElement("li");

  let $divForButtons = document.createElement("div");
  $divForButtons.classList.add("item-buttons");
  // text in the item
  let $text = document.createElement("span");
  $text.innerHTML = text;

  //create the xbutton
  var $xbutton = document.createElement("button");
  $xbutton.classList.add("btn");
  $xbutton.classList.add("btn-outline-danger");
  $xbutton.classList.add("btn-sm");
  $xbutton.classList.add("item-buttons");
  $xbutton.innerHTML = "X";
  $xbutton.onclick = function() {
    deleteItem(text, username, $item);
  };

  //input to modify the text
  let $inputWhenModify = document.createElement("input");
  $inputWhenModify.style.display = "none";
  $inputWhenModify.style.width = "inherit";

  // modify button
  var $editButton = document.createElement("button");
  $editButton.classList.add("btn");
  $editButton.classList.add("btn-outline-info");
  $editButton.classList.add("btn-sm");
  $editButton.classList.add("item-buttons");
  $editButton.innerHTML = "Modify";
  $editButton.onclick = function() {
    if ($inputWhenModify.style.display == "none")
      editItem($inputWhenModify, $text, username);
    else $inputWhenModify.style.display = "none";
  };

  var $checkbox = document.createElement("input");
  $checkbox.type = "checkbox";
  $checkbox.classList.add("checkbox");
  $checkbox.checked = state;

  $checkbox.onclick = function() {
    changeState($checkbox, username, $text);
  };

  //appending children to their parents
  $divForButtons.appendChild($checkbox);
  $divForButtons.appendChild($editButton);
  $divForButtons.appendChild($xbutton);

  $item.appendChild($inputWhenModify);
  $item.appendChild($text);
  $item.appendChild($divForButtons);

  document.querySelector("#list1").appendChild($item);
};

var getItems = function(username) {
  $.ajax({
    type: "GET",
    url: "/users/" + username + "/items",
    success: function(data) {
      $("#list1").empty();
      data.items.forEach(item => {
        createItem(item.text, item.state, username);
      });
    },
    error: function() {
      console.log("could not get items for the user " + username);
    }
  });
};

var changeState = function($checkbox, username, $text) {
  let checked = $checkbox.checked ? 1 : 0;
  $.ajax({
    url: "/users/" + username + "/changeStateItem",
    type: "put",
    data: { text: $text.innerHTML, checked: checked },

    success: function() {
      console.log("state changed  successfuly" + $checkbox.checked);
    },
    error: function() {
      $text.style.color = "red";
    }
  });
};

var editItem = function($inputWhenModify, $text, username) {
  var textToEdit = $text.innerHTML;
  $inputWhenModify.style.display = "inline-block";
  $inputWhenModify.value = textToEdit;
  $inputWhenModify.addEventListener("keyup", function(event) {
    if (event.which == "13" || event.keyCode == "13") {
      $text.innerHTML = $inputWhenModify.value;
      $inputWhenModify.style.display = "none";

      $.ajax({
        url: "/users/" + username + "/editItem",
        type: "put",
        data: {
          text: $inputWhenModify.value,
          textToEdit: textToEdit
        },
        success: function(data) {
          console.log("editing worked ");
        },
        error: function() {
          $text.style.color = "red";
        }
      });
    }
  });
};
// ADD AN ITEM
$("#addBtn").on("click", () => {
  let text = $("#text-entered").val();
  $("#text-entered").val("");

  let username = $("#username").val();
  createItem(text, 0, username);
  console.log("before ajax request ");
  $.ajax({
    type: "post",
    url: "/users/" + username + "/addItem",
    data: {
      text: text,
      username: username
    },
    error: function() {
      setTimeout(() => $("li:last").css("color", "red"), 2000);
    }
  });
});

// DELETE BUTTON ---Deprecated

$("#deleteBtn").on("click", () => {
  let text = "yaww";
  $.ajax({
    type: "DELETE",
    url: "/delete/" + text,
    data: { sent: text },
    success: function(data) {
      alert("deleting " + data);
      $("#list1 li")
        .eq(1)
        .remove();
    },
    error: function(err) {
      alert("Delete request failed");
    }
  });
});

var userManagement = function(username) {
  $.ajax({
    type: "get",
    url: "/users/" + username,
    success: function(data) {
      // $("#username").val("");
      console.log(data);
      getItems(username);
    },
    error: function(err) {
      alert("username doesn't exist create a new one please ");
    }
  });
};

// THE USERNAME
$("#username").keyup(function(event) {
  var key = event.which || event.keyCode;
  let username = $("#username").val();
  if (key == "13") {
    userManagement(username);
  }
});

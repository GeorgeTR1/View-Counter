var req = new XMLHttpRequest();
//URL is deployment of code here: https://github.com/GeorgeTR1/View-Counter/blob/main/main.js
req.open("POST", "https://view-counter.georgetr1.deno.net/");
req.send(location.href);

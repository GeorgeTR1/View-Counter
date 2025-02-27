var kv = await Deno.openKv();

Deno.serve(handler);

function handler(request) {
  if (request.method === "POST") {
    request.text().then(gotUrl);
    return new Response(null, {status: 204, headers: {"Access-Control-Allow-Origin": "*"}});
  }
  
  return htmlMaker();
}

async function gotUrl(url) {
  try {
    new URL(url);
  } catch {
    console.log("Not a url!");
    return;  
  }

  var key = ["url", url];

  var res = { ok: false };
  while (!res.ok) {
    res = await kv.atomic()
      .sum(key, 1n)
      .commit();
  }
}

async function htmlMaker() {
  var entries = kv.list({ prefix: ["url"] });
  var rows = "";
  for await (const entry of entries) {
    rows += `
<tr>
  <td>${entry.key[1]}</td>
  <td class = "num">${entry.value}</td>
</tr>`;
  }
  return new Response(`
<!DOCTYPE html>
<html>
<style>
table {
  border:1pt outset;
}
th, td {
  border:1pt inset;
  padding: 5pt;
}
.num {
  text-align: right;
}
</style>
<body>

<table>
  <tr>
    <th>URL</th>
    <th>Visits</th>
  </tr>
  ${rows}
</table>

</body>
</html>
    `);
  //, {headers: {"Content-Type": "text/html"}}
}

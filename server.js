const express = require("express");
const app = express();
const port = 2111;
const redis = require("redis");

var client = redis.createClient({
  url: "redis://3.111.105.44:6379",
});
client.on("error", (err) => console.log("Redis Client Error", err));
global.IS_REDIS = false;

app.get("/:match_id/:src/:selection_id", async (req, res) => {
  try {
    const { match_id, src, selection_id } = req.params;
    if (!global.IS_REDIS) {
      console.log("CONNECTING TO REDIS");
      await client.connect();
      global.IS_REDIS = true;
    }

    const key = `${match_id}_${src}_session`;
    let data = await client.get(key);
    const { all_active_session } = JSON.parse(data);
    let s_data = all_active_session.filter(function (el) {
    return el.sid === selection_id 
})
    res.json(s_data);
  } catch (error) {
    console.error(error);
    res.status(500).json('no records found.');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

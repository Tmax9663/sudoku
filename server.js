const express = require('express');
const cors = require('cors');
const post = require("./routes/posts");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public/"));
app.use(cors());
app.use("/api/post", post);
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


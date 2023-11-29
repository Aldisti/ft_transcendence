const express = require('express');
const path = require('path')
const app = express();

app.use(express.static("./static"))
const PORT = process.env.PORT || 4200;

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "./index.html"))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
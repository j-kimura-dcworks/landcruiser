const express = require('express');
const app = express();
const PORT = 8001;

// ローカルサーバーを立ち上げる
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));

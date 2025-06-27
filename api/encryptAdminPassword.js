const bcrypt = require("bcrypt");
bcrypt.hash("im not that stupid to hardcode password", 10).then(console.log);

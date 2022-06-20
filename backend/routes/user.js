const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const http = require("../utils/http");
const { auth } = require("../middlewares/auth");
const config = require("../app.config");

//login
router.post("/login", auth({ block: false }), async (req, res) => {
  const payload = req.body;
  if (!payload) return res.status(400).send("All inputs are required 1");

  const code = payload.code;
  const provider = payload.provider;
  if (!(code && provider)) return res.status(400).send("All inputs required 2");
  if (!Object.keys(config.auth).includes(provider))
    return res.status(400).send("Wrong payload!");

  const response = await http.post(
    config.auth[provider].token_endpoint,
    {
      code: code,
      client_id: config.auth[provider].client_id,
      client_secret: config.auth[provider].client_secret,
      redirect_uri: config.auth[provider].redirect_uri,
      grant_type: "authorization_code",
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response) return res.sendStatus(500);
  if (response.status !== 200) return res.sendStatus(401);

  let openId;
  const onlyOauth = !response.data.id_token;

  if (onlyOauth) {
    let token = response.data.access_token;
    const userResponse = await http.post(
      config.auth[provider].user_endpoint,
      {},
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );

    if (!userResponse) return res.sendStatus(500);
    if (userResponse.status !== 200) return res.sendStatus(401);

    const id = config.auth[provider].user_id;
    openId = userResponse.data[id];
  } else {
    const decoded = jwt.decode(response.data.id_token);
    if (!decoded) return res.sendStatus(500);
    openId = decoded.sub;
  }

  //megkeresi a user-t, ha nincs csinál egyet:
  const key = "providers." + provider;
  let user = await User.findOne({ [key]: openId });

  if (user && res.locals.user?.providers) {
    user.providers = { ...user.providers, ...res.locals.user.providers };
    user = await user.save();
  }

  const sessionToken = jwt.sign(
    {
      userId: user?._id,
      providers: user ? user.providers : { [provider]: openId },
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ sessionToken });
});

//add a new user to database
router.post("/create", auth({ block: true }), async (req, res) => {
  if (!req.body?.username) return res.sendStatus(400);
  const user = await User.create({
    username: req.body.username,
    providers: res.locals.user.providers,
  });

  const sessionToken = jwt.sign(
    {
      userId: user._id,
      providers: user.providers,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ sessionToken });
});

//keep user logged in, log it out after 1 min, if no request received
let oneMinuteTicker;
router.post("/loggedin", auth({ block: true }), async (req, res) => {
  const user = await User.findById(res.locals.user.userId);
  if (!user) return res.status(400).send("User not found!");

  user.online = true;
  await user.save((err) => {
    if (err) return res.status(500).send(err);
    console.log("login");
  });

  const logout = async () => {
    user.online = false;
    await user.save((err) => {
      if (err) return res.status(500).send(err);
      console.log("logout");
    });
  };

  clearTimeout(oneMinuteTicker);
  oneMinuteTicker = setTimeout(logout, 60000);

  res.status(200).send("running...");
});

//get list of users
router.get("/users", auth({ block: true }), async (req, res) => {
  const users = await User.find().sort({ won: -1, played: 1 });
  res.status(200).send(users);
});

//logout
/* router.patch("/logout", async (req, res) => {
  const id = req.body.userId;
  if (!id) return res.status(400).send("All inputs are required!");

  const user = await User.findById(id);
  if (!user) return res.status(400).send("User not found!");

  user.online = false;
  user.save((err) => {
    if (err) return res.status(500).send(err);
  });

  res.status(200).send("User logged out");
}); */
/* router.patch("/logout", auth({ block: true }), async (req, res) => {
  if (res.locals.user?.userId) {
    console.log(res.locals.user.userId);
    const user = await User.findById(res.locals.user.userId);
    if (!user) return res.status(404).send("User not found.");
    user.online = false;
    user.save((err) => {
      if (err) return res.status(500).send(err);
    });
    res.status(200).send("User logged out");
  }
}); */

module.exports = router;

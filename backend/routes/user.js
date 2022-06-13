const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const http = require("../utils/http");
const { auth } = require("../middlewares/auth");
const config = require("../app.config");

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
    //let token = response.data.split("=")[1].split("&")[0];
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

  /*   const user = await User.findOneAndUpdate(
    { [key]: openId },
    { providers: { [provider]: openId } },
    { new: true, upsert: true }
  ); */

  //példa optional chainingre , b1 és c1 értéke ugyanaz (ha van user.profile.account.balance,akkor annak az értéke, ha nem, akkor null)
  /*   const user = {
    username: "Random",
    profile: { id: "123456", account: { balance: 0, account_id: "bb" } },
  };
  const b1 =
    user && user.profile && user.profile.account && user.profile.account.balance
      ? user.profile.account.balance
      : null;
      
      const c1 = user?.profile?.account?.balance; */

  //megkeresi a user-t, ha nincs csinál egyet:
  const key = "providers." + provider;
  let user = await User.findOne({ [key]: openId });
  if (user && res.locals.user?.providers) {
    user.providers = { ...user.providers, ...res.locals.user.providers };
    user = await user.save();
  }

  const sessionToken = jwt.sign(
    {
      userId: user?._id, //optional chaning
      providers: user ? user.providers : { [provider]: openId }, //OC itt nem jó, mert nem null-t adunk vissza
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ sessionToken });
});

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

module.exports = router;

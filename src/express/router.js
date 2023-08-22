const express = require('express');
const login = require('./controller/auth/login');
const Signup = require('./controller/auth/signup');
const List = require('./controller/post/list');
const Create = require('./controller/post/create');
const Like = require('./controller/post/like');
const Delete = require('./controller/post/delete');
const Get = require('./controller/user/get');
const Follow = require('./controller/user/follow');
const FollowingList = require('./controller/user/following/list');
const FollowerList = require('./controller/user/follower/list');
const Search = require('./controller/user/search');
const Logout = require('./controller/auth/logout');

const router = express.Router();

router.use("/api/login", login);
router.use("/api/signup", Signup);
router.use("/api/logout", Logout);

router.use("/api/post/delete", Delete);
router.use("/api/post/like", Like);
router.use("/api/post/create", Create);
router.use("/api/post/list", List);

router.use("/api/user/search", Search);
router.use("/api/user/get", Get);
router.use("/api/user/follow", Follow);
router.use("/api/user/follower/list", FollowerList);
router.use("/api/user/following/list", FollowingList);

module.exports = router;
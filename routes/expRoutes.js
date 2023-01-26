import express from "express";
const router = express.Router();
import Exp from "../Schema/expSchema.js";
import User from "../Schema/userSchema.js";
import authenticateJWT from "../MiddleWare/Auth.js";
import mongoose from "mongoose";
router.get("/exp", authenticateJWT, async (req, res) => {
  const exp = await Exp.find().populate("postedBy", "fname lname");
  //   console.log(exp);
  const user = await User.findById(req.user.id).populate(
    "postViews",
    "company"
  );

  const { postViews } = user;
  const postViewCompanies = postViews.map(({ company }) => company);
  console.log("com", postViewCompanies);

  const updatedExp = exp.map((exp) => {
    const obj = {
      company: exp.company,
      _id: exp._id,
      desc: exp.desc,
      role: exp.role,
      postedBy: {
        _id: exp.postedBy._id,
        fname: exp.postedBy.fname,
        lname: exp.postedBy.lname,
      },
    };
    console.log("exp", postViews, obj.postedBy._id, user._id);
    if (
      postViewCompanies.includes(obj.company) &&
      obj.postedBy._id.toString() !== user._id.toString()
    ) {
      return {
        ...obj,
        isSuggested: true,
      };
    }
    if (exp.postedBy._id.toString() === user._id.toString()) {
      return {
        ...obj,
        isMyExp: true,
      };
    }
    return {
      ...obj,
      isSuggested: false,
    };
  });
  //   console.log(updatedExp);
  return res.json({ exp: updatedExp });
});
router.post("/exp", authenticateJWT, async (req, res) => {
  const { company, desc, batch, role } = req.body;
  if (!company || !desc || !batch) {
    res.send(404).json({ message: "Please Enter all Fields" });
  }
  const newExp = new Exp({
    company,
    desc,
    batch,
    role,
    postedBy: req.user.id,
  });
  newExp.save();
  return res.json({
    newExp,
  });
});
router.put("/exp/:id", authenticateJWT, (req, res) => {
  const { company, desc, batch } = req.body;
  Exp.findByIdAndUpdate(req.params.id, { company, desc, batch, role }).then(
    res.json({ message: "Experience Updated" })
  );
});

router.delete("/exp/:id", authenticateJWT, (req, res) => {
  Exp.findByIdAndDelete(req.params.id).then(
    res.json({ message: "Experience Deleted" })
  );
});

router.get("/exp/myexp", authenticateJWT, async (req, res) => {
  const resp = await Exp.find({ postedBy: req.user.id });
  res.json({ res: resp });
});

router.get("/exp/:id", authenticateJWT, async (req, res) => {
  const id = req.params.id;
  const exp = await Exp.findById(id).populate("postedBy", "fname lname");
  return res.json({ exp });
});

router.post("/exp/view", authenticateJWT, async (req, res) => {
  const postId = req.body.postId;
  console.log(postId);
  const id = req.user.id;
  const user = await User.findById(id).populate("postViews", "_id");
  const updatedPostViews = [
    { _id: mongoose.mongo.ObjectId(postId) },
    ...user.postViews,
  ];
  const uniq = updatedPostViews.reduce((acc, cur) => {
    const index = acc.find((ele) => ele._id.toString() === cur._id.toString());
    if (!index) {
      acc.push(cur);
    }
    return acc;
  }, []);
  await User.findByIdAndUpdate(req.user.id, {
    postViews: uniq,
  });
  res.json({ ok: 200 });
});

export default router;

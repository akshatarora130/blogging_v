const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/blogControllers");

router.post("/addblog", BlogController.addBlog);
router.get("/myblog", BlogController.getMyBlogs);
router.get("/blogs", BlogController.getAllBlogs);
router.get("/notifications" , BlogController.renderNotifications);
router.post("/approve/:b" , BlogController.approve);
router.post("/reject/:b" , BlogController.reject);
router.post("/deleteBlog/:b" , BlogController.deleteBlog);
router.get("/editBlog/:b" , BlogController.editBlog);
router.post("/updateBlog/:b" , BlogController.updateBlog);

module.exports = router;

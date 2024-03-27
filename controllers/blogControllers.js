const User = require("../model/user");
const blog = require("../model/blog");

const BlogController = {
    addBlog: async (req, res) => {
        const {title,content} =req.body;
        let newBlog= new blog({title,content,user:req.session.user._id});
        let user = await User.findOne({_id:req.session.user._id})
        if(user.isAdmin){
            newBlog.approved = true;
        }
        await newBlog.save();
        user.blog.push(newBlog._id);
        await user.save();
        res.redirect("/")
    },

    getMyBlogs: async (req, res) => {
        let user=await User.findOne({_id:req.session.user._id}).populate("blog");
        res.render("myblog",{blogs:user.blog,user:user});
    },

    getAllBlogs: async (req, res) => {
        let blogs=await blog.find().populate("user");
        res.render("allblog",{blogs , user:req.session.user});
    },

    renderNotifications : async (req , res)=>{
        let blogs=await blog.find().populate("user");
        res.render("notifications" , {blogs , user:req.session.user});
    },

    approve : async (req , res)=>{
        const {b} = req.params;
        const findBlog = await blog.findById(b);
        findBlog.approved = true;
        await findBlog.save();
        res.redirect("/notifications")
    },

    reject : async (req , res)=>{
        const {b} = req.params;
        await blog.findByIdAndDelete(b);
        res.redirect("/notifications")
    },

    deleteBlog: async (req, res) => {
        const {b} = req.params;
        const toDelete = await blog.findById(b);
        const user = await User.findById(toDelete.user);
        user.blog.forEach((bl) => {
            if (bl._id == b) {
                user.blog.remove(bl);
            }
        })
        await blog.findByIdAndDelete(b);
        res.redirect("/myblog")
    },

    editBlog: async (req, res) => {
        const {b} = req.params;
        const toEdit = await blog.findById(b);
        res.render("edit", {blog: toEdit, user: req.session.user})
    },

    updateBlog: async (req, res) => {
        const {b} = req.params;
        const {title, content} = req.body;
        const toUpdate = await blog.findById(b);
        const user = await User.findById(toUpdate.user);
        if(!user.isAdmin){
            toUpdate.approved = false;
        }
        toUpdate.title = title;
        toUpdate.content = content;
        await toUpdate.save();
        res.redirect("/myblog");
    }
};

module.exports = BlogController;

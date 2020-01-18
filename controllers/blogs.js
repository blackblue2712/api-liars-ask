const Blog = require("../models/blogs");

module.exports.postWriteBlog = (req, res) => {
    let blog = new Blog(req.body);
    blog.anonymousTags = req.body.tagsnameArray;
    blog.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (wirte blog)"} );
        return res.status(200).json( {message: "Done"} )
    });
}

module.exports.getBlogs = (req, res) => {
    console.log(req.query, req.body);
    Blog.find({})
        .limit(Number(req.query.limit))
        .sort( {created: -1} )
        .select("_id title")
        .exec( (err, blogs) => {
            if(err) return res.status(400).json( {message: "Error occur (get blogs) " + err} );
            return res.status(200).json( blogs );
        });
}
module.exports.getAllBlogs = (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) return res.status(400).json( {message: "Error occur (get all blogs) " + err} );
        return res.status(200).json( blogs );
    })
}
module.exports.getYourBlogs = (req, res) => {
    Blog.find({owner: req.query.userId}, "title _id", (err, blogs) => {
        if(err) return res.status(400).json( {message: "Error occur (get your blogs) " + err} );
        return res.status(200).json( blogs );
    })
}

module.exports.requestRelatedBlogId = async (req, res, next, id) => {
    await Blog.findById(id, (err, blog) => {
        if(err) return res.status(400).json( {message: "Error occur (get single blog)"} );
        req.blogInfo = blog;
    });
    next();
}

module.exports.getSingleBlog = (req, res) => {
    return res.status(200).json(req.blogInfo);
}

module.exports.isOwner = async (req, res, next, id) => {
    // await User.
}

module.exports.getSingleBlogToEdit = (req, res) => {
    let { uid } = req.query;
    let blog = req.blogInfo;
    if(blog.owner != uid) {
        return res.status(404).json( {message: 404} );
    } else {
        return res.status(200).json(blog);
    }
}

module.exports.putEditBlog = (req, res) => {
    let blog = req.blogInfo;
    let { title, body, tagsnameArray } = req.body;
    if(body) blog.body = body;
    blog.title = title;
    blog.anonymousTags = tagsnameArray;

    blog.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (edit blog)"} )
        return res.status(200).json( {message: "Done"} );
    })
}
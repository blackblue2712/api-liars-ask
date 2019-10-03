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
        .exec( (err, blogs) => {
            if(err) return res.status(400).json( {message: "Error occur (get blogs) " + err} );
            return res.status(200).json( blogs );
        });
}


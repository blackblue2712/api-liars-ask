const Acm = require("../models/announcements");

module.exports.postAnnouncement = (req, res) => {
    /**
     * anonymous tag?
     * 1. Select all tags from database and check exist tag in client side (> 1000 tags?) 
     * 2. Check anonymous tags in server side 
     * 3. Check anonymous tags in server side. If exist -> add post with that tag
     *                                         If not -> Add a new tag with that name then add post with that tag
     **/ 

    const { title, body, isImportant, tagsnameArray, id } = req.body;
    Acm.findOne( {title}, "_id", (err, result) => {
        if(!result) {
            const acm = new Acm( {title, body, isImportant, anonymousTags: tagsnameArray, owner: id} );
            acm.save( (err, result) => {
                if(err) return res.status(400).json( {message: "Error occur"} );
                return res.status(200).json( {message: "Done", payload: result} );
            })
        } else {
            return res.status(200).json( {message: "Announcement exits"} );
        }
    })
}

module.exports.getAnnouncements = (req, res) => {
    Acm.find({}, null, {sort: {created: -1}}, (err, acms) => {
        if(err) return res.status(400).json( {message: "Error occur"} );
        return res.status(200).json( {message: `${acms.length} loaded`, payload: acms});
    });
}

module.exports.requestRelatedAcmId = (req, res, next, id) => {
    Acm.findById(id, (err, acm) => {
        if(err || !acm) return res.status(400).json( {message: "Error occur"} );
        req.acmInfo = acm;
        next();
    });
}

module.exports.getSingleAcm = (req, res) => {
    return res.status(200).json(req.acmInfo);
}
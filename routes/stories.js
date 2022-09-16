const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')            //bring in multiple items and do the same process

const Story = require('../models/Story')

//@desc Show add page  --> BASICALLY route for stories
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')                                       //sends to the stories route file and THEN do multiple actions
})

//@desc Process add form  --> BASICALLY route for form
//@route POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id                                 //Adding new property of user id into db
        await Story.create(req.body)                                //using .create method to make new stories and populate fields and send update the db
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//@desc Show all stories
//@route GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })              //Displaying stories with a status of public
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//@desc Show single story
//@route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})





//@desc Show edit page
//@route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        }                                                                       //Essentially checking if the user requesting the edit button is the creator of that story and then sending them to te edit page IF they are that user
        else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }

})

//@desc Update story
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        }
        else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }

})


//@desc Delete story
//@route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


//@desc User stories
//@route GET /stories/user/:userId
router.get('/user//:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public',
        })


            .populate('user')
            .lean()

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})




module.exports = router  //Assignment of constant router
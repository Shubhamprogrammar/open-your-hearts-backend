const express = require("express")
const router = express.Router();
const { validationResult } = require('express-validator');
const authoriseuser = require('../middleware/authoriseuser')
const Hnotes = require('../models/Hnotes');

router.post('/addhnotes', authoriseuser,
    async (req, res) => {
        try {
            const { title, heart } = req.body;
            // If there are errors , return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Create the heart using constructor
            const hnotes = new Hnotes({
                user: req.user.id, title, heart
            });
            // Saving the hearts
            const savedHnotes = await hnotes.save();
            res.json({ savedHnotes });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error Occured")
        }
    }
);

router.put('/updatehnotes/:id', authoriseuser,
    async (req, res) => {
        try {
            const { title, heart } = req.body;
            // Create a new Note object
            const newHNote = {};
            if (title) { newHNote.title = title }
            if (heart) { newHNote.heart = heart }

            // Find the note to be updated and update it
            let note = await Hnotes.findById(req.params.id);

            if (!note) { return res.status(404).send("Not found"); }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not allowed");
            }
            note = await Hnotes.findByIdAndUpdate(req.params.id, { $set: newHNote }, { new: true });
            res.json({ note });
        }
        catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error Occured")
        }
    }
);

router.delete("/deletehnote/:id", authoriseuser,
    async (req, res) => {
        try {
            let heartnote = await Hnotes.findById(req.params.id);
            if (!heartnote) {
                res.status(404).send("Not Found");
            }
            heartnote = await Hnotes.findByIdAndDelete(req.params.id);

            res.json({ "success": "Heart Notes has been deleted", heartnote: heartnote });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occured");
        }
    }
);

router.post('/addcomment/:id', authoriseuser,
    async (req, res) => {
        try {
            const { text } = req.body;
            // If there are errors , return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Find the heart note by ID
            let note = await Hnotes.findById(req.params.id);
            if (!note) return res.status(404).send('Heart note not found');

            // Create a new comment
            const newComment = {
                user: req.user.id,
                text
            };
            // Add the comment to the heart note
            note.comments.push(newComment);
            await note.save();

            // Populate user details for comments
            const updatedHeartnote = await Hnotes.findById(req.params.id).populate('comments.user', 'name');

            res.json(updatedHeartnote);
        }
        catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error Occured")
        }
    }
);

router.delete('/deletecomment/:noteId/:commentId', authoriseuser, async (req, res) => {
    try {
        const { noteId, commentId } = req.params;

        // Find the note
        const note = await Hnotes.findById(noteId);
        if (!note) return res.status(404).send('Heart note not found');

        // Check if the logged-in user is the author of the comment
        const comment = note.comments.id(commentId);
        if (!comment) return res.status(404).send('Comment not found');
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).send("Not authorized to delete this comment");
        }

        // Remove the comment
        note.comments = note.comments.filter(item => item !== comment);
        await note.save();

        // Respond with the updated note
        const updatedNote = await Hnotes.findById(noteId).populate('comments.user', 'name');
        res.json(updatedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/deleteallcomment/:heartId/:commentId', authoriseuser, async (req, res) => {
    const { heartId, commentId } = req.params;

    try {
        // Find the heart note (Hnotes) by ID
        const heart = await Hnotes.findById(heartId);
        if (!heart) {
            return res.status(404).json({ msg: 'Heart note not found' });
        }

        // Find the comment to be deleted
        const comment = heart.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Remove the comment from the comments array
        heart.comments = heart.comments.filter(item => item !== comment);

        // Save the updated heart note after removing the comment
        await heart.save();

        // Return the updated heart note with comments
        const updatedHeartNote = await Hnotes.findById(heartId).populate('comments.user', 'name');
        res.json(updatedHeartNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Internal Server error' });
    }
});

router.get('/getallhnotes', authoriseuser,
    async (req, res) => {
        try {
            const hearts = await Hnotes.find({ user: req.user.id }).populate('comments.user', 'name');
            res.json(hearts);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/getallnotes',
    async (req, res) => {
        try {
            const hearts = await Hnotes.find().populate('comments.user', 'name');
            res.json(hearts);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;
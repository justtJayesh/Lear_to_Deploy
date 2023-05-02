const { Router } = require("express");
const { NoteModel } = require("../model/Note.model");

const noteRouter = Router();

noteRouter.post("/create", async (req, res) => {
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.send({ msg: "Note has been created" });
    } catch (error) {
        res.status(200).send({ err: error.message });
    }
});

noteRouter.get("/", async (req, res) => {
    try {
        const notes = await NoteModel.find({
            authorID: req.body.authorID,
            author: req.body.author,
        });
        res.status(200).send(notes);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

noteRouter.patch("/update/:noteId", async (req, res) => {
    const { noteId } = req.params;
    const note = await NoteModel.findOne({ _id: noteId });
    try {
        if (req.body.authorID != note.authorID) {
            res.status(200).send({
                msg: `You are not authorized to this action.`,
            });
        } else {
            await NoteModel.findByIdAndUpdate({ _id: noteId }, req.body);
            res.status(200).send({
                msg: `The note with ${noteId} is updated.`,
            });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

noteRouter.delete("/delete/:noteId", async (req, res) => {
    const { noteId } = req.params;
    const note = await NoteModel.findOne({ _id: noteId });
    try {
        if (req.body.authorID != note.authorID) {
            res.status(200).send({
                msg: `You are not authorized to this action.`,
            });
        } else {
            await NoteModel.findByIdAndDelete({ _id: noteId });
            res.status(200).send({
                msg: `The note with id: ${noteId} has been deleted.`,
            });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = { noteRouter };

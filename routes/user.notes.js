const express=require("express")
const { NotesModel } = require("../model/notes.model")
const { Auth } = require("../middleware/user.middleware")
const noteRouter=express.Router()

noteRouter.use(Auth)
noteRouter.post("/create",async(req,res)=>{
    try {
        const notes=new NotesModel(req.body)
        await notes.save()
        res.status(200).json({msg:"new notes has been created",note:req.body})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})
noteRouter.get("/",async(req,res)=>{
    const query=req.query
    try {
        const notes=await NotesModel.find({userID:req.body.userID})
        res.status(200).json({msg:"all the users notes",All_notes:notes})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})
noteRouter.patch("/update/:noteID",async(req,res)=>{
    const userIdInUserDoc=req.body.userID
    const {noteID}=req.params
    try {
        const note=await NotesModel.findOne({_id:noteID})
        const noteIdInNoteDoc=note.userID
        if(userIdInUserDoc===noteIdInNoteDoc){
            await NotesModel.findByIdAndUpdate({_id:noteID},req.body)
            res.status(200).json({msg:`${note.title} has been updated`})
        }else{
            res.status(400).json({msg:`Not Authorized`})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const userIdInUserDoc=req.body.userID
    const {noteID}=req.params
    try {
        const note=await NotesModel.findOne({_id:noteID})
        const noteIdInNoteDoc=note.userID
        if(userIdInUserDoc===noteIdInNoteDoc){
            await NotesModel.findByIdAndDelete({_id:noteID})
            res.status(200).json({msg:`${note.title} has been Deleted`})
        }else{
            res.status(400).json({msg:`Not Authorized`})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

module.exports={noteRouter}
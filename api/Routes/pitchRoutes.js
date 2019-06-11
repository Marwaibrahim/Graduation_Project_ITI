let express=require("express"),
    pitchRouter=express.Router(),
    mongoose=require("mongoose"),
    multer = require("multer");


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads')
    },
    filename: function (req, file, cb) {
        console.log("Amr"+file.filename);
        cb(null,   Date.now()+'-'+file.originalname  )
    }
})
      
let upload = multer({ storage: storage });


    require("./../Models/pich.model");
    require("./../Models/owner.model");

   let Pitch= mongoose.model("pitch");
   let PitchPhotos= mongoose.model("pitch_photos");
   let ownerSchema=mongoose.model("owner");

    pitchRouter.get("/add",(request,response)=>{

        ownerSchema.find({},(error,result)=>{
            response.render("pitch/addpitch",{owner:result});
        });
    
    });//add get
    pitchRouter.post("/add", upload.array("playgrounds", 5), (request,response)=>{
        console.log("lkjl")
        let pitch=new Pitch({
            name:request.body.name,
            location:request.body.location,
            owner:request._id
        });
    
        pitch.save((err)=>{
            if(err)
                console.log("save pitch error "+err);
            else {
                console.log(request.files);
                let images = request.files.map((img)=>{
                    return {filename: img.filename, pitch: pitch._id};
                });

                PitchPhotos.insertMany(images)
                .then(()=>{
                    response.json({success: true});
                })
                .catch((err)=>{
                    console.log(err);
                    response.json({success: false});

                })
            }
            
        });
    })

    pitchRouter.get("/edit/:id",(request,response)=>{
    
        Pitch.findOne({_id:request.params.id},(error,Pitch)=>{
        if(!error)
        response.render("pitch/editpitch",{pitch:pitch});
        else
        console.log("Edit error "+error);    

    })

});
pitchRouter.post("/edit/:id" ,upload.array("playgrounds", 5),(request,response)=>{

    Pitch.updateOne({_id:request.params.id},req.body,(error)=>{
        if(!error)
        response.redirect("/pitch/list");
        else
        console.log("update One Error "+error);
    })


});
pitchRouter.get("/delete/:id",(request,response)=>{
    Pitch.remove({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/pitch/list");
    })
});
    module.exports=pitchRouter;
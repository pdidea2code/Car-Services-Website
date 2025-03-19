const mongoose = require("mongoose");

const adminThemeSchema = new mongoose.Schema({
   color1:{
    type:String,
    default:"#000000"
   },
   color2:{ 
    type:String,
    default:"#000000"
   },
   color3:{
    type:String,
    default:"#000000"
   },
   color1default:{
    type:String,
    default:"#0E0821"
   },
   color2default:{
    type:String,
    default:"#A120FE"
   },
   color3default:{
    type:String,
    default:"#F7F5FC"
   }
}, { timestamps: true ,versionKey: false    });
module.exports = mongoose.model("AdminTheme", adminThemeSchema);
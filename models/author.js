const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
    first_name :{type:String,required:true,max:100},
    family_name :{type:String,required:true,max:100},
    date_of_birth:{type:Date},
    date_of_death:{type:Date}
})

authorSchema.virtual("name").get(function(){
    let fullname=""
    if(this.first_name && this.family_name){
        fullname = this.first_name+','+this.family_name
    }
    return fullname
})
// uthorSchema
// .virtual('name')
// .get(function () {

// // To avoid errors in cases where an author does not have either a family name or first name
// // We want to make sure we handle the exception by returning an empty string for that case

//   var fullname = '';
//   if (this.first_name && this.family_name) {
//     fullname = this.family_name + ', ' + this.first_name
//   }
//   if (!this.first_name || !this.family_name) {
//     fullname = '';
//   }

//   return fullname;
// });

authorSchema.virtual("lifespan").get(function(){
    if(this.date_of_birth && this.date_of_death){
        return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();

    }else return null
})

authorSchema.virtual("url").get(function(){
    return '/catalog/author/'+this._id
})

module.exports = mongoose.model("Author",authorSchema)
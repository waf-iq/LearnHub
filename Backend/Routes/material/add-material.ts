import { error } from "ajv/dist/vocabularies/applicator/dependencies.js";
import { ServerCommandBuilder } from "../../Applications/Commands/Builder.js";
import { UserAccessLevels, CommandExecuteArguments } from "../../Applications/Commands/Context.js";
import { v4 as uuid } from "uuid";

const command = new ServerCommandBuilder("add-course-material")
  .setAccessLevel(UserAccessLevels.INSTRUCTOR)
  .setOutgoingChannel("add-course-material-response")
  .setIncomingValidationSchema({
        type: "object",
        additionalProperties: false,
        //course_id, weight, title, deadline
        properties: {
            course_id: { type: "number"},
            weight: { type: "number"},
            title: { type: "string"},
            deadline: { type: "string"}
        },required:["course_id","weight","title","deadline"]       
      })
  .setExecute(callback)
  .setOutgoingValidationSchema({})
  .build();

async function callback({ Client, Data, Database }: CommandExecuteArguments) {
    const{course_id, weight, title, deadline}=Data;
    const id=Client.getId();
    const user=Client.getName();
 try {
    const doesCourseExist = await Database.doesCourseExist(course_id);
    if(!doesCourseExist)
        throw new Error("Course does not exist");
    const totalWeight = await Database.executeQuery('SELECT SUM(weight) AS total_weight FROM material WHERE course_id=?',[course_id]);
    if(totalWeight[0].total_weight+weight>100)
        throw new Error("Total weight of material exceeds 100%");
    
        if(deadline!=null&&deadline!=undefined&&deadline!=""){
        //handling the date
        const date = new Date(deadline);
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        if(date<new Date())
            throw new Error("Invalid deadline");
        await Database.executeQuery('INSERT INTO material (course_id, weight, title, deadline) VALUES (?,?,?,?)',[course_id, weight, title, formattedDate]);
        }
        else if(deadline==null||deadline==undefined||deadline==""){
            await Database.executeQuery('INSERT INTO material (course_id, weight, title) VALUES (?,?,?)',[course_id, weight, title]);
        }
        const course = await Database.executeQuery('SELECT title FROM courses WHERE id=?',[course_id]);
        const courseName = course[0].title;
        await Database.createLog({ event: "Add Material", details: `User ${user} added ${title} To course ${courseName}`, initiator: id });
        return {
            notification: {
              type: "success",
              message: "Material added successfully!",
            },
            error: false,
          };
       

    
 } catch (error) {
    console.log(error.message);
    if(error.message==="Total weight of material exceeds 100%")
        return {
            notification: {
              type: "error",
              message: "Total weight of material exceeds 100%!",
            },
            error: true,
          };

    else if(error.message==="Course does not exist")
        return {
            notification: {
              type: "error",
              message: "Course does not exist!",
            },
            error: true,
          };
    else if(error.message==="Invalid deadline")
        return {
            notification: {
              type: "error",
              message: "Deadline cannot be in the past!",
            },
            error: true,
          };
    
    else
    return {
        notification:{
            title:"Error",
            message:"Unable to add material",
            error:true
        }
    }
 }


}

export default command;

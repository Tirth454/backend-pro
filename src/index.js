import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({ path: "./.env" });

connectDB().then(
    app.listen(3000, () => {
        console.log(`Your app is Listining at port:${process.env.PORT}`);
    })
)













// (async () => {
//     try {
//         await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log(error);
//             throw error;
//         });
//         app.listen(3000, () => {
//             console.log(`Your app is Listining at port:${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// })();

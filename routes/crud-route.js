const express = require("express");
const { addUser, updateUser, upload, deleteUser, readAllUsers } = require("../controller/crud-cont"); // Change controller import to crud-cont

const router = express.Router();

router.post("/add", upload.single('image'), addUser);
router.put("/update/:id", upload.single('image'), updateUser); 
router.delete("/delete/:id", deleteUser);
router.get("/read", readAllUsers); // Change route path from "/readallusers" to "/read"

module.exports = router;

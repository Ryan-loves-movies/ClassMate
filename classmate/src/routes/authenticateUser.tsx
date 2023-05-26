import validateToken from '@/middleware/auth';
import app from "next";

app.use("/classmate", validateToken);

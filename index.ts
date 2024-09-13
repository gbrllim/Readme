import express, { Request, Response } from "express";
import { htmlToText } from "html-to-text";
import axios from "axios";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my server");
});

const usersRoute = require("./routes/users");

app.use("/users", usersRoute);

app.post("/convert-html", async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    // Fetch the HTML content from the given URL
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Convert the fetched HTML to plain text
    const text = htmlToText(htmlContent, {
      wordwrap: 500,
      // You can configure more options here if needed
    });

    // Return the plain text response
    return res.json({ text });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching or converting HTML",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

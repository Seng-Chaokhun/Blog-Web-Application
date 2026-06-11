import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// EJS module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let posts = [];
let postId = 1;

app.post("/submit-post", (req, res) => {
  const { title, content } = req.body;

  const newPost = {
    id: postId++,
    title,
    content,
    createdAt: new Date(),
  };

  posts.push(newPost);
  console.log("New post added: ", newPost);
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("post", { post });
});

app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).send("Post not found");

  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) return res.status(404).send("Post not found");

  post.title = req.body.title;
  post.content = req.body.content;

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((p) => p.id != postId);
  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

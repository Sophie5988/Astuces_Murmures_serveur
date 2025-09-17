import Comment from "../models/comment.schema.js";

export const addAComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const author = req.user._id;

    // vérification sur la taille du contenu

    const comment = await Comment.create({
      content,
      blog: blogId,
      author,
    });
    await comment.populate("author", "username email");
    await comment.populate("blog", "title");
    return res.status(201).json(comment);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Pb lors de l'ajout du commentaire" });
  }
};

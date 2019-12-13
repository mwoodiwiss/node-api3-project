const express = require("express");
const userDB = require("./userDb");
const postDB = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser(), (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing user name" });
  }

  userDB
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the user"
      });
    });
});

router.post("/:id/posts", validateUserId(), validatePost(), (req, res) => {
  const text = req.body.text;
  const user_id = req.params.id;
  const post = { text: text, user_id: user_id };
  if (!text) {
    return res.status(400).json({
      errorMessage: "Please provide the text for the post."
    });
  }
  userDB.getById(user_id).then(text => {
    console.log(text);
    if (text) {
      postDB
        .insert(post)
        .then(text => {
          res.status(201).json(text);
        })
        .catch(error =>
          res.status(500).json({
            message: "There was an error while saving the post to the database"
          })
        );
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  });
});

router.get("/", (req, res) => {
  userDB
    .get()
    .then(user => res.json(user))
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

router.get("/:id", validateUserId(), (req, res) => {
  userDB
    .getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(201).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.get("/:id/posts", validateUserId(), (req, res) => {
  userDB
    .getUserPosts(req.params.id)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not get users posts"
      });
    });
});

router.delete("/:id", validateUserId(), (req, res) => {
  userDB
    .getById(req.params.id)
    .then(async user => {
      if (user) {
        await userDB.remove(req.params.id);
        return user;
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

router.put("/:id", validateUserId(), validateUser(), (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "You need to enter a name" });
  }

  userDB
    .getById(req.params.id)
    .then(user => {
      if (user) {
        return userDB.update(req.params.id, { name });
      }
      res.status(404).json({ message: "User not found" });
    })
    .then(() => userDB.getById(req.params.id))
    .then(data => res.json(data))
    .catch(err => {
      res.status(500).json({ message: "An error occured..." });
    });
});

//custom middleware

function validateUserId() {
  return (req, res, next) =>{
    userDB.getById(req.params.id)
      .then(user => {
        if(user){
          req.user = user
          next()
        } else{
          res.status(400).json({message: "invalid user id"})
        }
      })
      .catch(err => res.status(500).json({message: 'error getting user with this ID'}))
  }
}

function validateUser(){
  return (req, res, next) =>{
    resource = {
      name: req.body.name
    }

    if(!req.body){
      return res.status(404).json({message: 'missing post data'})
    } 

    if(!req.body.name){
      return res.status(404).json({message: 'missing required text field'})
    }else {
      req.user = resource
      next()
    }
  
  }
}

function validatePost(){
  return (req, res, next) =>{
    resource = {
      text: req.body.text
    }

    if(!req.body){
      return res.status(404).json({message: 'missing post data'})
    } 

    if(!req.body.text){
      return res.status(404).json({message: 'missing required text field'})
    }else {
      req.post = resource
      next()
    }
  
  }
}

module.exports = router;

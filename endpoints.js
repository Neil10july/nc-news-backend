exports.endpoints = (req, res, next) => {
  res.status(200).send(endpointsList);
};

const endpointsList = {
  endpoints: {
    "/users": {
      GET: "Retrives all users",
      POST: "Adds new user to database"
    },
    "/topics": { GET: "Retrieved all topics" },
    "/articles": {
      GET: "Retrieves all articles",
      POST: {
        description: "Adds new article to database",
        example: {
          title: "Seafood substitutions are increasing",
          topic: "cooking",
          author: "weegembump",
          body: "Text from the article.."
        }
      },
      "/articles/:id": {
        GET: "Retrieves article by id",
        PATCH: "Increments/decrements article votes",
        DELETE: "Deletes article by id"
      },
      "/articles/:id/comments": {
        GET: "Retrieves comments by article id",
        POST: {
          description: "Adds comment to database with reference to article",
          example: { username: "butter_bridge", body: "comment" }
        }
      },
      "/comments/comment_id": {
        PATCH: "Increments/decrements comment vote",
        DELETE: "Deletes comment by id"
      },
      "/login": {
        POST: {
          description: "Validates user credentials",
          example: {
            username: "icellusedkars",
            password: "veryreliable"
          }
        }
      }
    }
  }
};

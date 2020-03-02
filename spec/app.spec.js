process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const { check_keys } = require("./help.me.test");

describe("/api", () => {
  beforeEach(() => db.seed.run());
  after(() => db.destroy());

  describe("/topics", () => {
    it("GET 200: responds with status 200 and an object containing topics data", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          expect(topics).to.satisfy(topics => {
            const keys = ["slug", "description"];
            return check_keys(topics, keys);
          });
        });
    });
  });

  describe("/users", () => {
    describe("/", () => {
      it("GET 200: responds with status 200 and an array of all users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const users = body.user;
            expect(users.length).to.equal(4);
            expect(users).to.satisfy(users => {
              const keys = ["username", "avatar_url", "name"];
              return check_keys(users, keys);
            });
          });
      });
    });
    describe("/:username", () => {
      it("GET 200: responds with status 200 and the requested user", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            const user = body.user;
            expect(user.username).to.equal("butter_bridge");
            expect(user).to.satisfy(user => {
              const keys = ["username", "avatar_url", "name"];
              return check_keys([user], keys);
            });
          });
      });
      it("GET 404: responds with status 404 if no user is found", () => {
        return request(app)
          .get("/api/users/dkad")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Username does not exist");
          });
      });
      it("GET 405: responds with status 405 if user requests unsupported method and relevant error message", () => {
        return request(app)
          .post("/api/users/sample")
          .expect(405)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Method Not Allowed");
          });
      });
    });
  });

  describe("/articles", () => {
    describe("/", () => {
      it("GET 200: Responds with status 200 and an array of articles containing correct keys", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).to.satisfy(articles => {
              const keys = [
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ];
              return check_keys(articles, keys);
            });
          });
      });
      it("GET 200: Responds with status 200 and an array of article sorted by date - descending; by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET 200: Responds with status 200 and an array of articles sorted by author in alphabetical order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).to.be.sortedBy("author", { ascending: true });
          });
      });
      it("GET 200: Responds with status 200 and an array containing articles from specific author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).to.satisfy(articles => {
              return articles.every(article => {
                return article.author === "butter_bridge";
              });
            });
          });
      });
      it("GET 200: Responds with status 200 and an array containing articles with specified topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).to.satisfy(articles => {
              return articles.every(article => {
                return article.topic === "mitch";
              });
            });
          });
      });
      it("GET 200: Responds with status 200 and an array containing articles where author and topic are specified", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).to.satisfy(articles => {
              return articles.every(article => {
                return (
                  article.author === "butter_bridge" &&
                  article.topic === "mitch"
                );
              });
            });
          });
      });
      it("GET psql-42703 : Responds with status 400 and relevant message when passed incorrect column as 'sort_by' query", () => {
        return request(app)
          .get("/api/articles?sort_by=test")
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Undefined column in query");
          });
      });
      it("GET 404: Responds with status 400 and relevant message when passed an invalid order query", () => {
        return request(app)
          .get("/api/articles?order=test")
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid order query");
          });
      });
      it("GET 404: Responds with status 404 and relevant message when passed invalid author query", () => {
        return request(app)
          .get("/api/articles?author=butter_bdge&")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Author does not exist");
          });
      });
      it("GET 404: Responds with status 404 and relevant message when passed invalid topic query", () => {
        return request(app)
          .get("/api/articles?topic=test")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Topic does not exist");
          });
      });
      it("POST 201: responds with status 201 and new article", () => {
        return request(app)
          .post("/api/articles")
          .send({
            title: "unbelievable",
            topic: "mitch",
            author: "butter_bridge",
            body: "it actually works!"
          })
          .expect(201)
          .then(({ body }) => {
            const { article } = body;
            expect(article.author).to.equal("butter_bridge");
            expect(article.topic).to.equal("mitch");
          });
      });
    });

    describe("/:article_id", () => {
      it("GET 200: responds with the requested article containing author and comments count", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(({ body }) => {
            const article = body.article;
            expect([article]).to.satisfy(article => {
              const keys = [
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ];
              return check_keys(article, keys);
            });
          });
      });
      it("GET 404: responds with status 404 and relevant message when passed non-existing article_id", () => {
        return request(app)
          .get("/api/articles/700")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Article does not exist");
          });
      });
      it("GET 400: responds with status 400 and relevant message when passed incorrect article_id syntax", () => {
        return request(app)
          .get("/api/articles/abc")
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid syntax type");
          });
      });
      it("PATCH 200: responds with status 200 and an object with the incremented vote value", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: 100 })
          .expect(200)
          .then(({ body }) => {
            const article = body.article;
            expect(article.article_id).to.equal(5);
            expect(article.votes).to.equal(100);
            expect([article]).to.satisfy(article => {
              const keys = [
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes"
              ];
              return check_keys(article, keys);
            });
          });
      });
      it("PATCH 404: responds with status 404 and relevant message when passed non-existing article_id", () => {
        return request(app)
          .patch("/api/articles/566")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Article does not exist");
          });
      });
      it("PATCH psql-22P02: responds with status 400 error when the request body contains invalid syntax", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: "a" })
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid syntax type");
          });
      });
      it("PATCH 400: responds with status 400 and relevant message when the request body is in an unsupported/incorrect format", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ inc_vots: 100 })
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal(
              "Body must be in correct format (Ex. { inc_vote: 5 })"
            );
          });
      });
      xit("DELETE 204: Responds with status 204", () => {
        return request(app)
          .delete("/api/articles/2")
          .expect(204);
      });
      it("DELETE 404: Responds with status 404 and relevant message", () => {
        return request(app)
          .delete("/api/articles/610")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Article does not exist");
          });
      });
    });

    describe("/:article_id/comments", () => {
      it("GET 200: Responds with status 200 and an array of all comments for a given article_id", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;
            expect(comments.length).to.equal(2);
            expect(comments).to.satisfy(comments => {
              const keys = [
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              ];
              return check_keys(comments, keys);
            });
          });
      });
      it("GET 200: Responds with status 200 and an array comments for 'article_id: 1' in descending order of date", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;
            expect(comments.length).to.equal(13);
            expect(comments).to.be.sortedBy("created_at", { descending: true });
          });
      });
      it("GET 200: Responds with status 200 and an array sorted by author in alphabetical order", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author&order=asc")
          .expect(200)
          .then(({ body }) => {
            const comments = body.comments;
            expect(comments).to.be.sortedBy("author", { ascending: true });
          });
      });
      it("GET psql-42703: Responds with status 400 and relevant message when passed an invalid sort_by query", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=test")
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Undefined column in query");
          });
      });
      it("GET 400: Responds with status 400 and relevant message when passed invalid order query", () => {
        return request(app)
          .get("/api/articles/1/comments?order=test")
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid order query");
          });
      });
      it("POST 201: Responds with status 201 and the added comment", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: "butter_bridge",
            body: "A very informative article, much like this comment"
          })
          .expect(201)
          .then(({ body }) => {
            const comment = body.comment;
            expect(comment).to.satisfy(comment => {
              const keys = [
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              ];
              return check_keys([comment], keys);
            });
          });
      });
      it("POST 404: responds with status 404 and relevant message when URL contains invalid article id", () => {
        return request(app)
          .post("/api/articles/5000/comments")
          .send({ username: "butter_bridge", body: "body" })
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Article does not exist");
          });
      });
      it("POST 400: responds with status 400 and relevant message when article_id is not an integer", () => {
        return request(app)
          .post("/api/articles/abc/comments")
          .send({ username: "butter_bridge", body: "comment" })
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid syntax type");
          });
      });
      it("POST psql-23503: responds with status 422 and relevant message when request body contains invalid username", () => {
        return request(app)
          .post("/api/articles/5/comments")
          .send({ username: "user", body: "comment" })
          .expect(422)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Foreign key violation");
          });
      });
      it("POST psql-23502: responds with status 400 and relevant message when comment value is null", () => {
        return request(app)
          .post("/api/articles/5/comments")
          .send({ username: "butter_bridge", body: "" })
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Body contains null value");
          });
      });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH 200: Responds with status 201 and increments the votes property by amount specified", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: 15 })
          .expect(200)
          .then(({ body }) => {
            const comment = body.comment;
            expect(comment.votes).to.equal(29);
          });
      });
      it("PATCH 400: Responds with status 400 and relevant message when the inc_votes is not an integer", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: "a" })
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid syntax type");
          });
      });
      it("PATCH 404: Responds with status 404 and relevant message when passed a non-existent comment_id", () => {
        return request(app)
          .patch("/api/comments/500")
          .send({ inc_votes: 60 })
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Comment does not exist");
          });
      });
      it("PATCH 400: Responds with status 400 and relevant message when the request body is in an unsupported/incorrect format", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_voes: "a" })
          .expect(400)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal(
              "Body must be in correct format (Ex. { inc_vote: 5 })"
            );
          });
      });
      it("DELETE 204: Responds with status 204 and confirmation message", () => {
        return request(app)
          .delete("/api/comments/5")
          .expect(204);
      });
      it("DELETE 404: Responds with status 404 and relevant message when passed non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/690")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Comment does not exist");
          });
      });
    });
  });

  describe("generic error handlers", () => {
    describe("send404", () => {
      it("responds with 404 when user requests invalid path/URL", () => {
        return request(app)
          .get("/api/potics")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid URL");
          });
      });
      it("responds with 404 when user requests invalid path/URL", () => {
        return request(app)
          .get("/api/potics")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid URL");
          });
      });
      it("responds with 404 when user requests invalid path/URL", () => {
        return request(app)
          .get("/s")
          .expect(404)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Invalid URL");
          });
      });
    });
    describe("send405", () => {
      it("responds with 405 when a user requests a unsupported method ", () => {
        return request(app)
          .delete("/api/topics")
          .expect(405)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Method Not Allowed");
          });
      });
      it("responds with 405 when a user requests a unsupported method ", () => {
        return request(app)
          .get("/api/comments/5")
          .expect(405)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Method Not Allowed");
          });
      });
      it("responds with 405 when a user requests a unsupported method ", () => {
        return request(app)
          .delete("/api/articles")
          .expect(405)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Method Not Allowed");
          });
      });
      it("responds with 405 when a user requests a unsupported method ", () => {
        return request(app)
          .delete("/api")
          .expect(405)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Method Not Allowed");
          });
      });
      it("responds with 405 when a user requests a unsupported method ", () => {
        return request(app)
          .post("/api")
          .expect(405)
          .then(({ body }) => {
            const error = body.msg;
            expect(error).to.equal("Method Not Allowed");
          });
      });
    });
  });

  describe("login functionality", () => {
    describe("createUser", () => {
      it("POST 201 - responds with status 201, new user and a confirmation messsage", () => {
        return request(app)
          .post("/api/users")
          .send({ username: "user", password: "pass", name: "Neil" })
          .expect(201)
          .then(({ body }) => {
            const { user, msg } = body;
            expect(user.username).to.equal("user");
            return expect(msg).to.equal("user created!");
          });
      });
      it("POST 400 - responds with status 400 and relevant messsage if username contains incorrect syntax", () => {
        return request(app)
          .post("/api/users")
          .send({ username: "%%%% ", password: "pass", name: "Neil" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            return expect(msg).to.equal(
              "username must only contain alphanumeric characters"
            );
          });
      });
      it("POST 400 - responds with status 400 and relevant messsage if name contains incorrect syntax", () => {
        return request(app)
          .post("/api/users")
          .send({ username: "user", password: "pass", name: "Neil%" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            return expect(msg).to.equal(
              "name must only contain only A-Z characters"
            );
          });
      });
      it("POST 400 - responds with status 400 and relevant messsage if password contains incorrect syntax", () => {
        return request(app)
          .post("/api/users")
          .send({ username: "user", password: "pass ", name: "Neil" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            return expect(msg).to.equal(
              "password must only contain alphanumeric characters"
            );
          });
      });
      it("POST 400 - responds with status 400 and relevant messsage sent incomplete post request", () => {
        return request(app)
          .post("/api/users")
          .send({ name: "Neil" })
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            return expect(msg).to.equal("Body contains null value");
          });
      });
    });

    describe("validateUserCreds", () => {
      it("POST 200: responds with status 200 and true if username and password match", () => {
        return request(app)
          .post("/api/login")
          .send({ username: "butter_bridge", password: "pass" })
          .expect(200)
          .then(res => {
            const { match } = res.body;
            expect(match).to.equal(true);
          });
      });
      it("POST 404: responds with status 404 if username is not found", () => {
        return request(app)
          .post("/api/login")
          .send({ username: "butter_brid", password: "pass" })
          .expect(404)
          .then(res => {
            const { msg } = res.body;
            expect(msg).to.equal("Username does not exist");
          });
      });
      it("POST 401: responds with status 401 and a response of false if password does not match", () => {
        return request(app)
          .post("/api/login")
          .send({ username: "butter_bridge", password: "invalid" })
          .expect(401)
          .then(res => {
            const { msg } = res.body;
            expect(msg).to.equal("Invalid password");
          });
      });
    });
  });
});

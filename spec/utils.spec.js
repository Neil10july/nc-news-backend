const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an array", () => {
    const output = formatDates([]);
    expect(output).to.be.an("array");
  });
  it("returns an array containing a single data object with the correct timestamp format", () => {
    const input = [{ created_at: 1542284514171 }];
    const expected = [{ created_at: new Date(1542284514171) }];
    const output = formatDates(input);
    expect(output).to.eql(expected);
  });
  it("returns an array containing multiple data objects with the correct timestamp format", () => {
    const input = [
      { created_at: 1542284514171 },
      { created_at: 1416140514171 },
      { created_at: 1289996514171 }
    ];
    const expected = [
      { created_at: new Date(1542284514171) },
      { created_at: new Date(1416140514171) },
      { created_at: new Date(1289996514171) }
    ];
    const output = formatDates(input);
    expect(output).to.eql(expected);
  });
  it("does not manipulate passed data array", () => {
    const input = [{ created_at: 1542284514171 }];
    const copy = [{ created_at: 1542284514171 }];
    formatDates(input);
    expect(input).to.eql(copy);
  });
  it("does not manipulate passed data containing multiple keys", () => {
    const input = [
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      }
    ];
    const expected = [
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date(1163852514171)
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: new Date(1037708514171)
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: new Date(911564514171)
      }
    ];
    const output = formatDates(input);
    expect(output).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("correctly returns a reference object when passed an array containing one data object", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = { "Living in the shadow of a great man": 1 };
    const actual = makeRefObj(input);
    expect(actual).to.eql(expected);
  });
  it("correctly returns an object consisting of multiple references when passed an array containing multiple data objects", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const expected = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3
    };
    const actual = makeRefObj(input);
    expect(actual).to.eql(expected);
  });
  it("does not manipulate passed data", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const input_copy = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    makeRefObj(input);
    expect(input).to.eql(input_copy);
  });
});

describe("formatComments", () => {
  it("correctly formats timestamp and assigns article_id to relevant title when passed an array containing one data object", () => {
    const input = [
      {
        comment_id: 1,
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const article_ref = { "Living in the shadow of a great man": 1 };
    const expected = [
      {
        comment_id: 1,
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    const actual = formatComments(input, article_ref);
    expect(actual).to.eql(expected);
  });
  it("correctly formats timestamp and assigns article_id to relevant title when passed an array containing multiple data objects", () => {
    const input = [
      {
        comment_id: 1,
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        comment_id: 2,
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        comment_id: 3,
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const expected = [
      {
        comment_id: 1,
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 2,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        comment_id: 2,
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        comment_id: 3,
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 1,
        author: "icellusedkars",
        votes: 100,
        created_at: new Date(1448282163389)
      }
    ];
    const article_ref = {
      "Living in the shadow of a great man": 1,
      "They're not exactly dogs, are they?": 2
    };
    const actual = formatComments(input, article_ref);
    expect(actual).to.eql(expected);
  });
});

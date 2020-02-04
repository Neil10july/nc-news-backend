const formatDates = list => {
  const formatted_data = [];
  const data_copy = [...list];

  data_copy.forEach(datum => {
    const datum_copy = { ...datum };
    const epoch_time = datum.created_at;
    const formatted_timestamp = new Date(epoch_time);

    datum_copy.created_at = formatted_timestamp;
    formatted_data.push(datum_copy);
  });

  return formatted_data;
};

const makeRefObj = list => {
  const data_copy = [...list];
  const ref_obj = {};

  data_copy.forEach(datum => {
    ref_obj[datum.title] = datum.article_id;
  });

  return ref_obj;
};

const formatComments = (comments, articleRef) => {
  const comments_copy = [...comments];
  const format_this = formatDates(comments_copy);
  const formatted_data = [];

  format_this.forEach(datum => {
    const datum_copy = { ...datum };

    datum_copy.article_id = articleRef[datum.belongs_to];
    datum_copy.author = datum.created_by;

    delete datum_copy.belongs_to;
    delete datum_copy.created_by;

    formatted_data.push(datum_copy);
  });

  return formatted_data;
};

module.exports = { formatDates, makeRefObj, formatComments };

/* 
      
      Your article data is currently in the incorrect format and will violate your SQL schema. 
      You will need to write and test the provided formatDate utility function to be able insert your article data.
      Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
 */
/* 

      Your comment data is currently in the incorrect format and will violate your SQL schema. 
      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
*/

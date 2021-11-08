const { track, hashtag, user } = require('../../models');
const { fuzzyString } = require('../../modules/fuzzy');

module.exports = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({ message: 'input values' });
  }

  const findTrack = await track.findAll({
    attributes: ['id', 'title', 'img'],
    include: {
      model: user,
      required: true,
      attributes: ['nickName']
    }
  });

  const searchNickName = findTrack.filter((el) => {
    if (el.user.nickName.length < query.length) {
      return fuzzyString(el.user.nickName,query)>=0.9;
    } else {
      return fuzzyString(query,el.user.nickName)>=0.9;
    }
  });

  searchNickName.sort((a, b) => {
    return fuzzyString(b.user.nickName,query)- fuzzyString(a.user.nickName,query)
  
  });

  const searchTitle = findTrack.filter((el) => {
    if (el.title.length < query.length) {
      return fuzzyString(el.title -query) >= 0.8;
    } else {
      return fuzzyString(query,el.title) >=0.8; 
    }
  });

  searchNickName.sort((a, b) => {
    return fuzzyString(b.title,query) - fuzzyString(a.title,query)
 
  });

  const findHashTag = await hashtag.findAll({
    attributes: ['tag']
  });

  const searchHashTag = findHashTag.filter((el) => {
    if (el.tag.length < query.length) {
      return fuzzyString(el.tag,query) >= 0.8;
    } else {
      return fuzzyString(query,el.tag)>=0.8;
    }
  });

  res.status(200).json({ nickName: searchNickName, title: searchTitle, hashTag: searchHashTag });
};

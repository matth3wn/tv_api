const xss = require('xss');

const AddShowService = {
  insertShow(db, show){
    return db
      .insert(show)
      .into('shows')
      .returning('*')
      .then(([show]) => show);
  },
  serializeShow(shows) {
    return {
      id: shows.id,
      title: xss(shows.title),
      content: xss(shows.content),
      day: xss(shows.day),
      show_time: xss(shows.show_time),
      duration: xss(shows.duration),
      user_id: shows.user_id,
      network: xss(shows.network),
      uuid:shows.uuid
    };
  },
  getUserID(db,username){
    return db 
      .from('users')
      .select('id')
      .where('user_name', username)
  },
  getUserShows(db, user_id){
    return db 
      .from('shows')
      .join('users', 'users.id', '=','shows.user_id')
      .select('*')
      .where('users.id', user_id)
  },
  update(db, id, show){
    return db('shows')
     .where('uuid', id)
     .update(show)
  },
  delete(db,id){
    return db('shows')
      .where('uuid', id)
      .delete()
  },
  getShowsByUuid(db, id){
    return db('shows')
      .select('*')
      .where('uuid',id)
  }
    
}

module.exports = AddShowService;
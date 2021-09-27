import React from 'react';

function PlayList ({ num, music, handleChangeMusic, handleDeleteMusic }) {
  return (
    <li className='track'>

      <button className='track-delete' onClick={(e) => { handleDeleteMusic(e, num); }}>X</button>
      <div className='track-box' onClick={() => { handleChangeMusic(num); }}>

        <img className='track-img' src={music.img} alt={music.title} />
        <div className='track-info'>
          <p className='track-title'>{music.title}</p>
          <p className='track-artist'>{music.user.nickname}</p>
        </div>
      </div>
    </li>

  );
}

export default PlayList;
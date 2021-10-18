import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './index.scss';

// import glass from '../../assets/glass'

function Search () {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');

  function handleSearchValue (e) {
    setSearchValue(e.target.value);
  }

  // 검색어 입력후 엔터 누르면 실행되는 함수
  function moveToSearchTrack (e) {
    e.preventDefault();
    // 검색 페이지로 이동
    history.push({
      pathname: `/searchtrack/${searchValue}`,
      state: {
        search: searchValue
      }
    });
  }

  return (
    <form className='search-form' onSubmit={(e) => moveToSearchTrack(e)}>
      <h2 className='a11yHidden'>검색</h2>
      <fieldset>
        <input type='search' id='search' name='search' className='search' placeholder='어떤 음악을 찾고 계신가요?' onChange={(e) => handleSearchValue(e)} />
      </fieldset>
    </form>
  );
}

export default Search;

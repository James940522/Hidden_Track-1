import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getTrackDetails, inputPlayList } from '../../Redux/actions/actions';
import Portal from './Portal';
import './ContentDeleteModal.scss';

function ContentDeleteModal ({ visible, setIsContentDeleteModalOpen, isLogin, trackDetail, accessToken, handleNotice }) {
  const history = useHistory();
  const dispatch = useDispatch();

  // 삭제 확인 모달창 배경을 클릭하면 모달창이 닫히는 함수
  function handleContentModalBack (e) {
    e.preventDefault();
    setIsContentDeleteModalOpen(false);
  }

  // 예 버튼 클릭시 삭제 요청 보내는 함수
  function requestDeleteTrack (e) {
    e.preventDefault();
    if (!isLogin) {
      setIsContentDeleteModalOpen(false);
      handleNotice('로그인이 필요합니다.', 5000);
      return;
    }

    axios.delete(`${process.env.REACT_APP_API_URL}/track/${trackDetail.track.id}`, {
      headers: {
        accesstoken: accessToken
      }
    })
      .then(res => {
        if (res.status === 200) {
        // trackDetail 상태 초기화
          dispatch(getTrackDetails({
            track: {
              id: '',
              title: '',
              img: '',
              genre: '',
              soundtrack: '',
              releaseAt: '',
              lyric: '',
              user: {
                nickName: ''
              },
              hashtag: [],
              replies: []
            },
            like: '',
            gradeAev: '',
            myLike: false
          }));
          // 플레이리스트 최신화 (삭제한곡이 재생목록에 있을 경우를 대비)
          axios.get(`${process.env.REACT_APP_API_URL}/playlist`, { headers: { accesstoken: accessToken } })
            .then(res => {
              if (res.status === 200) {
                dispatch(inputPlayList(res.data.playlist));
                // setCrrentMusic(playList[res.data.playlist.length - 1]);
                // audio.current.pause();
              }
            })
            .catch(err => {
              if (err.response) {
                if (err.response.status === 404) {
                  dispatch(inputPlayList([]));
                  // audio.current.pause();
                  // setCrrentMusic(playList[playList.length-1])
                }
              } else console.log(err);
            }
            );

          setIsContentDeleteModalOpen(false);
          handleNotice('게시글이 삭제 되었습니다.', 5000);
          history.push('/main');
        }
      })
      .catch(err => {
        console.log(err.response);
        if (err.response) {
          if (err.response.status === 401) {
            setIsContentDeleteModalOpen(false);
            handleNotice('권한이 없습니다.', 5000);
          }
        } else console.log(err);
      });
  }

  // 삭제 확인 모달창 아니오 클릭시 모달창 닫히는 함수
  function handleContentDeleteModalCloseBtn (e) {
    e.preventDefault();
    setIsContentDeleteModalOpen(false);
  }

  return (
    <>
      <Portal elementId='modal-root'>
        <div
          className='modal-backdrop__content-delete' style={visible ? { display: 'block' } : { display: 'none' }}
          visible={visible.toString()} onClick={(e) => handleContentModalBack(e)}
        />
        <form className='modal-container__content-delete' onSubmit={requestDeleteTrack}>
          <fieldset>
            <legend className='a11yHidden'>음원 삭제 폼</legend>
            <p className='content-delete-modal-title'>해당 컨텐츠를 삭제하시겠습니까?</p>
            <div className='modal__content-delete-btn'>
              <button type='submit'>예</button>
              <button onClick={(e) => handleContentDeleteModalCloseBtn(e)}>아니오</button>
            </div>
            <label htmlFor='content-delete-modal-close-btn' className='content-delete-modal-close-btn' onClick={(e) => handleContentDeleteModalCloseBtn(e)}>X</label>
            <button id='content-delete-modal-close-btn' style={{ display: 'none' }} />
          </fieldset>
        </form>
      </Portal>
    </>
  );
}

export default ContentDeleteModal;

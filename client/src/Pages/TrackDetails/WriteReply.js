import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getTrackDetails, isLoginModalOpenHandler, getAccessToken, isLoginHandler } from '../../Redux/actions/actions';
// import { RefreshTokenRequest } from '../../Components/TokenFunction';

function WriteReply ({
  trackDetail,
  isLogin,
  isLoginModalOpen,
  accessToken,
  clickedBtn,
  setClickedBtn,
  selectedReplyId,
  setSelectedReplyId,
  handleNotice
}) {
  const [inputText, setInputText] = useState('');

  const dispatch = useDispatch();

  axios.defaults.headers.common.accesstoken = accessToken;

  useEffect(() => {
    // 댓글 수정 버튼 클릭시 댓글 작성란에 해당 댓글 내용 불러오기
    if (clickedBtn === '수정') {
      const reply = trackDetail.track.replies.filter(el => el.id === Number(selectedReplyId));
      if (reply && reply.length !== 0) setInputText(reply[0].content);
    }
  }, [clickedBtn, selectedReplyId, trackDetail]);

  useEffect(() => {
    isValidLength();
  }, [inputText]);

  // text 인풋값 상태에 저장
  function handleInputText (e) {
    setInputText(e.target.value);
  }

  // 글자수 제한 유효성 검사 함수
  function isValidLength () {
    if (inputText.length > 100) {
      handleNotice('댓글은 100자를 초과할 수 없습니다.', 5000);
      setInputText(inputText.slice(0, 100));
    }
  }

  // 작성한 댓글 등록 요청 보내는 함수
  function requestReply (e) {
    e.preventDefault();
    // 댓글 유효성 검사
    if (!inputText) return handleNotice('댓글을 입력하세요', 5000);

    // 만약 비로그인 상태라면 로그인 모달창 떠야함
    if (!isLogin) {
      handleNotice('로그인 후 이용할 수 있습니다.', 5000);
      return dispatch(isLoginModalOpenHandler(true));
    }

    axios.post(`${process.env.REACT_APP_API_URL}/reply`, {
      trackId: trackDetail.track.id,
      content: inputText
    })
      .then(res => {
        if (res.status === 201) {
          // 댓글 등록 성공시 음원 상세 정보 새로 받아오는 요청
          axios.get(`${process.env.REACT_APP_API_URL}/track/${trackDetail.track.id}`)
            .then(res => {
              if (res.status === 200) {
                // 댓글 등록 성공후 음원 상세 정보 다시 받아옴
                dispatch(getTrackDetails(res.data));
              }
            })
            .catch(err => {
              console.log(err.response);
              if (err.response) {
                if (err.response.status === 400) handleNotice('잘못된 요청입니다.', 5000);
                if (err.response.status === 404) handleNotice('해당 음원을 찾을 수 없습니다.', 5000);
              } else console.log(err);
            });
          // 등록 완료 후 input값 초기화
          setInputText('');
          handleNotice('댓글이 등록되었습니다.', 5000);
        }
      })
      .catch(err => {
        console.log(err.response);
        if (err.response) {
          if (err.response.status === 400) handleNotice('잘못된 요청입니다.', 5000);
          if (err.response.status === 401) handleNotice('권한이 없습니다.', 5000);
        } else console.log(err);
      });
  }

  // 댓글 수정 버튼 클릭시 수정 요청 보내는 함수
  function requestModifyReply (e) {
    e.preventDefault();

    if (!inputText) return handleNotice('댓글을 입력하세요', 5000);

    if (!accessToken) {
      // 만약 액세스 토큰이 상태에 없으면 다시 받아옴
      // RefreshTokenRequest();
      axios.get(`${process.env.REACT_APP_API_URL}/user/token`, {
        withCredentials: true
      })
        .then(res => {
          if (res.status === 200) {
            dispatch(getAccessToken(res.data.data));
          }
        })
        .catch(err => {
          console.log(err.response);
          // 만약 유효하지 않은 리프레시 토큰이라면, 로그인 상태 false로
          handleNotice('refresh token이 만료되어 불러올 수 없습니다. 다시 로그인 해주시기 바랍니다.', 5000);
          dispatch(isLoginHandler(false));
        });
    }

    axios.patch(`${process.env.REACT_APP_API_URL}/reply`, {
      id: selectedReplyId,
      content: inputText
    })
      .then(res => {
        if (res.status === 200) {
          // 수정 완료되면 음원 상세 정보 다시 받아옴
          axios.get(`${process.env.REACT_APP_API_URL}/track/${trackDetail.track.id}`)
            .then(res => {
              if (res.status === 200) {
                dispatch(getTrackDetails(res.data));
              }
            })
            .catch(err => {
              console.log(err.response);
              if (err.response) {
                if (err.response.status === 400) handleNotice('잘못된 요청입니다.', 5000);
                if (err.response.status === 404) handleNotice('해당 음원을 찾을 수 없습니다.', 5000);
              } else console.log(err);
            });
          // 수정 요청 완료 후 input값 초기화
          setInputText('');
          setSelectedReplyId('');
          setClickedBtn('삭제');
          handleNotice('댓글이 수정되었습니다.', 5000);
        }
      })
      .catch(err => {
        console.log(err.response);
        if (err.response) {
          if (err.response.status === 400) handleNotice('잘못된 요청입니다.', 5000);
          if (err.response.status === 401) handleNotice('권한이 없습니다.', 5000);
          if (err.response.status === 404) handleNotice('게시글 혹은 해당 댓글을 찾을 수 없습니다.', 5000);
        } else console.log(err);
      });
  }

  // 취소 버튼 클릭시 선택한 버튼 상태와 선택한 댓글 상태 변경하는 함수
  function cancelModify (e) {
    e.preventDefault();
    setSelectedReplyId('');
    setClickedBtn('삭제');
    setInputText('');
  }

  return (
    <div className='write-reply-container'>
      {clickedBtn === '수정'
        ? <textarea className='write-reply-area' value={inputText} onChange={(e) => handleInputText(e)} />
        : <textarea className='write-reply-area' value={inputText} onChange={(e) => handleInputText(e)} />}
      {clickedBtn === '수정'
        ? <div className='write-reply-btn-box'>
          <button className='contents__btn modify-reply-btn' onClick={(e) => requestModifyReply(e)}>댓글 수정</button>
          <button className='contents__btn cancel-reply-btn' onClick={(e) => cancelModify(e)}>취소</button>
        </div>
        : <div className='write-reply-btn-box'>
          <button className='contents__btn create-reply-btn' onClick={(e) => requestReply(e)}>댓글 등록</button>
        </div>}
    </div>
  );
}

export default WriteReply;

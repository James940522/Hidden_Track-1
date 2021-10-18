import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { getTrackDetails, getUserInfo, isLoadingHandler, inputPlayList } from '../../Redux/actions/actions';
import InputHashTag from './InputHashTag';
import Footer from '../../Components/Footer';
import axios from 'axios';
import './index.scss';
// import { noExtendLeft } from 'sequelize/types/lib/operators';
// trackId 값은 수정 버튼을 눌렀을때 localstorage에 저장시킨다. 여기서는 값만 가져오고 페이지를 벗어날때는 삭제시킨다.
// trackdetail의 id값을 localstorage에 저장해서 새로고침시 값이 날라가지 않게 한다.
axios.defaults.withCredentials = true;
const default_album_img = 'https://hidden-track-bucket.s3.ap-northeast-2.amazonaws.com/trackimage/8001633698891683.png';

function ContentsModiCreate ({ handleNotice, isLoading }) {
  const loca = useLocation();
  const trackId = loca.pathname.split('/')[2];
  const history = useHistory();
  const userInfo = useSelector(state => state.userInfoReducer);
  const playList = useSelector(state => state.playListReducer.playList);
  const { accessToken } = useSelector(state => state.accessTokenReducer);
  const trackDetail = useSelector(state => state.trackDetailReducer);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState({
    id: trackId ? trackDetail.track.id : '',
    title: trackId ? trackDetail.track.title : '',
    genre: trackId ? trackDetail.track.genre : '',
    releaseAt: trackId ? trackDetail.track.releaseAt : '',
    lyric: trackId ? trackDetail.track.lyric : '등록된 가사가 없습니다.',
    tag: trackId ? trackDetail.track.hashtags.map(el => el.tag) : []
  });
  const [src, setSrc] = useState(trackId ? trackDetail.track.img : default_album_img);
  const trackImgName = trackDetail.track.img.split('trackimage/')[1];
  const trackFileName = trackDetail.track.soundtrack.split('trackfile/')[1];
  const [files, setFiles] = useState({ image: { name: trackId ? trackImgName : '' }, audio: { name: trackId ? trackFileName : '' } });

  useEffect(() => {
    // 음원 수정 페이지를 벗어나면 수정 버튼 상태를 false로 바꿔줌
    if (trackId) {
      axios.get(`${process.env.REACT_APP_API_URL}/track/${trackId}`)
        .then(res => {
          if (res.status === 200) dispatch(getTrackDetails(res.data));
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 400) handleNotice('잘못된 요청입니다.', 5000);
            if (err.response.status === 404) {
              handleNotice('해당 게시글을 찾을 수 없습니다.', 5000);
              history.push('/main');
            }
          } else console.log(err);
        });
    }
    return () => {

    };
  }, []);

  // ?##############################################################################################
  // input값 state 저장 함수
  function handleInputValue (key, e, value) {
    if (key === 'tag') {
      e.preventDefault();
      setInputValue({ ...inputValue, [key]: [...inputValue.tag, e.target.value] });
    } else if (key === 'deleteTag') {
      e.preventDefault();
      setInputValue({ ...inputValue, tag: value });
    } else {
      e.preventDefault();
      setInputValue({ ...inputValue, [key]: e.target.value });
    }
  }

  // input 필수 값이 입력 되었는지 체크하는 함수
  function CheckEssential () {
    // 필수값 곡제목, 장르, 날짜, 음원
    if (!inputValue.title === '') {
      handleNotice('필수값을 입력 해주세요(곡 제목)', 2500);
      return false;
    } else if (inputValue.genre === '') {
      handleNotice('필수값을 입력 해주세요(장르)', 2500);
      return false;
    } else if (inputValue.releaseAt === '') {
      handleNotice('필수값을 입력 해주세요(발매일)', 2500);
      return false;
    } else if (files.audio.name === '') {
      handleNotice('필수값을 입력 해주세요(음원 파일)', 2500);
      return false;
    } else {
      // 전부 입력됨
      return true;
    }
  }

  // 파일 업로드시 확장자 유효성 검사 함수
  function isValidFile (key, file) {
    if (key === 'image') {
      // svg 제외
      const type = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp'
      ];
      return type.indexOf(file.type) > -1;
    } else if (key === 'audio') {
      return file.type.match('audio/');
    }
  }

  // 접근 권한 유효성 검사 함수
  function isValidUser () {
    // 음원 등록으로 들어왔을 경우
    if (!trackId) {
      return userInfo.admin === 'artist';
    }
    // 수정 버튼으로 들어왔을 경우
    else {
      return userInfo.admin === 'artist' && userInfo.nickName === trackDetail.track.user.nickName;
    }
  }
  // ?##############################################################################################
  // 이미지 미리보기 함수
  function handleFileRead (key, e) {
    e.preventDefault();
    const file = e.target.files[0];

    // 파일을 올리지 않을시 에러 대비
    if (!file) return;

    // 서버에 formdata형식으로 파일을 보내기 위한 로직
    if (!isValidFile(key, file)) {
      return handleNotice(`${key} 파일만 업로드 가능합니다.`, 5000);
    } else if (key === 'image') {
      setFiles({ ...files, [key]: file });
      // 파일을 읽기 위해 FileReader를 호출함 파일을 아직 읽은것은 아님
      const reader = new FileReader();

      // 파일을 url값으로 읽는 이벤트 총 4가지중 하나
      reader.readAsDataURL(file);

      // 이 이벤트는 읽기 동작이 성공적으로 완료 되었을 때마다 발생합니다.
      reader.onload = function () {
        setSrc(reader.result);
      };
    } else if (key === 'audio') {
      setFiles({ ...files, [key]: file });
    }
  }

  // s3에 업로드 하는 함수
  function uploadFile (key, method) {
    // FormData 형식으로 s3에 이미지를 업로드 하기 위해 FormData를 호출함
    const formData = new FormData();
    let path;
    // FormData 객체안에 이미 키가 존재하면 그 키에 새로운 값을 추가하고, 키가 없으면 추가합니다.
    if (key === 'image') {
      if (src === default_album_img || src === trackDetail.track.img) {
        return src;
      } else {
        path = 'trackimage';
        // formData.append('img', files.image);
        formData.append('trackimage', files.image);
      }
    } else if (key === 'audio') {
      if (files.audio.name === trackFileName) {
        return trackDetail.track.soundtrack;
      }
      path = 'trackfile';
      // formData.append('soundtrack', files.audio);
      formData.append('trackfile', files.audio);
    }
    // return method('http://localhost:4000/upload', formData)
    return method(`${process.env.REACT_APP_API_URL}/track/${path}`, formData)
      .then(res => {
        if (res.status === 201) {
          // console.log('확인',{[key === 'image'?'img':'soundtrack']:key === 'image'?'res.data.image_url':'res.data.trackurl'})
          let data;
          if (key === 'image') {
            // key = 'img'
            return res.data.image_url;
          } else {
            key = 'soundtrack';
            return res.data.track_url;
          }
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.status === 401) {
            handleNotice('권한이 없습니다.', 5000);
          }
        }
        console.log(err);
        handleNotice('파일 업로드에 실패하였습니다.', 5000);
      });
  }

  // 음원 등록 요청 함수
  async function requestCreate (e) {
    e.preventDefault();
    // s3에 음원 이미지 업로드 해야됨
    // 성공하면 state에 그 url값을 저장하잖아요
    // 근데 여기서 state가
    // 유효성 통과 됐을 경우
    if (CheckEssential()) {
      let method;
      if (trackId) {
        method = axios.patch;
      } else {
        method = axios.post;
      }

      dispatch(isLoadingHandler(true));
      handleNotice('업로드중.. 잠시 기다려주세요', 5000);
      const audioUpload = await uploadFile('audio', method);
      const imageUpload = await uploadFile('image', method);

      if (audioUpload && imageUpload) {
        const body = { ...inputValue, img: imageUpload, soundtrack: audioUpload };
        await method(`${process.env.REACT_APP_API_URL}/track`, body, { headers: { accesstoken: accessToken } })
          .then(res => {
            if (res.status === 200 || res.status === 201) {
              const check = playList.map(el => {
                return el.track.id === res.data.trackId;
              });
              if (check.includes(true)) {
                axios.get(`${process.env.REACT_APP_API_URL}/playlist`, { headers: { accesstoken: accessToken } })
                  .then(res => {
                    if (res.status === 200) {
                      dispatch(inputPlayList(res.data.playlist));
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
                  });
              }
              handleNotice(trackId ? '음원 수정을 완료하였습니다' : '음원 등록을 완료하였습니다.', 5000);
              dispatch(isLoadingHandler(false));
              history.push(`/trackdetails/${res.data.trackId}`);
            }
          })
          .catch(err => {
            if (err.response) {
              if (err.status === 400) {
                handleNotice('입력값이 부족합니다!', 5000);
              } else if (err.status === 401) {
                handleNotice('권한이 없습니다.', 5000);
              }
            }
            console.log(err);
          });
      } else {

      }
      dispatch(isLoadingHandler(false));
    }
    dispatch(isLoadingHandler(false));
  }

  // ?##############################################################################################

  return (
    <>
      <div id='modi-create' className={isValidUser()?'':'Bad-user'}>
        {isValidUser()
          ? <>
            <div className='default-input-box'>
              <div className='album-img-box'>
                <img className='album-img' src={src} alt='' />
                <div className='album-input-info'>※ 이미지는 500 * 500 사이즈를 권장합니다.</div>
                <label htmlFor='album-input-btn' className='album-input-btn'>앨범 이미지 첨부</label>
                <span>{!files.image.name === '' ? 'No file chosen' : `${files.image.name}`}</span>
                <input id='album-input-btn' type='file' style={{ display: 'none' }} onChange={(e) => { handleFileRead('image', e); }} />
              </div>
              <section className='default-input-section'>
                <input
                  type='text' id='title-input' className='music-input' placeholder='곡 제목' value={inputValue.title} onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      handleInputValue('title', e);
                    } else {
                      handleNotice('곡 제목은 50자를 초과할 수 없습니다.', 5000);
                      e.target.value = e.target.value.slice(0, e.target.value.length - 1);
                    }
                  }}
                />
                {/* <span id='genre-input' className='music-input'></span> */}
                <div className='music-input-box'>
                  <label className='music-genre-release-label' htmlFor='music-genre-release' style={{ fontSize: '20px' }}>장르 :</label>
                  <select name='genre' id='genre-input' className='music-genre-release' defaultValue={inputValue.genre} onChange={(e) => { handleInputValue('genre', e); }}>
                    <option hidden='' disabled='disabled' value=''>--음원 장르를 선택 해주세요--</option>
                    <option style={{ background: '#1F104D' }} value='Ballad'>Ballad</option>
                    <option style={{ background: '#1F104D' }} value='HipHop'>HipHop</option>
                    <option style={{ background: '#1F104D' }} value='R&B'>R&B</option>
                    <option style={{ background: '#1F104D' }} value='Rock'>Rock</option>
                    <option style={{ background: '#1F104D' }} value='Jazz'>Jazz</option>
                  </select>
                </div>
                <div className='music-input-box'>
                  <label className='music-genre-release-label' htmlFor='music-genre-release' style={{ fontSize: '20px' }}>발매일 :</label>
                  <input type='date' className='music-genre-release' value={inputValue.releaseAt} onChange={(e) => { handleInputValue('releaseAt', e); }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <label htmlFor='music-input-btn' className='music-input-btn'>음원 파일 첨부</label>
                  <div>{!files.audio.name === '' ? 'No file chosen' : `${files.audio.name}`}</div>
                  <input type='file' id='music-input-btn' style={{ display: 'none' }} onChange={(e) => { handleFileRead('audio', e); }} />
                </div>

              </section>
            </div>
            <section className='music-lyrics-hashtag-box'>
              <div className='music-lyrics-input'>
                <label className='music-lyrics-label'>가사</label>
                <textarea className='input-lyrics' placeholder='가사를 작성해주세요' value={inputValue.lyric} onChange={(e) => { handleInputValue('lyric', e); }} />
              </div>
              <InputHashTag tagList={inputValue.tag} handleInputValue={handleInputValue} handleNotice={handleNotice} />
            </section>
            <div className='modi-create-btn-box'>
              <button className='contents__btn modi-create-btn' onClick={(e) => { requestCreate(e); }}>{trackId ? '음원 수정' : '음원 등록'}</button>
            </div>

            </>
          : <h1 className='Bad'>잘못된 접근 입니다.</h1>}
      </div>
      <Footer />
    </>
  );
}

export default ContentsModiCreate;

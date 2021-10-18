import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import axios from 'axios';
import styled from 'styled-components';

import Slider from 'react-slick';

import './slick.css';
import './slick-theme.css';

import './index.scss';

const settings = {
  className: 'center',
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 2000,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0px',
  afterChange: function (index) {
    // console.log(
    //   `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
    // );
  }
};

function Slide () {
  const history = useHistory();

  const { accessToken } = useSelector(state => state.accessTokenReducer);

  const [chart, setChart] = useState([]);
  const [latestChart, setLatestChart] = useState('');
  const [popularChart, setPopularChart] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/track/charts/all`,
      { headers: { accesstoken: accessToken } })
      .then((res) => {
        setChart(res.data.popularchart);
        setLatestChart(res.data.latestchart);
        setPopularChart(res.data.popularchart);
      })
      .catch(err => {
        console.log(err);
      }
      );
    return () => setLoading(false);
  }, []);

  function handleRecent (e) {
    e.preventDefault();
    setChart(latestChart);
  }

  function handlePopular (e) {
    e.preventDefault();
    setChart(popularChart);
  }

  function moveTrackDetail (e, id) {
    history.push(`/trackdetails/${id}`);
  }

  return (
    <section className='slide-container'>
      <div className='slide-btn'>
        <span className='popular sign-four' onClick={(e) => handlePopular(e)}>H O T</span>
        <span className='recent sign-four' onClick={(e) => handleRecent(e)}>N E W</span>
      </div>

      <Slider {...settings}>
        {chart.map((slide, i) => {
          const { img, id } = slide;
          return (
            <div className='slide' key={id}>
              <ImgSlide img={img} onClick={(e) => moveTrackDetail(e, id)} />
            </div>
          );
        })}
      </Slider>
    </section>
  );
}

export default Slide;

export const ImgSlide = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${props => props.img});
  background-size: cover;
  background-position: center;
  cursor: pointer;

`;

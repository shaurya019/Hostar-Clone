import React, { useEffect } from 'react';
import styled from 'styled-components';
import ImgSlider from './ImgSlider';
import NewDisney from './NewDisney';
import Originals from './Originals';
import Recommends from './Recommends';
import Trending from './Trending';
import Viewers from './Viewers';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies } from '../features/movie/movieSlice';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { selectUserName } from '../features/user/userSlice';
import { firebaseApp } from '../firebase';

const Home = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  let recommends = [];
  let newDisneys = [];
  let originals = [];
  let trending = [];
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = collection(db, 'movies');
        const snapshot = await getDocs(moviesCollection);
        const moviesData = snapshot.docs.map((doc) => {
          switch (doc.data().type) {
            case "recommend":
              recommends = [...recommends, { id: doc.id, ...doc.data() }];
              break;
  
            case "new":
              newDisneys = [...newDisneys, { id: doc.id, ...doc.data() }];
              break;
  
            case "original":
              originals = [...originals, { id: doc.id, ...doc.data() }];
              break;
  
            case "trending":
              trending = [...trending, { id: doc.id, ...doc.data() }];
              break;
          }
        });
        dispatch(
          setMovies({
            recommend: recommends,
            newDisney: newDisneys,
            original: originals,
            trending: trending,
          })
        );
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [userName, dispatch, db]);

  return (
    <Container>
      <ImgSlider />
      <Viewers />
      <Recommends />
      <NewDisney />
      <Originals />
      <Trending />
    </Container>
  );
};

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url("/images/home-background.png") center center / cover no-repeat fixed;
    content: '';
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

export default Home;

/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import styled from 'styled-components';
import useMoveScroll from './hooks/useMoveScroll';
import { COLOR } from './style/Theme';
import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Calendar from './component/Calendar';

const Main = styled.main`
  width: 100%;
  min-width: 360px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR.main_green};
`;

const FirstContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.header`
  h1 {
    font-size: 48px;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 700;
  }
  h2 {
    font-size: 25px;
    text-align: center;
  }
`;

const MovePageButton = styled.button`
  width: 200px;
  height: 50px;
  position: absolute;
  bottom: 60px;
  text-align: center;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 3px 3px 2px ${COLOR.button_shadow};
  background-color: ${COLOR.main_yellow};
  font-size: 18px;
  font-weight: 600;
  :hover {
    background-color: ${COLOR.main_yellow_hover};
    box-shadow: -3px 0px -3px 3px ${COLOR.button_shadow};
  }
`;

const SecondContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function App() {
  const { element, onMoveToElement } = useMoveScroll();
  const [holiday, setHoliday] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  console.log(setMonth, setYear);
  const formatMonth = (month) => {
    return month < 10 ? '0' + month : month;
  };
  console.log(month, year);
  const { isLoading, isError, data, error } = useQuery(
    ['date'],
    async () => {
      try {
        const response = await axios.get(
          `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&solMonth=${formatMonth(
            month
          )}&ServiceKey=${process.env.REACT_APP_SERVICE_KEY}`
        );
        console.log(data);
        setHoliday(response.data.response.body.items.item);
        return;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (e) => {
        console.log(e.message);
      },
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  console.log(holiday);
  return (
    <Main>
      <FirstContainer>
        <Title>
          <h1>우리는 쉬고싶다.</h1>
          <h2>이번달 휴일은 언제일까?</h2>
        </Title>
        <MovePageButton onClick={onMoveToElement}>확인하러 가기</MovePageButton>
      </FirstContainer>
      <SecondContainer ref={element}>
        <h2>어느달에 가장 많이 쉴 수 있을까?</h2>
        <div>
          <input type="text" placeholder="연도" />
          <span>년</span>
        </div>
        <div>
          <select>
            <option defaultValue={'0'}>월</option>
            <option value={'01'}>01</option>
            <option value={'02'}>02</option>
            <option value={'03'}>03</option>
            <option value={'04'}>04</option>
            <option value={'05'}>05</option>
            <option value={'06'}>06</option>
            <option value={'07'}>07</option>
            <option value={'08'}>08</option>
            <option value={'09'}>09</option>
            <option value={'10'}>10</option>
            <option value={'11'}>11</option>
            <option value={'12'}>12</option>
          </select>
        </div>
        <button>찾아보기</button>
        <Calendar
          holiday={holiday}
          setMonth={setMonth}
          setYear={setYear}
        ></Calendar>
      </SecondContainer>
    </Main>
  );
}

export default App;

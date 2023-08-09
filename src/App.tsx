import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import './App.css';

function App() {
  const [year, setStateYear] = useState<number>(0);
  const [month, setStateMonth] = useState<number>(0);

  //日
  type Week = {
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
  }
  let dayObj = { sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '' }
  const [calendarDate, setCalendarDate] = useState<Week[]>([dayObj]);
  const calendarAction = (obj: any) => {
    setCalendarDate((prev) => {
      return [...prev, obj]
    })
  }
  // const calendarAction = (obj: any) => {
  //   setCalendarDate([...calendarDate, obj])
  // } 追加されない
  const week = ['日', '月', '火', '水', '木', '金', '土'];

  const firstCalendar = (count: number) => {
    switch (count) {
      case 0:
        return { sun: '1', mon: '2', tue: '3', wed: '4', thu: '5', fri: '6', sat: '7' }
      case 1:
        return { sun: '', mon: '1', tue: '2', wed: '3', thu: '4', fri: '5', sat: '6' }
      case 2:
        return { sun: '', mon: '', tue: '1', wed: '2', thu: '3', fri: '4', sat: '5' }
      case 3:
        return { sun: '', mon: '', tue: '', wed: '1', thu: '2', fri: '3', sat: '4' }
      case 4:
        return { sun: '', mon: '', tue: '', wed: '', thu: '1', fri: '2', sat: '3' }
      case 5:
        return { sun: '', mon: '', tue: '', wed: '', thu: '', fri: '1', sat: '2' }
      case 6:
        return { sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '1' }
      default:
        return { sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '' }
    }
  }

  // カレンダー更新
  type objType = {
    [v: string]: string
  }
  let dateCount: number
  let otherCount: number = 1;
  const dayAction = (update: (dateObj: any) => void, start: number, end: number, count: number) => {
    let obj: objType = { sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '' }
    if (count === 1) {
      dateCount = 1
    }

    if (dateCount === 1) {
      //初期値上書き
      for (let i = 0; i < 7; i++) {
        if (start < otherCount) {
          setCalendarDate([firstCalendar(i)]);
          let calendar: any = firstCalendar(i);
          let result = Object.keys(calendar).map((v: any) => Number(calendar[v]));
          dateCount = Math.max(...result) + 1;
          i = 7;
        }
        otherCount++;
      }
    } else {
      Object.keys(obj).forEach((v) => {
        if (dateCount <= end) {
          obj[v] = String(dateCount)
          // dateCount++
        } else {
          obj[v] = ''
        }
        dateCount++
      })
      update(obj)
    }
  }

  // 初回
  useEffect(() => {
    const now = new Date();
    setStateYear(now.getFullYear());
    setStateMonth(now.getMonth() + 1);

    //月初
    now.setDate(1);
    const start = now.getDay();

    //月末
    now.setMonth(now.getMonth() + 1);
    now.setDate(0);
    const end = now.getDate();

    //日
    console.log(start)
    console.log(end)
    const firstLoopCount: number = start >= 5 && end >= 30 ? 7 : 6;
    for (let w = 1; w < firstLoopCount; w++) {
      dayAction(calendarAction, start, end, w);
    }
  }, [])

  // for文の中に直接、setStateを書くとうまく値が入らない

  const prevAction = () => {
    const prevDate = new Date(year, month, 0);
    prevDate.setDate(0);
    const prevYearCheck = prevDate.getMonth() + 1;
    setStateMonth(prevDate.getMonth() + 1);
    if (prevYearCheck === 12) {
      setStateYear((prev) => {
        return prev - 1;
      });
    }

    const prevDate2 = new Date(year, prevDate.getMonth() + 1, 0);
    prevDate2.setDate(1);
    const prevStart = prevDate2.getDay();
    const prevEnd = prevDate.getDate();

    const prevLoopCount: number = prevStart >= 5 && prevEnd >= 30 ? 7 : 6;
    setCalendarDate([]);
    for (let w = 1; w < prevLoopCount; w++) {
      dayAction(calendarAction, prevStart, prevEnd, w);
    }
  }

  const nextAction = () => {
    const nextDate = new Date(year, month, 1);
    nextDate.setDate(1);
    const nextYearCheck = nextDate.getMonth() + 1;
    setStateMonth(nextDate.getMonth() + 1);
    if (nextYearCheck === 1) {
      setStateYear((prev) => {
        return prev + 1
      })
    }

    const nextStart = nextDate.getDay();
    // nextDate.setMonth(month); useStateなので更新をしても誤差が生じる
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(0);
    const nextEnd = nextDate.getDate();

    const nextLoopCount: number = nextStart >= 5 && nextEnd >= 31 ? 7 : 6;
    setCalendarDate([]);
    for (let w = 1; w < nextLoopCount; w++) {
      dayAction(calendarAction, nextStart, nextEnd, w)
    }
  }

  return (
    <div className="App">
      <div className="calendar-wrapper">
        <div className="calendar-wrapper__contents">
          <div className="calendar-wrapper__body">
            <div className="calendar-wrapper__body-head">
              <button className="arrow-button" onClick={prevAction}>
                <FontAwesomeIcon icon={faCaretLeft} style={{color: "#fff",}} />
              </button>
              <p className="calendar-wrapper__year-month">{year} {month}</p>
              <button className="arrow-button" onClick={nextAction}>
                <FontAwesomeIcon icon={faCaretRight} style={{color: "#fff",}} />
              </button>
            </div>
            <table className='calendar-wrapper__week'>
              <thead>
                <tr>
                  {
                    week.map((v) => {
                      return (
                        <th key={v}>{v}</th>
                      )
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {
                  calendarDate.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td>{v.sun}</td>
                        <td>{v.mon}</td>
                        <td>{v.tue}</td>
                        <td>{v.wed}</td>
                        <td>{v.thu}</td>
                        <td>{v.fri}</td>
                        <td>{v.sat}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

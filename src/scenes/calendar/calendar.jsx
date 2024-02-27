import { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import calendarApi from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Button
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import Req from "../../config/axios";
import dayjs from 'dayjs';

// Calendar 객체 생성
const Calendar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [val,setVal] = useState([])
  // const reactRef = useRef(new FullCalendar);
  const [currentEvents, setCurrentEvents] = useState([
    {
      id: "12315",
      title: "All-day event",
      date: "2024-02-14",
    },
    {
      id: "5123",
      title: "Timed event",
      date: "2024-02-28",
    },
  ]);

    function generateRandom() {
    var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  const handleGetTransactions = async (isDate) => {
    console.log("요청완료")

    var copy;
    var value = null;
    try {
      const getTransactionsbyDate = await Req.get("/transactionsByDate", {params: {date: isDate}} )
      .then((result) => {
        var copy = [...val];
        copy = result.data;
        setVal(copy);
      });

    } catch(err){
      console.log(err);
    } // try catch
  };

  const handleConfirm = () => {
    console.log(val, currentEvents)
    const today = new Date();
    const nowMonth = dayjs(today).format('YYYY-MM');
    handleGetTransactions(nowMonth)
  }

  // 처음 로딩시 서버 데이터 Read
  // useEffect(() =>  {
  // }, [])


  useEffect(() =>  {
    const preProcess = val.map(function(element, index, array) {
      console.log()
      return {
        id: generateRandom(),
        start: dayjs(element.date).format('YYYY-MM-DD'),
        title: element.person,
        // deposit: element.deposit,
        // withdrawal: element.withdrawal
      };
    });

    // console.log(preProcess, value,  "pre, copy")
    var copy = [...currentEvents]
    copy = preProcess
    setCurrentEvents(copy);

  }, [val])

  const handleAddEvent = (reactRef) => {
    // reactRef.view.addEvent(currentEvents)
    console.log(val)
    console.log(currentEvents)
  } 

  // 클릭시 프롬프트 생성, 타이틀 입력하고 이벤트 생성
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  // 이벤트 클릭해서 삭제기능
  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  // 그리기
  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
      <Button color="secondary" variant="contained" onClick={handleAddEvent}>로그 확인</Button>
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          {/* 등록되어 있는 이벤트 뿌리기 */}
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR 그리기 */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={currentEvents} // 추가해줘야함
            // events={currentEvents}
            // ref={reactRef}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;

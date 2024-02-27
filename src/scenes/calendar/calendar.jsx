import { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
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
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import Req from "../../config/axios";

// Calendar 객체 생성
const Calendar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  const handleGetTransactions = async () => {
    console.log("요청완료")
    const getTransactions = null;
    var copy = [...currentEvents];
    var preProcess = null;
    var value = null;

      try {
        getTransactions = await Req.get("/transaction")
        .then((result) => {
          console.log(result, 'result')
          preProcess = result.data;
        })
      } catch(err){
        console.log(err);
      } // try catch

      console.log(getTransactions)

          
          // preProcess = result.data;
          // value = preProcess[0]
          // console.log(preProcess[0], preProcess[2], preProcess[4])

          
          // value = preProcess.map(function(element, index, array) {
          //   // console.log(element[0],element[1],element[2], array )
          //   return {
          //     id: element[0]+element[2],
          //     date: element[1],
          //     title: element[2]
          //   };
          // });

          console.log(preProcess, value,  "pre, copy")

          // setCurrentEvents();
  };

  // 처음 로딩시 서버 데이터 Read
  useEffect(() =>  {
    handleGetTransactions();
  }, [])

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
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;

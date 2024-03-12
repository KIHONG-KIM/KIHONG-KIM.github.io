import { useState, useEffect, useRef } from "react";
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
  const [newEvent,setNewEvent] = useState([])
  const calendarRef = useRef()
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

    var copy = [...val];;
    var value = null;
    try {
      await Req.get("/transaction")
      .then((result) => {
        copy = result.data;
      });

    } catch(err){
      console.log(err);
    } // try catch

    setVal(copy);

  };

  const handleConfirm = () => {
    // reactRef.view.addEvent(currentEvents)
    var copy_new = [...newEvent];
    copy_new = calendarRef.current
    setNewEvent(copy_new);
  }

  const handleAddEvent = () => {
    var copy = [...newEvent];
    copy = currentEvents;
    var copy_new = [...newEvent];
    copy_new = calendarRef.current
    setNewEvent(copy_new);
  } 

  

  // 처음 로딩시 서버 데이터 Read
  useEffect(() =>  {
    handleGetTransactions()
  }, [])


  useEffect(() =>  {

    var preProcess;
    const process = () => {

        try {
          preProcess = val.map(function(element) {
            return {
              id: element._id,
              start: dayjs(element.date).format('YYYY-MM-DD'),
              title: element.title,
            };
          });

        } catch (err) {
          console.log(err)
        } 
        calendarRef.current = preProcess;

        handleAddEvent()
      }

    process();

  }, [val])


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
      <Button color="secondary" variant="contained" onClick={handleConfirm}>로그 확인</Button>
      <Button color="secondary" variant="contained" onClick={handleAddEvent}>이벤트 생성</Button>
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
          sx={{
            height: 742,
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          {/* 등록되어 있는 이벤트 뿌리기 */}
          <Typography variant="h5" 
            sx={{ position: "fixed" }}>Events
          </Typography>
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
            events={newEvent}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
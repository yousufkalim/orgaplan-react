import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import "./Calender.css";
import { Modal, Button, Alert } from "react-bootstrap";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PopoverModal from "./components/popoverModal";
import MyWorkWeek from "./components/MyWorkWeek";
import TimePicker from "react-time-picker";
import DatePicker from "react-datepicker";
import FormSelect from "../../../components/FormSelect";
import "react-datepicker/dist/react-datepicker.css";

import {
  add_mean,
  update_mean,
  delete_mean,
} from "../../../redux/actions/means";
import { useSelector, useDispatch } from "react-redux";
import Actions from "../../../redux/actions";

let view = {
  month: true,
  day: true,
  work_week: MyWorkWeek,
};

const localizer = momentLocalizer(moment);

let formats = {
  dateFormat: "DD",
  monthHeaderFormat: "DD/MM/YYYY",
  dayHeaderFormat: "DD/MM/YYYY",
  dayRangeHeaderFormat: "DD/MM/YYYY",
  timeGutterFormat: (date, culture, localizer) =>
    localizer.format(date, "HH:mm", culture),
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "HH:mm") + "-" + localizer.format(end, "HH:mm"),
};

const Calender = (props) => { 
  const dispatch = useDispatch();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [alertMsg, setAlertMsg] = useState("");
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin); 
  const [openingHours , setOpeningHours] = useState(adminStore.site.siteId.openingHours);
  const [dorpdownMeans, setDropdownMeans] = useState([]);
  const [propsMean , setPropsMean] = useState(
    props.history.location.mean ?
    props.history.location.mean :
    props.location.selectedShape.mean

     );
  const [selectedMeanId, setSelectedMeanId] = useState(
    props.location.mean?
    props.location.mean._id :
    props.location.selectedShape.mean._id
  );
  const [meanAvailabilityStart , setMeanAvailabilityStart] = useState(
    props.history.location.mean ? 
    props.history.location.mean.availability.start:
    props.history.location.selectedShape.mean.availability.start
  );
  const [meanAvailabilityEnd , setMeanAvailabilityEnd] = useState(
    props.history.location.mean?
    props.history.location.mean.availability.end :
    props.history.location.selectedShape.mean.availability.end

  );
  const [saveSelectedMean, setSaveSelectedMean] = useState({});
  // *****
  const [alertBoxTime, setAlertBoxTime] = useState(false);
  const [days] = useState([]);
  const [popoverShow, setpopoverShow] = useState(false);
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState("");
  const [addedEvent, setAddedEvent] = useState({});
  const [show, setShow] = useState(false);
  let [startTime, setStartTime] = useState("");
  let [endTime, setEndTime] = useState("");
  let [starttimeslice, setstarttimeslice] = useState("");
  let [Endtimeslice, setEndtimeslice] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  let [startTimeEdit, setStartTimeEdit] = useState("");
  let [endTimeEdit, setEndTimeEdit] = useState("");
  let [starttimesliceEdit, setstarttimesliceEdit] = useState("");
  let [endtimesliceEdit, setEndtimesliceEdit] = useState("");
  const [statusColorEdit, setStatusColorEdit] = useState("");
  const [bookingslot, setbookingslot] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingEvent] = useState();
  const [bookingTitle, setBookingTitle] = useState();
  let [bookingstartTime] = useState("");
  let [bookingEndTime] = useState("");
  let [bookingstartTimeslice, setBookingstartTimeslice] = useState("");
  let [bookingendTimeslice, setBookingendTimeslice] = useState("");
  const [eventID, seteventID] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [disableHours, setDisableHours] = useState([]);
  const [disableDay, setDisableDay] = useState([]);
  // const [statusbooking, setStatusbooking] = useState("#FFFF00");

  const [overlap] = React.useState("Enable");
  // const [overlapOpen, setoverlapOpen] = React.useState(false);
  // overlap functions **************
  // const handleOverLapChange = (event) => {
  //   setoverlap(event.target.value);
  // };
  // const handleOverLapClose = () => {
  //   setoverlapOpen(false);
  // };
  // const handleOverLapOpen = () => {
  //   setoverlapOpen(true);
  // };
  // useEffect

  useEffect(() => {
    unavailabilityDates();
    functionDisableDay();
    // dispatch(get_means());
  }, []);
 
   useEffect(() => {
   
    getData();
  }, []);

  useEffect(() => {
    if (selectedMeanId !== "") {
      onChangeMeans();
    }
  }, [selectedMeanId, saveSelectedMean]);
  // useEffect(() => {
  //   if (meansData.means) {
  //     const tempmeanData = meansData.means.map((key, index) => {
  //       return {
  //         title: key.bookingReason,
  //         companyId: key.companyId,
  //         createdAt: key.createdAt,
  //         start: new Date(key.startDate),
  //         end: new Date(key.endDate),
  //         endTime: key.endTime,
  //         meanId: key.meanId,
  //         siteId: key.siteId,
  //         startTime: key.startTime,
  //         updatedAt: key.updatedAt,
  //         userId: key.userId,
  //         _id: key._id,
  //         color: "yellow",
  //       };
  //     });
  //     setEvents(tempmeanData);
  //   }
  // }, [meansData.means]);

  //
  const handleClose = () => setShow(false);
  let work_week_obj = {
    Sunday: true,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
  };
  for (let i = 0; i < days.length; i++) {
    if (days[i] === 0) {
      work_week_obj.Sunday = false;
    } else if (days[i] === 1) {
      work_week_obj.Monday = false;
    } else if (days[i] === 2) {
      work_week_obj.Tuesday = false;
    } else if (days[i] === 3) {
      work_week_obj.Wednesday = false;
    } else if (days[i] === 4) {
      work_week_obj.Thursday = false;
    } else if (days[i] === 5) {
      work_week_obj.Friday = false;
    } else if (days[i] === 6) {
      work_week_obj.Saturday = false;
    }
  }

  const updateEvent = () => {
    if (titleEdit !== "") {
      /* start time*/
      startTimeEdit = String(startTimeEdit);
      starttimesliceEdit = String(starttimesliceEdit);
      startTimeEdit = Array.from(startTimeEdit);
      starttimesliceEdit = Array.from(starttimesliceEdit);
      startTimeEdit[16] = starttimesliceEdit[0];
      startTimeEdit[17] = starttimesliceEdit[1];
      startTimeEdit[18] = starttimesliceEdit[2];
      startTimeEdit[19] = starttimesliceEdit[3];
      startTimeEdit[20] = starttimesliceEdit[4];
      startTimeEdit = String(startTimeEdit);
      startTimeEdit = startTimeEdit.replace(/,/g, "");
      startTimeEdit = new Date(startTimeEdit);
      /* start time*/
      /* End time*/
      endTimeEdit = String(endTimeEdit);
      endtimesliceEdit = String(endtimesliceEdit);
      endTimeEdit = Array.from(endTimeEdit);
      endtimesliceEdit = Array.from(endtimesliceEdit);
      endTimeEdit[16] = endtimesliceEdit[0];
      endTimeEdit[17] = endtimesliceEdit[1];
      endTimeEdit[18] = endtimesliceEdit[2];
      endTimeEdit[19] = endtimesliceEdit[3];
      endTimeEdit[20] = endtimesliceEdit[4];
      endTimeEdit = String(endTimeEdit);
      endTimeEdit = endTimeEdit.replace(/,/g, "");
      endTimeEdit = new Date(endTimeEdit);
      /* End time*/
      let preDateTime = new Date();
      let milliseconds = Date.parse(preDateTime);
      milliseconds = milliseconds - 1 * 60 * 1000;
      preDateTime = new Date(milliseconds);
      if (startTimeEdit > preDateTime && startTimeEdit < endTimeEdit) {
        const updateElement = events.filter((e) => e._id === eventID);
        updateElement[0].title = titleEdit;
        updateElement[0].start = startTimeEdit;
        updateElement[0].end = endTimeEdit;
        updateElement[0].color = statusColorEdit;
        setEvents([...events, updateElement]);

        var DbElement = {
          bookingReason: updateElement[0].title,
          startDate: updateElement[0].start,
          endDate: updateElement[0].end,
        };
        dispatch(update_mean(DbElement, eventID));
        // dispatch(get_means());

        setTitleEdit("");
        setShowEdit(false);
      } else {
        setAlertBoxTime(true);
        setTimeout(function () {
          setAlertBoxTime(false);
        }, 2000);
      }
    } else {
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 2000);
    }
  };
  const saveEvent = () => {
    if (title !== "" && selectedCompany !== "") {
      /* start time*/
      startTime = String(startTime);
      starttimeslice = String(starttimeslice);
      startTime = Array.from(startTime);
      starttimeslice = Array.from(starttimeslice);
      startTime[16] = starttimeslice[0];
      startTime[17] = starttimeslice[1];
      startTime[18] = starttimeslice[2];
      startTime[19] = starttimeslice[3];
      startTime[20] = starttimeslice[4];
      startTime = String(startTime);
      startTime = startTime.replace(/,/g, "");
      startTime = new Date(startTime);

      /* start time*/
      /* End time*/
      endTime = String(endTime);
      Endtimeslice = String(Endtimeslice);
      endTime = Array.from(endTime);
      Endtimeslice = Array.from(Endtimeslice);
      endTime[16] = Endtimeslice[0];
      endTime[17] = Endtimeslice[1];
      endTime[18] = Endtimeslice[2];
      endTime[19] = Endtimeslice[3];
      endTime[20] = Endtimeslice[4];
      endTime = String(endTime);
      endTime = endTime.replace(/,/g, "");
      endTime = new Date(endTime);
      /* End time*/
      let beforeTime = moment(startTime).format("DD/MM/YYYY HH:mm");
      let afterTime = moment(endTime).format("DD/MM/YYYY HH:mm");
      let dateCheck1 = events.find((item) => {
        return (
          moment(item.start).format("DD/MM/YYYY HH:mm") === beforeTime ||
          moment(item.end).format("DD/MM/YYYY HH:mm") === afterTime
        );
      });

      let dateCheck2 = events.findIndex((item) => {
        return startTime > item.start;
      });
      let dateCheck3 = events.findIndex((item) => {
        return startTime > item.end;
      });

      /*check not in previous day  Start */
      let preDateTime = new Date();
      let milliseconds = Date.parse(preDateTime);
      milliseconds = milliseconds - 1 * 60 * 1000;
      preDateTime = new Date(milliseconds);
      /*check not in previous day End  */
      let startMean= moment(meanAvailabilityStart).set({hour:0});
      let endMean= moment(meanAvailabilityEnd).set({hour:0});
      if (moment(startTime).isBetween(startMean ,  endMean ,null, '[]' ,'day')){
        if (overlap === "Enable") {
          var DbElement = {
            startDate: startTime,
            endDate: endTime,
            bookingReason: title,
            siteId: adminStore.site.siteId._id,
            userId: store.user._id,
            companyId: selectedCompany,
            meanId: selectedMeanId,
          };
          // setEvents([...events, stateElement]);
          let flagHours = false;
          disableHours.map((key, index) => {
            if (
              moment(startTime).isSame(key) ||
              moment(endTime).isSame(key) ||
              moment(key).isBetween(startTime, endTime)
            ) {
              flagHours = true;
            }
            return {};
          });

          if (!flagHours) {
            dispatch(add_mean(DbElement));
            setTitle("");
            setSelectedCompany("");
            setAddedEvent(DbElement);
            setShow(false);
          } else {
            setAlertMsg("you can not Select Disable Hours of a Day");
            setAlertBoxTime(true);
            setTimeout(function () {
              setAlertBoxTime(false);
            }, 1000);
          }
        } else if (
          overlap === "Disable" &&
          dateCheck2 !== -1 &&
          dateCheck3 !== -1 &&
          dateCheck1 !== undefined
        ) {
          setAlertBoxTime(true);
          setTimeout(function () {
            setAlertBoxTime(false);
          }, 1000);
        } else {
          setShow(false);
          dispatch(add_mean(DbElement));
          setTitle("");
          setSelectedCompany("");
        }
      } else {
        setAlertMsg("Time is Invalid");
        setAlertBoxTime(true);
        setTimeout(function () {
          setAlertBoxTime(false);
        }, 1000);
      }
    } else {
      setAlertMsg("Please Select Company name or Booking Reason");
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 1000);
    }
    setSaveSelectedMean(DbElement);
  };
  function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
  }
  const AddEvent = ({ start, end, slots }) => {
    let flagDate = false; 
    let flagHours = false;
    let pastdayFlag = false;
    let flagOpeningHours = false;
    let flagOpeningHoursDay = false;

    setBookingDate(moment(start).format("DD/MM/YYYY"));
    setAlertBoxTime(false);
    let preDateTime = new Date();
    let milliseconds = Date.parse(preDateTime);
    milliseconds = milliseconds - 1 * 60 * 1000;
    preDateTime = new Date(milliseconds);
    let currentDay =  moment(start).day(); 
    if(currentDay === 0){ // disorder of days of Opening Hours component
      currentDay=7;
    } 
    if (start < preDateTime && start < end) {
      pastdayFlag = true;
    }
    disableHours.map((key, index) => {
      if (moment(start).isSame(key) || moment(end).isSame(key)) {
        flagHours = true;
      }
      return {};
    });
    disableDay.map((key, index) => {
      if (moment(start).isSame(key) || moment(end).isSame(key)) {
        flagDate = true; 
      }
      return {};
    });
    openingHours.map((key, index)=>{
      if (key.dayOff === true && currentDay === key.day){
        flagOpeningHoursDay = true;
      }
    });
    
    openingHours.map((key, index)=>{
      if (key.dayOff === true && currentDay === key.day){
         flagOpeningHours = true;
      }else if (key.dayOff === false && currentDay === key.day){
            if(inRange(start.getHours(), key.startHour, key.endHour) && inRange(end.getHours(), key.startHour, key.endHour)){
              
            }else{
              flagOpeningHours = true;
            }
      }
    })
    if (flagDate || flagHours || pastdayFlag || flagOpeningHours || flagOpeningHoursDay) {
      setShow(false);
      if (flagDate) {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Disable Day", "error"),
          ),
        );
      } else if (flagHours ||  flagOpeningHours || flagOpeningHoursDay) {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Disable hours", "error"),
          ),
        );
      }else if (pastdayFlag){
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Booking can't be allowed in past day ", "error"),
          ),
        );
      }
    } else {  
        let startMean= moment(meanAvailabilityStart).set({hour:0});
        let endMean= moment(meanAvailabilityEnd).set({hour:0});
        if (moment(start).isBetween(startMean ,  endMean ,null, '[]' ,'day')){
        if (slots.length >= 2) {
          var format = "HH:mm";
          let time = moment(start, format);
          let beforeTime = moment(start).format("HH:mm");
          let afterTime = moment(end).format("HH:mm");
          let checkDiff = time.isBetween(beforeTime, afterTime);
          if (
            beforeTime !== "17:00" &&
            beforeTime !== "17:30" &&
            checkDiff === false
          ) {
            setShow(!show);
            setStartTime(start);
            setEndTime(end);
            let getstart = String(start);
            let getend = String(end);
            getstart = getstart.slice(16, 21);
            getend = getend.slice(16, 21);
            setstarttimeslice(getstart);
            setEndtimeslice(getend);
          } else {
            return false;
          }
        } else {
          setShow(!show);
          setStartTime(start);
          setEndTime(end);
          let getstart = String(start);
          let getend = String(end);
          getstart = getstart.slice(16, 21);
          getend = getend.slice(16, 21);
          setstarttimeslice(getstart);
          setEndtimeslice(getend);
        }
      } else {
        console.log("disable time clicked");
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(
              "Mean not Available",
              "error",
            ),
          ),
        );
      }
    }
  };

  const statusColorChange = (event) => {
    setValue(event.target.value);
  };
  const handlePopoverClose = () => setpopoverShow(false);
  const handleEditEvent = () => {
    setpopoverShow(!popoverShow);
    setShowEdit(true);
    setAlertBoxTime(false);
    const fill = events.filter((e) => e._id === eventID); 
    setTitleEdit(fill[0].title);
    let getstart = String(fill[0].start);
    let getend = String(fill[0].end);
    setStartTimeEdit(getstart);
    setEndTimeEdit(getend);
    setStatusColorEdit(fill[0].color);
    // Start slice a time
    getstart = getstart.slice(16, 21);
    getend = getend.slice(16, 21);
    setstarttimesliceEdit(getstart);
    setEndtimesliceEdit(getend);
  };
  const handleDeleteEvent = () => {
    setpopoverShow(!popoverShow);
    const fill = events.filter((e) => e._id !== eventID);
    setEvents(fill);

    dispatch(delete_mean(eventID));
    // dispatch(get_means());
  };
  const handlePopoverShow = (event) => {
    seteventID(event._id);
    const fill = events.filter((e) => e._id === event._id);
    setEvent(fill[0]);
    setpopoverShow(!popoverShow);
    // admin code end
  };
  // const bookingSlot = (event) => {
  //   // booking Event
  //   setbookingslot(true);
  //   const fill = events.filter((e) => e.id === event.id);
  //   setbookingEvent(fill[0]);
  //   setBookingstartTime(fill[0].start);
  //   setBookingEndTime(fill[0].end);

  //   /* show time start */
  //   let getstart = String(fill[0].start);
  //   let getend = String(fill[0].end);
  //   getstart = getstart.slice(16, 21);
  //   getend = getend.slice(16, 21);

  //   setBookingstartTimeslice(getstart);
  //   setBookingendTimeslice(getend);
  //   /* show time End  */
  // };
  const saveBooking = () => {
    /* start time*/
    bookingstartTime = String(bookingstartTime);
    bookingstartTimeslice = String(bookingstartTimeslice);
    bookingstartTime = Array.from(bookingstartTime);
    bookingstartTimeslice = Array.from(bookingstartTimeslice);
    bookingstartTime[16] = bookingstartTimeslice[0];
    bookingstartTime[17] = bookingstartTimeslice[1];
    bookingstartTime[18] = bookingstartTimeslice[2];
    bookingstartTime[19] = bookingstartTimeslice[3];
    bookingstartTime[20] = bookingstartTimeslice[4];
    bookingstartTime = String(bookingstartTime);
    bookingstartTime = bookingstartTime.replace(/,/g, "");
    bookingstartTime = new Date(bookingstartTime);
    /* start time*/
    /* End  time*/
    bookingEndTime = String(bookingEndTime);
    bookingendTimeslice = String(bookingendTimeslice);
    bookingEndTime = Array.from(bookingEndTime);
    bookingendTimeslice = Array.from(bookingendTimeslice);
    bookingEndTime[16] = bookingendTimeslice[0];
    bookingEndTime[17] = bookingendTimeslice[1];
    bookingEndTime[18] = bookingendTimeslice[2];
    bookingEndTime[19] = bookingendTimeslice[3];
    bookingEndTime[20] = bookingendTimeslice[4];
    bookingEndTime = String(bookingEndTime);
    bookingEndTime = bookingEndTime.replace(/,/g, "");
    bookingEndTime = new Date(bookingEndTime);
    /* End time*/
    // let uniqid = Math.random();
    // const newElement = {
    //   p_id: bookingEvent.id,
    //   id: uniqid,
    //   title: bookingTitle,
    //   start: bookingstartTime,
    //   end: bookingEndTime,
    //   color: statusbooking,
    // };
    if (
      bookingEvent.start <= bookingstartTime &&
      bookingEvent.end >= bookingEndTime
    ) {
      console.log("Add time in array ");
    } else {
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 1000);
    }
  };
  // const statusBookingChange = (event) => {
  //   setStatusbooking(event.target.value);
  // };
  function Alertbox(props) {
    return (
      <Alert
        show={alertBoxTime}
        variant="danger"
        onClose={() => setAlertBoxTime(!alertBoxTime)}
        dismissible
      >
        {props.message}
      </Alert>
    );
  }
  const functionDisableDay = () => {
    let tempDisableDay = [];
    propsMean.unavailability.map((key, index) => {
      if (key.dayOff === true) {
        for (let i = 0; i <= 23; i++) {
          let date = new Date(key.date);
          date.setHours(i);
          tempDisableDay.push(date);
        }
      }
      return {};
    });
    setDisableDay(tempDisableDay);
  }; 
  const customDayPropGetter = (date) => { 
    let unavailability = false;
    let flagOpeningHoursDay = false;
    let betweenDate = false;
    let currentDay =  moment(date).day(); 
    if(currentDay === 0){ // disorder of days of Opening Hours component
      currentDay=7;
    } 
    adminStore.site.siteId.unavailabilityDates.map((key, index) => {
      if (key.dayOff === true) {
        if (moment(date).isSame(key.date, "day")) {
          unavailability = true;
        }
      }
      return {};
    });
    openingHours.map((key, index)=>{
      if (key.dayOff === true && currentDay === key.day){
            flagOpeningHoursDay = true;
      }
    }); 
   if (!moment(date).isBetween(moment(meanAvailabilityStart), moment(meanAvailabilityEnd).add(1, 'day'),null, '[]','day')){
          betweenDate = true;
   }

     if (unavailability || flagOpeningHoursDay  || betweenDate) {
      return {
        className: "special-day",
        style: {
          backgroundColor: "#EBEBE4",
        },
      };
      }
  };

  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_MEAN_HISTORY}/${propsMean._id}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.success) {
        const tempmeanData = response.data.history.map((key, index) => {
          return {
            title: key.bookingReason,
            companyId: key.companyId,
            createdAt: key.createdAt,
            start: new Date(key.startDate),
            end: new Date(key.endDate),
            endTime: key.endTime,
            meanId: key.meanId,
            siteId: key.siteId,
            startTime: key.startTime,
            updatedAt: key.updatedAt,
            userId: key.userId,
            _id: key._id,
            color: "",
          };
        });

        setEvents(tempmeanData);

        if (response.data.site_means != null) {
          const temp = [];
          response.data.site_means.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });
          setDropdownMeans(temp);
        }
        const companyTemp = [];
        response.data.site_companies.map((item, index) => {
          return companyTemp.push({
            label: item.companyId.name,
            value: item.companyId._id,
          });
        });
        setDropdownCompanies(companyTemp);
      } else {
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onChangeMeans = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_MEAN_HISTORY}/${selectedMeanId}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.success) {
        const tempmeanData = response.data.history.map((key, index) => {
          let colour= ""
          if (key.status === "VALIDATED") {
            colour = "green";
          }else{
            colour = "";
          }
          return {
            title: key.bookingReason,
            companyId: key.companyId,
            createdAt: key.createdAt,
            start: new Date(key.startDate),
            end: new Date(key.endDate),
            endTime: key.endTime,
            meanId: key.meanId,
            siteId: key.siteId,
            startTime: key.startTime,
            updatedAt: key.updatedAt,
            userId: key.userId,
            _id: key._id,
            color: colour,
          };
        });

        setEvents(tempmeanData);
      } else {
      }
 
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const unavailabilityDates = () => {
    let tempDisabledTime = []; 
    propsMean.unavailability.map((key, index) => {
      if (key.dayOff === false) {
        for (let i = key.startHour; i <= key.endHour; i++) {
          let date = new Date(key.date);
          date.setHours(i);
          tempDisabledTime.push(date);
        }
      }
      return {};
    }) 
    setDisableHours(tempDisabledTime);
  };
  const slotPropGetter = (date) => {
    let flagDateAndTime; 
    let newStyle = {
      backgroundColor: "#EBEBE4",
    };
    disableHours.map((key, index) => {
      if (moment(date).isSame(key)) {
        flagDateAndTime = date;
      }
      return {};
    });

    if (flagDateAndTime) {
      return {
        className: "rbc-day-slot rbc-time-slot ",
        style: newStyle,
      };
    }
  };
  return (
    <>
      <Modal show={bookingslot} onHide={() => setbookingslot(false)} centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title className="text-center w-100">BOOKING</Modal.Title>
        </Modal.Header>
        <Alertbox message="Invalid Time" />
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                style={{ border: "1px solid #707070" }}
                placeholder="Company : ConstructBTP"
                className="w-100 p-2 mb-2"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="starttime">
                <label>Start time</label>
                <TimePicker
                  value={bookingstartTimeslice}
                  onChange={(e) => setBookingstartTimeslice(e)}
                  locale="sv-sv"
                />
              </div>
              {/* <div class="form-group statusColor">
                <label>Status Color </label>

                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="statusColor"
                    name="statusColor"
                    value={statusbooking}
                    onChange={statusBookingChange}
                  >
                    <FormControlLabel
                      value="#FFFF00"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusbooking(e.target.value)}
                        />
                      }
                      label="Pending validation"
                      className="pending"
                    />

                    <FormControlLabel
                      value="#808080"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusbooking(e.target.value)}
                        />
                      }
                      label="Not availble"
                      className="notAvailble"
                    />
                    <FormControlLabel
                      value="#008000"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusbooking(e.target.value)}
                        />
                      }
                      label="Validate"
                      className="validate"
                    />
                  </RadioGroup>
                </FormControl>
              </div> */}
            </div>
            <div className="col-md-12">
              <div className="endTime">
                <label>End Time</label>
                <TimePicker
                  value={bookingendTimeslice}
                  onChange={(e) => setBookingendTimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-md-12">
              <div className="description">
                <div className="form-group ">
                  {/* <label for="exampleFormControlTextarea1">Add message</label> */}
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    placeholder="Reason of booking"
                    rows="3"
                    value={bookingTitle}
                    onChange={(e) => setBookingTitle(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className="w-100 py-2"
            onClick={saveBooking}
            style={{
              color: "#fff",
              backgroundColor: "#DBB20A",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Book
          </button>
          {/* <Button variant="primary" onClick={saveBooking}>
            Add Booking
          </Button>
          <Button variant="secondary" onClick={() => setbookingslot(false)}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking</Modal.Title>
        </Modal.Header>

        <Alertbox message={alertMsg} />
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <h5
                class="text-center"
                style={{
                  backgroundColor: "rgb(247, 247, 247)",
                  fontSize: "16px",
                  color: "rgb(119, 119, 119)",
                  textAlign: "center",
                  padding: "14px 20px",
                }}
              >
                Date : {bookingDate}
              </h5>
            </div>
            <div className="col-md-6 mb-4">
              <FormSelect
                placeholder="Company"
                values={dropdownCompanies}
                value={selectedCompany}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedCompany(item);
                  } else {
                    setSelectedCompany("");
                  }
                }}
                style={{ marginRight: "20px", maxWidth: 250 }}
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="starttime">
                <label>Start hour</label>
                <TimePicker
                  value={starttimeslice}
                  onChange={(e) => setstarttimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="endTime">
                <label>End hour</label>
                <TimePicker
                  value={Endtimeslice}
                  onChange={(e) => setEndtimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="description">
                <div class="form-group">
                  <textarea
                    placeholder="Reason of booking"
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6">
              <div class="form-group statusColor">
                <label>Status Color </label>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="statusColor"
                    value={statusColor}
                    onChange={statusColorChange}
                  >
                    <FormControlLabel
                      value="#FFFF00"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColor(e.target.value)}
                        />
                      }
                      label="Pending validation"
                      className="pending"
                    />
                    <FormControlLabel
                      value="#808080"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColor(e.target.value)}
                        />
                      }
                      label="Not availble"
                      className="notAvailble"
                    />
                    <FormControlLabel
                      value="#008000"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColor(e.target.value)}
                        />
                      }
                      label="Validate"
                      className="validate"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#DBB20A",
              padding: "5px 20px",
              outline: "none",
              border: "none",
            }}
            onClick={saveEvent}
          >
            Book
          </Button>
          <Button
            variant="secondary"
            style={{
              outline: "none",
              border: "none",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event </Modal.Title>
        </Modal.Header>
        <Alertbox message="Please Add valid Time and Event" />
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="description">
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Edit Event</label>
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    value={titleEdit}
                    onChange={(e) => setTitleEdit(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="starttime">
                <label>Start time</label>
                <TimePicker
                  value={starttimesliceEdit}
                  onChange={(e) => setstarttimesliceEdit(e)}
                  locale="sv-sv"
                />
              </div>
              <div class="form-group statusColor">
                {value && ""}
                <label>Status Color </label>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="statusColor"
                    name="statusColor"
                    value={statusColorEdit}
                    onChange={statusColorChange}
                  >
                    <FormControlLabel
                      value="#FFFF00"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColorEdit(e.target.value)}
                        />
                      }
                      label="Pending validation"
                      className="pending"
                    />
                    <FormControlLabel
                      value="#808080"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColorEdit(e.target.value)}
                        />
                      }
                      label="Not availble"
                      className="notAvailble"
                    />
                    <FormControlLabel
                      value="#008000"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColorEdit(e.target.value)}
                        />
                      }
                      label="Validate"
                      className="validate"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="col-md-6">
              <div className="endTime">
                <label>End Time</label>
                <TimePicker
                  value={endtimesliceEdit}
                  onChange={(e) => setEndtimesliceEdit(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={updateEvent}>
            Update Event
          </Button>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="pt-5">
        <PopoverModal
          popoverShow={popoverShow}
          handlePopoverClose={handlePopoverClose}
          handleDeleteEvent={handleDeleteEvent}
          handleEditEvent={handleEditEvent}
          event={event}
        />
        <div style={{}} className="pl-2 pt-3 pb-5 d-flex">
          <FormSelect
            placeholder="Select a Means"
            values={dorpdownMeans}
            value={selectedMeanId}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;

              if (index !== -1) {
                const itemId = event.target.value;
                setSelectedMeanId(itemId);
              } else {
                setSelectedMeanId("");
              }
            }}
            style={{ marginRight: "10px", maxWidth: 250 }}
          />
          <div style={{ width: "25%", marginLeft: "20px" }}>
            <DatePicker
              showPopperArrow={true}
              dateFormat="dd-MM-yyyy"
              selected={calendarDate}
              popperPlacement="top-start"
              showYearDropdown
              placeholderText="Delivery date"
              onChange={(date) => {
                setCalendarDate(date);
              }}
            />
          </div>
        </div>
        <div className="d-flex px-2">
          <div style={{ flexBasis: "100%" }}>
            {events ? (
              <Calendar
                popup
                slotPropGetter={slotPropGetter}
                selectable
                formats={formats}
                localizer={localizer}
                events={events}
                views={view}
                defaultView="work_week"
                step={60}
                timeslots={1}
                onSelectEvent={handlePopoverShow}
                // onSelectEvent={bookingSlot}
                onSelecting={true}
                onSelectSlot={AddEvent}
                // onSelectSlot={AddAvailability}
                startAccessor="start"
                endAccessor="end"
                style={{
                  width: "98%",
                  height: "430px",
                }}
                eventPropGetter={(events, start, end, isSelected) => {
                  let { color } = events;

                  let newStyle = {
                    clear: "both",
                    display: "block",
                    fontSize: "13px",
                    borderRadius: "4px",
                    padding: "5px",
                    marginTop: "5px !important",
                    marginLeft: "5px !important",
                    lineHeight: "14px",
                    background: `${color}`,
                    border: "2px solid #fff",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px",
                  };

                  if (events.isMine) {
                    newStyle.backgroundColor = "color";
                    newStyle.border = "2px solid #fff";
                  }

                  return {
                    className: "",
                    style: newStyle,
                  };
                }}
                custom_week_days={days}
                dayPropGetter={customDayPropGetter}
                date={calendarDate}
                onNavigate={(date) => {
                  setCalendarDate(date);
                }}
              />
            ) : (
              <h1>Loading.....</h1>
            )}
          </div>
          {/* <div style={{ flexBasis: "25%", margin: "0 20px 0px 10px" }}>
            <div className="calender-sidebar pt-5">
              <div className="text-center w-100 calender-sidebar-heading pb-3">
                BOOKING
              </div>
              <div className="row">
                <div className="col-md-12">
                  <input
                    disabled
                    type="text"
                    style={{ border: "1px solid #707070", textAlign: "center" }}
                    placeholder="Lundi 03 Septembre 2020"
                    className="w-100 p-2"
                    value={cdate}
                    onChange={(e) => setCdate(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="starttime">
                    <FormSelect
                      placeholder="ConstructBTP"
                      values={[
                        { value: "green", label: "Green" },
                        { value: "Yellow", label: "Yellow" },
                        { value: "Red", label: "Red" },
                        { value: "Blue", label: "Blue" },
                        { value: "Orange", label: "Orange" },
                        { value: "Purple", label: "Purple" },
                        { value: "Magenta", label: "Magenta" },
                      ]}
                      onChange={(e) => {
                        console.log("area ==> ", e.target.value);
                      }}
                      style={{ maxWidth: 300 }}
                    />
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div className="endTime">
                    <FormSelect
                      placeholder="Start hour"
                      values={[
                        { value: "green", label: "Green" },
                        { value: "Yellow", label: "Yellow" },
                        { value: "Red", label: "Red" },
                        { value: "Blue", label: "Blue" },
                        { value: "Orange", label: "Orange" },
                        { value: "Purple", label: "Purple" },
                        { value: "Magenta", label: "Magenta" },
                      ]}
                      onChange={(e) => {
                        console.log("area ==> ", e.target.value);
                      }}
                      style={{ maxWidth: 300 }}
                    />
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div className="endTime">
                    <FormSelect
                      placeholder="End hour"
                      values={[
                        { value: "green", label: "Green" },
                        { value: "Yellow", label: "Yellow" },
                        { value: "Red", label: "Red" },
                        { value: "Blue", label: "Blue" },
                        { value: "Orange", label: "Orange" },
                        { value: "Purple", label: "Purple" },
                        { value: "Magenta", label: "Magenta" },
                      ]}
                      onChange={(e) => {
                        console.log("area ==> ", e.target.value);
                      }}
                      style={{ maxWidth: 300 }}
                    />
                  </div>
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-md-12">
                  <div className="description">
                    <div className="form-group ">
                    <label for="exampleFormControlTextarea1">Add message</label>  
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        placeholder="Reason of booking"
                        rows="3"
                        value={bookingTitle}
                        onChange={(e) => setBookingTitle(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="w-100 py-2"
                  onClick={saveBooking}
                  style={{
                    color: "#fff",
                    backgroundColor: "#DBB20A",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Book
                </button>
              </div>
           <Button variant="primary" onClick={saveBooking}>
            Add Booking
          </Button>
          <Button variant="secondary" onClick={() => setbookingslot(false)}>
            Close
          </Button> 
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Calender;

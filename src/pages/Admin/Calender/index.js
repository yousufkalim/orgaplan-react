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
import SearchInput from "../../../components/SearchInput";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import Form from "../../../components/Form";
import FormSelect from "../../../components/FormSelect";
import "react-datepicker/dist/react-datepicker.css";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import SubHeading from "../../../components/SubHeading";

import {
  get_means,
  add_mean,
  update_mean,
  delete_mean,
} from "../../../redux/actions/means";
import Actions from "../../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
let view = {
  month: true,
  day: true,
  work_week: MyWorkWeek,
  agenda: true,
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
  moment.locale("es-es", {
    week: {
      dow: 1, //Monday is the first day of the week.
    },
  });
  const dispatch = useDispatch();
  const meansData = useSelector((state) => state.means);
  const adminStore = useSelector((state) => state.admin);

  const store = useSelector((state) => state.auth);
  // *****
  const [isLoading, setLoading] = useState(true);
  const [siteMeans, setSiteMeans] = useState("");
  const [alertBoxTime, setAlertBoxTime] = useState(false);
  const [days, setDays] = useState([]);
  const [popoverShow, setpopoverShow] = useState(false);
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState("");
  const [show, setShow] = useState(false);
  let [startTime, setStartTime] = useState("");
  let [endTime, setEndTime] = useState("");
  let [starttimeslice, setstarttimeslice] = useState("");
  let [Endtimeslice, setEndtimeslice] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [statusColor, setStatusColor] = useState("#FFFF00");
  const [showEdit, setShowEdit] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  let [startTimeEdit, setStartTimeEdit] = useState("");
  let [endTimeEdit, setEndTimeEdit] = useState("");
  let [starttimesliceEdit, setstarttimesliceEdit] = useState("");
  let [endtimesliceEdit, setEndtimesliceEdit] = useState("");
  const [statusColorEdit, setStatusColorEdit] = useState("");
  const [bookingslot, setbookingslot] = useState(false);
  const [bookingEvent, setbookingEvent] = useState();
  const [bookingTitle, setBookingTitle] = useState();
  let [bookingstartTime, setBookingstartTime] = useState("");
  let [bookingEndTime, setBookingEndTime] = useState("");
  let [bookingstartTimeslice, setBookingstartTimeslice] = useState("");
  let [bookingendTimeslice, setBookingendTimeslice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [eventID, seteventID] = useState("");
  const [cdate, setCdate] = useState("");
  const [filterDate, setFilterDate] = useState(new Date());
  const [company, setCompany] = useState([]);
  const [typeOfPlace, setTypeOfPlace] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [dropdownCompany, setDropdownCompany] = useState([]);
  const [enterprise, setEnterprise] = useState("");
  const [typeOfPlaning, setTypeOfPlaning] = useState("Deliveries");
  const [status, setStatus] = useState("");
  const [typeOfPlacevalue, setTypeOfPlacevalue] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [deliveriesMeansStatus, setDeliveriesMeansStatus] = useState([
    { value: "PENDING", label: "PENDING" },
    { value: "VALIDATED", label: "VALIDATED" },
    { value: "MODIFIED", label: "MODIFIED" },
    { value: "ALERTE", label: "ALERTE" },
  ]);
  const [disableHours, setDisableHours] = useState([]); 
  const [openingHours , setOpeningHours] = useState(adminStore.site.siteId.openingHours)
  const [overlap] = React.useState("Enable"); 
console.log(adminStore.site.siteId.unavailabilityDates ,"unavailabilty");
  // useEffect
  useEffect(() => {
    if (props.location.companyId != null) {
      setEnterprise(props.location.companyId);
    }
    if (props.location.selectedShape != null) {
      setTypeOfPlacevalue(props.location.selectedShape.type);
      if (props.location.selectedShape.type === "DELIVERYAREA") {
        getDeliveryAreaSiteBySiteId();
      } else if (props.location.selectedShape.type === "STORAGEAREA") {
        getStorageSiteBysiteId();
      } else if (props.location.selectedShape.type === "BUILDING") {
        getbuildingBysiteId();
      }
    }
    if (props.location.selectedShape != null) {
      setPlaceId(props.location.selectedShape._id);
    }
    getfilterdata();
    unavailabilityDates();
  }, []);
  useEffect(() => {
    filterBookingCalendar();
  }, [enterprise, typeOfPlaning, status, typeOfPlacevalue, placeId, siteMeans]);

  // !!!!!!
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
        dispatch(get_means());

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
    if (title !== "") {
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

      let uniqid = Math.random();

      /*check not in previous day  Start */
      let preDateTime = new Date();
      let milliseconds = Date.parse(preDateTime);
      milliseconds = milliseconds - 1 * 60 * 1000;
      preDateTime = new Date(milliseconds);
      /*check not in previous day End  */

      if (startTime > preDateTime && startTime < endTime) {
        if (overlap === "Enable") {
          setShow(false);
          var stateElement = {
            title: title,
            start: startTime,
            end: endTime,
            color: statusColor,
          };

          var DbElement = {
            bookingReason: title,
            startDate: startTime,
            endDate: endTime,
          };
          // setEvents([...events, stateElement]);
          dispatch(add_mean(DbElement));
          dispatch(get_means());
          setTitle("");
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

          setEvents([...events, stateElement]);
          dispatch(add_mean(DbElement));
          setTitle("");
        }
      } else {
        setAlertBoxTime(true);
        setTimeout(function () {
          setAlertBoxTime(false);
        }, 1000);
      }
    } else {
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 1000);
    }
  };
  const AddEvent = ({ start, end, slots }) => {
    setAlertBoxTime(false);
    let preDateTime = new Date();
    let milliseconds = Date.parse(preDateTime);
    milliseconds = milliseconds - 1 * 60 * 1000;
    preDateTime = new Date(milliseconds);

    if (
      start.getDay() === days[0] ||
      start.getDay() === days[1] ||
      start.getDay() === days[2] ||
      start.getDay() === days[3] ||
      start.getDay() === days[4] ||
      start.getDay() === days[5] ||
      start.getDay() === days[6]
    ) {
      console.log("not active day");
    } else {
      // active days
      let beforeTime = moment(start).format("HH:mm");
      let afterTime = moment(end).format("HH:mm");
      let dateCheck = events.filter((item) => {
        return (
          moment(item.start).format("DD/MM/YYYY HH:mm") === beforeTime &&
          moment(item.end).format("DD/MM/YYYY HH:mm") === afterTime
        );
      });
      if (dateCheck.length === 0 && overlap) {
        if (start > preDateTime && start < end) {
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
          setAlertBoxTime(true);
          setTimeout(function () {
            setAlertBoxTime(false);
          }, 2000);
        }
      } else {
        console.log("disable time clicked");
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
    const fill = events.filter((e) => e.id !== eventID);
    setEvents(fill);
    dispatch(delete_mean(eventID));
  };

  const handlePopoverShow = (event) => {
    seteventID(event.id);
    const fill = events.filter((e) => e.id === event.id);
    setEvent(fill[0]);
    setpopoverShow(!popoverShow);
    // admin code end
  };
  const bookingSlot = (event) => {
    // booking Event
    setbookingslot(true);
    const fill = events.filter((e) => e.id === event.id);
    setbookingEvent(fill[0]);
    setBookingstartTime(fill[0].start);
    setBookingEndTime(fill[0].end);

    /* show time start */
    let getstart = String(fill[0].start);
    let getend = String(fill[0].end);
    getstart = getstart.slice(16, 21);
    getend = getend.slice(16, 21);

    setBookingstartTimeslice(getstart);
    setBookingendTimeslice(getend);
    /* show time End  */
  };
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

  const getfilterdata = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_LIST_OF_MEANS}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data.site_companies !== null) {
          const temp = [];
          response.data.site_companies.map((item, index) => {
            return temp.push({
              label: item.companyId.name,
              value: item.companyId._id,
            });
          });
          setCompany(response.data.site_companies);
          setDropdownCompany(temp);
        }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  function handleChangeTypeOfPlace(e) {
    setTypeOfPlacevalue(e.target.value);
    if (e.target.value === "DELIVERYAREA") {
      getDeliveryAreaSiteBySiteId();
    } else if (e.target.value === "STORAGEAREA") {
      getStorageSiteBysiteId();
    } else if (e.target.value === "BUILDING") {
      getbuildingBysiteId();
    } else {
      setTypeOfPlace([]);
    }
  }
  const getbuildingBysiteId = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.getBuildingsBySiteId}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data !== null) {
          const temp = [];
          response.data.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });

          setTypeOfPlace(temp);
        }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const getStorageSiteBysiteId = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREAS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data !== null) {
          const temp = [];

          response.data.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });

          setTypeOfPlace(temp);
        }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const getDeliveryAreaSiteBySiteId = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.getDeliveryAreaSiteBySiteId}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data !== null) {
          const temp = [];

          response.data.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });

          setTypeOfPlace(temp);
        }
      } else {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Delivery Area Site By SiteId Error"),
          ),
        );
      }
 
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

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

  const customDayPropGetter = (date) => {
    let flagDate = false;
    let flagOpeningHoursDay = false;
    let currentDay =  moment(date).day(); 
    if(currentDay === 0){ // disorder of days of Opening Hours component
      currentDay=7;
    } 
    adminStore.site.siteId.unavailabilityDates.map((key, index) => {
      if (key.dayOff === true) {
        if (moment(date).isSame(key.date, "day")) {
          flagDate = true;
        }
      }
      return {};
    });
    openingHours.map((key, index)=>{
      if (key.dayOff === true && currentDay === key.day){
        flagOpeningHoursDay = true;
      }
    });
    if (flagDate || flagOpeningHoursDay) {
      return {
        className: "special-day",
        style: {
          backgroundColor: "#EBEBE4",
        },
      };
    }
  };
  const filterBookingCalendar = async () => {
    let count = 0;
    let tempEvent;
    try {
      const response = await GLOBALS.API({
        method: "POST",
        token: store.token,
        uri: `${GLOBALS.Constants.filterBookingCalendar}`,
        body: JSON.stringify({
          siteId: adminStore.site.siteId._id,
          companyId: enterprise,
          typeOfPlaning: typeOfPlaning,
          status: status,
          typeOfPlace: typeOfPlacevalue,
          placeId: placeId,
        }),
      });
      if (response.success) { 
        if (typeOfPlaning === "Deliveries") {
          let colour = "";

          tempEvent = response.data.Deliveries.map((key, index) => {
            if (!(key.startTime && key.endTime)) {
              return {};
            }
            if (key.status === "PENDING") {
              colour = "yellow";
            } else if (key.status === "VALIDATED") {
              colour = "green";
            } else if (key.status === "MODIFIED") {
              colour = "orange";
            } else if (key.status === "ALERTE") {
              colour = "red";
            }
            /* start time converstion */
            let start = new Date(key.date);
            let startHours = key.startTime.slice(0, 2);
            let startmint = key.startTime.slice(3, 5);
            start.setHours(startHours);
            start.setMinutes(startmint);
            /* start time converstion */

            /* End time converstion */
            let end = new Date(key.date);
            let endHours = key.endTime.slice(0, 2);
            let endmint = key.endTime.slice(3, 5);
            end.setHours(endHours);
            end.setMinutes(endmint);
            /* End time converstion */

            count++;
            return {
              objectName: "Deliveries",
              id: key._id,
              title: key.statusReason,
              start: start,
              end: end,
              color: colour,
              means: key.means,
              company: key.companyId,
              materials : key.materials,
              deliveryArea : key.deliveryArea,
              storageArea: key.storageArea,
              building: key.building
            };
          });
          setSiteMeans(`DELIVERY REQUESTS : ${count} DELIVERIES`);
        } else if (typeOfPlaning === "Means") {
          tempEvent = response.data.Means.map((key, index) => {
            let start = new Date(key.startDate);
            let end = new Date(key.endDate);
            count++;
            return {
              objectName: "Means",
              id: key._id,
              title: key.bookingReason,
              start: start,
              end: end,
              companyName: key.companyId.name,
              meanName: key.meanId.name,
            };
          });
          setSiteMeans(`TOTAL MEANS Booking : ${count}`);
        }
        setEvents(tempEvent);
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}
console.log(openingHours , "openingHours");
  const slotPropGetter = (date) => {
    let flagDateAndTime = false;
    let flagOpeningHours = false;
    let currentDay =  moment(date).day();  
    if(currentDay === 0){ // disorder of days of Opening Hours component
      currentDay=7;
    } 
    let newStyle = {
      backgroundColor: "#EBEBE4",
    }; 
    openingHours.map((key, index)=>{
      if (key.dayOff === true && currentDay === key.day){
        flagOpeningHours = true;
      }else if (key.dayOff === false && currentDay === key.day){
            if(inRange(date.getHours(), key.startHour, key.endHour)){
              
            }else{
              flagOpeningHours = true;
            }
      }
    })
    disableHours.map((key, index) => {
      if (moment(date).isSame(key)) {
        flagDateAndTime = true;
      }
      return {};
    });

    if (flagDateAndTime || flagOpeningHours) {
      return {
        className: "rbc-day-slot rbc-time-slot",
        style: newStyle,
      };
    }
  };
  //setDisableHours
  const unavailabilityDates = () => {
    let tempDisabledTime = [];
    adminStore.site.siteId.unavailabilityDates.map((key, index) => {
      if (key.dayOff === false) {
        for (let i = key.startHour; i <= key.endHour; i++) {
          let date = new Date(key.date);
          date.setHours(i);
          tempDisabledTime.push(date);
        }
      }
      return {};
    });
    setDisableHours(tempDisabledTime);
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
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking</Modal.Title>
        </Modal.Header>
        <Alertbox message="Please Add valid Time and Event" />
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <div>
                <DatePicker
                  showPopperArrow={true}
                  dateFormat="dd-MMMM-yyyy"
                  selected={startDate}
                  popperPlacement="top-start"
                  showYearDropdown
                  minDate={addDays(new Date(), 1)}
                  placeholderText="Booking Date"
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  className="modal-datepicker"
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <FormSelect
                placeholder="ConstructBTP"
                values={[
                  { value: "INCIDENT", label: "Incident" },
                  { value: "MEAN", label: "Mean" },
                  { value: "DELAY", label: "Delay" },
                  { value: "UNEXPRECTED", label: "Unexp" },
                ]}
                style={{ marginRight: "20px" }}
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
          <div className="row">
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#DBB20A", padding: "5px 20px" }}
            onClick={saveEvent}
          >
            Book
          </Button>
          <Button variant="secondary" onClick={handleClose}>
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

        <div className="px-2">
          <Form.Row alignItems="center">
            <Form.Row noMargin>
              <Heading primary="PLANNING" noWrap />
              <SubHeading
                noMargin
                topPadding
                style={{ color: "#F80303", paddingRight: "3rem" }}
                primary={siteMeans}
                bold
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="center" noMargin>
            <Form.Row justifyContent="flex-start" noMargin>
              <div style={{ marginRight: "20px", width: 250 }}>
                <DatePicker
                  showPopperArrow={true}
                  dateFormat="dd-MM-yyyy"
                  selected={filterDate}
                  popperPlacement="top-start"
                  showYearDropdown
                  placeholderText="Delivery date"
                  onChange={(filterDate) => {
                    setFilterDate(filterDate);
                  }}
                />
              </div>
              {props.location.companyId != null ? (
                <>
                  <FormSelect
                    placeholder="Enterprise"
                    value={enterprise}
                    values={dropdownCompany}
                    style={{ marginRight: "20px", maxWidth: 250 }}
                    onChange={(e) => setEnterprise(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <FormSelect
                    placeholder="Enterprise"
                    values={dropdownCompany}
                    style={{ marginRight: "20px", maxWidth: 250 }}
                    onChange={(e) => setEnterprise(e.target.value)}
                  />
                </>
              )}

              <FormSelect
                values={[
                  { value: "Deliveries", label: "Deliveries" },
                  { value: "Means", label: "Means" },
                ]}
                onChange={(e) => {
                  setTypeOfPlaning(e.target.value);
                  if (e.target.value === "Deliveries") {
                    setDeliveriesMeansStatus([
                      { value: "PENDING", label: "PENDING" },
                      { value: "VALIDATED", label: "VALIDATED" },
                      { value: "MODIFIED", label: "MODIFIED" },
                      { value: "ALERTE", label: "ALERTE" },
                    ]);
                  } else if (e.target.value === "Means") {
                    setDeliveriesMeansStatus([
                      { value: "AVAILABLE", label: "AVAILABLE" },
                      { value: "UNAVAILABLE", label: "UNAVAILABLE" },
                    ]);
                  }
                }}
                style={{ marginRight: "20px", maxWidth: 250 }}
              />
              <FormSelect
                placeholder="Status"
                values={deliveriesMeansStatus}
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginRight: "5px", maxWidth: 250 }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <Form.Row justifyContent="flex-start" noMargin>
              {props.location.selectedShape != null ? (
                <>
                  <FormSelect
                    placeholder="Type of place"
                    value={typeOfPlacevalue}
                    values={[
                      { value: "DELIVERYAREA", label: "Delivery area" },
                      { value: "STORAGEAREA", label: "Storage area" },
                      { value: "BUILDING", label: "Emplacement" },
                    ]}
                    style={{ marginRight: "20px", maxWidth: 250 }}
                    onChange={handleChangeTypeOfPlace}
                  />

                  <FormSelect
                    placeholder="place"
                    value={placeId}
                    values={typeOfPlace}
                    style={{ marginRight: "20px", maxWidth: 250 }}
                    onChange={(e) => setPlaceId(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <FormSelect
                    placeholder="Type of place"
                    values={[
                      { value: "DELIVERYAREA", label: "Delivery area" },
                      { value: "STORAGEAREA", label: "Storage area" },
                      { value: "BUILDING", label: "Emplacement" },
                    ]}
                    style={{ marginRight: "20px", maxWidth: 250 }}
                    onChange={handleChangeTypeOfPlace}
                  />

                  <FormSelect
                    placeholder="place"
                    values={typeOfPlace}
                    style={{ marginRight: "20px", maxWidth: 250 }}
                    onChange={(e) => setPlaceId(e.target.value)}
                  />
                </>
              )}
            </Form.Row>
          </Form.Row>
          <div style={{ flexBasis: "100%" }}>
            {events ? (
              <Calendar
                slotPropGetter={slotPropGetter}
                popup
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
                // onSelectSlot={AddEvent}
                // onSelectSlot={AddAvailability}
                startAccessor="start"
                endAccessor="end"
                style={{
                  width: "98%",
                  height: "540px",
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
                date={filterDate}
                onNavigate={(date) => {
                  setFilterDate(date);
                }}
              />
            ) : (
              <h1>Loading.....</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;

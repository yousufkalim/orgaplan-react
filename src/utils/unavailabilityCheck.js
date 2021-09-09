import moment from "moment";

export default function Check(
  currentValue,
  currentDate,
  start,
  end,
  means,
  type,
) {
  let accumulator = [];
  let sameDay = [];
  let msg;
  let status = "";
  let found = false;
  let mean = means;
  let cValue = currentValue.name;
  let cId = currentValue._id;
  let length =
    type === "mean" || type === "storage"
      ? currentValue.unavailability.length
      : currentValue.unavailabilityDates.length;
  let current =
    type === "mean" || type === "storage"
      ? currentValue.unavailability
      : currentValue.unavailabilityDates;

  if (length !== 0) {
    current.find((unavail) => {
      let uDate = moment(unavail.date).format("L");
      if (!moment(currentDate).isSame(uDate)) {
        if (!accumulator.some((acc) => acc["value"] === cId)) {
          accumulator.push({
            value: cId,
            label: cValue,
          });
        }
      } else {
        if (unavail.dayOff) {
          const i = sameDay.findIndex((acc) => acc["value"] === cId);
          sameDay.splice(i, i >= 0 ? 1 : 0);
          status = "hide";
          found = true;
        } else if (
          start >= unavail.startHour &&
          start <= unavail.endHour &&
          end <= unavail.endHour &&
          end >= unavail.startHour
        ) {
          msg = "notFound";
          const i = sameDay.findIndex((acc) => acc["value"] === cId);
          sameDay.splice(i, i >= 0 ? 1 : 0);
          // mean = [];
          status = "hide";
          found = true;
        } else if (
          (unavail.startHour >= start && unavail.startHour < end) ||
          (unavail.endHour <= end && unavail.endHour > start)
        ) {
          if (!found) {
            status = "hide";
            msg = "found";

            if (!sameDay.some((acc) => acc["value"] === cId)) {
              sameDay.push({
                value: cId,
                label: cValue,
              });
            }
          }
        } else {
          if (!found) {
            status = "hide";
            if (!sameDay.some((acc) => acc["value"] === cId)) {
              sameDay.push({
                value: cId,
                label: cValue,
              });
              msg = "notFound";
            }
          }
        }
      }
      return null;
    });
  } else {
    msg = "notFound";
    if (!accumulator.some((acc) => acc["value"] === cId)) {
      accumulator.push({
        value: cId,
        label: cValue,
      });
    }
  }

  return {
    data: status === "hide" ? sameDay : accumulator,
    msg: msg,
    mean: mean,
  };
}

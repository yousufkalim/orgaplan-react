let formats = {
  dateFormat: 'dd',

  dayFormat: (date, , localizer) =>
    localizer.format(date, 'DDD', culture),

  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, { date: 'short' }, culture) + ' — ' +
    localizer.format(end, { date: 'short' }, culture)
}
// export default formats
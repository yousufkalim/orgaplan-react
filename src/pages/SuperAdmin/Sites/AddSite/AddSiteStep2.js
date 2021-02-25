import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import SmallText from "../../../../components/SmallText";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import OpeningTimes from "../../../../components/OpeningTimes";
import UnavailabilityTimes from "../../../../components/UnavailabilityTimes";
import MultiAdderInput from "../../../../components/MultiAdderInput";

const addSiteYup = Yup.object().shape({
  start: Yup.string().required("Required"),
  end: Yup.string().required("Required"),
  openingHours: Yup.object().shape({
    day1Start: Yup.number().required("Required"),
    day1End: Yup.number().required("Required"),
    day2Start: Yup.number().required("Required"),
    day2End: Yup.number().required("Required"),
    day3Start: Yup.number().required("Required"),
    day3End: Yup.number().required("Required"),
    day4Start: Yup.number().required("Required"),
    day4End: Yup.number().required("Required"),
    day5Start: Yup.number().required("Required"),
    day5End: Yup.number().required("Required"),
    day6Start: Yup.number().required("Required"),
    day6End: Yup.number().required("Required"),
    day7Start: Yup.number().required("Required"),
    day7End: Yup.number().required("Required"),
  }),
  unavailabilityDates: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.number().required("Required"),
        date: Yup.date().required("Required"),
        startHour: Yup.number().required("Required"),
        endHour: Yup.number().required("Required"),
        dayOff: Yup.bool().required("Required"),
        reason: Yup.string().optional(),
      }),
    )
    .optional(),
  additionalInfo: Yup.string().optional(),
  notificationPriorToDays: Yup.number().optional(),
  notificationTo: Yup.array().optional(),
});

export default function Profile(props) {
  const theme = useTheme();
  const store = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      console.log("values on Sumbit", values);
      props.setStep2Data(values);

      const notificationTo = values.notificationTo.map((item) => item.label);

      var formdata = new FormData();
      formdata.append("logo", values.logo[0].file);
      formdata.append("name", values.name);
      formdata.append("zacId", values.color);
      formdata.append("adminId", values.color);
      formdata.append("functionality", values.color);
      formdata.append("addresses", values.firstName);
      formdata.append("trades", values.lastName);
      formdata.append("penaltyforLateDelivery", values.email);
      formdata.append("penaltyforUnexpDelivery", values.phone);
      formdata.append("start", values.contractType);
      formdata.append("end", values.contractStartDate);
      formdata.append("openingHours", values.contractEndDate);
      formdata.append("unavailabilityDates", values.functionality);

      formdata.append("additionalInfo", values.additionalInfo);
      formdata.append(
        "notificationPriorToDays",
        values.notificationPriorToDays,
      );
      formdata.append("notificationTo", JSON.stringify(notificationTo));

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.SITE,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      props.setStep(3);
      formik.setSubmitting(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err, "error"),
        ),
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      start: "",
      end: "",
      openingHours: {
        day1Start: 0,
        day1End: 23,
        day2Start: 0,
        day2End: 23,
        day3Start: 0,
        day3End: 23,
        day4Start: 0,
        day4End: 23,
        day5Start: 0,
        day5End: 23,
        day6Start: 0,
        day6End: 23,
        day7Start: 0,
        day7End: 23,
      },
      unavailabilityDates: [],
      additionalInfo: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },
    validationSchema: addSiteYup,
    onSubmit,
    // validateOnBlur: false,
    // validateOnChange: false,
    // validateOnMount: false,
  });

  return (
    <Form.Form onSubmit={formik.handleSubmit}>
      <Form.Row>
        <FormLabel bold primary="SITE DATES* : " />
        <Form.Row width="48%" noMargin>
          <FormInput
            type="date"
            name="start"
            placeholder="Start date"
            value={formik.values.start}
            error={formik.errors.start}
            onChange={formik.handleChange}
            style={GLOBALS.Styles.inputWidth}
          />
          <FormInput
            name="end"
            type="date"
            placeholder="End date"
            value={formik.values.end}
            error={formik.errors.end}
            onChange={formik.handleChange}
            style={GLOBALS.Styles.inputWidth}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="OPENING TIME : " />
        <Form.Row
          noMargin
          width="48%"
          alignItems="center"
          justifyContent="flex-start"
        >
          <OpeningTimes
            name="openingHours"
            style={GLOBALS.Styles.inputWidth}
            values={formik.values.openingHours}
            onBlur={() => formik.setFieldTouched("openingHours", true, true)}
            onChange={(values) => formik.setFieldValue("openingHours", values)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="UNAVAILABILITY TIME :" />
        <Form.Row
          noMargin
          width="48%"
          alignItems="center"
          justifyContent="flex-start"
        >
          <UnavailabilityTimes
            name="unavailabilityDates"
            style={GLOBALS.Styles.inputWidth}
            values={formik.values.unavailabilityDates}
            onBlur={() =>
              formik.setFieldTouched("unavailabilityDates", true, true)
            }
            onChange={(values) =>
              formik.setFieldValue("unavailabilityDates", values)
            }
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
        <FormInput
          textArea
          rows={3}
          name="additionalInfo"
          onChange={formik.handleChange}
          style={GLOBALS.Styles.inputWidth}
          placeholder="Additional information"
          value={formik.values.additionalInfo}
          error={formik.errors.additionalInfo}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="NOTIFICATION : " />
        <Form.Row
          noMargin
          width="48%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormInput
            type="number"
            name="notificationPriorToDays"
            onChange={formik.handleChange}
            value={formik.values.notificationPriorToDays}
            error={formik.errors.notificationPriorToDays}
            style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
          />
          <SmallText
            style={{ marginLeft: 10 }}
            primary="Days before end of the site"
          />
        </Form.Row>
      </Form.Row>
      <Form.Row style={{ alignItems: "flex-start" }}>
        <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
        <MultiAdderInput
          name="notificationTo"
          validateError="Invalid Email"
          style={GLOBALS.Styles.inputWidth}
          placeholder="Enter email address"
          values={formik.values.notificationTo}
          onChange={(values) => formik.setFieldValue("notificationTo", values)}
          validate={(text) => {
            const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
            return !re.test(String(text).toLowerCase());
          }}
        />
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}

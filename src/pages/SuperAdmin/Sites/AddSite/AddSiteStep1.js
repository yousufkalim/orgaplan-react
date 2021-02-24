import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import GLOBALS from "../../../../globals";
import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import SmallText from "../../../../components/SmallText";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import FormSelect from "../../../../components/FormSelect";
import RadioButton from "../../../../components/RadioButton";
import MultiAdderInput from "../../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../../components/FormMultipleUpload";
import MultiAdderInputModal from "../../../../components/MultiAdderInputModal";

const addSiteYup = Yup.object().shape({
  name: Yup.string().required("Required"),
  logo: Yup.array().min(1, "Required").required("Required"),
  zacId: Yup.string().optional(),
  adminId: Yup.string().optional(),
  functionality: Yup.string().required("Required"),
  addresses: Yup.array()
    .of(
      Yup.object().shape({
        street: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        postal: Yup.string().required("Required"),
      }),
    )
    .min(1, "At least one address is required")
    // .max(3)
    .required("Required"),
  trades: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one address is required")
    .required("Required"),
  penaltyforLateDelivery: Yup.number()
    .min(1, "Value should be greater than 0")
    .max(9999)
    .required("Required"),
  penaltyforUnexpDelivery: Yup.number()
    .min(1, "Value should be greater than 0")
    .max(9999)
    .required("Required"),
});

export default function AddSiteStep1(props) {
  const onSubmit = async (values) => {
    console.log("values", values);
    formik.setSubmitting(false);
    // props.setStep1Data(values);
    // props.setStep(2);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      logo: [],
      zacId: "",
      adminId: "",
      functionality: "DELIVERY",
      addresses: [],
      trades: [],
      penaltyforLateDelivery: 0,
      penaltyforUnexpDelivery: 0,
    },
    validationSchema: addSiteYup,
    onSubmit,
  });

  return (
    <>
      <Form.Form onSubmit={formik.handleSubmit}>
        {console.log(formik.errors)}
        {console.log(formik.values)}
        <Form.Row>
          <FormLabel bold primary="SITE NAME* :" />
          <FormInput
            name="name"
            placeholder="Site name"
            value={formik.values.name}
            error={formik.errors.name}
            onChange={formik.handleChange}
            style={GLOBALS.Styles.inputWidth}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE PICTURE : " />
          <FormMultipleUpload
            name="logo"
            error={formik.errors.logo}
            values={formik.values.logo}
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => formik.setFieldValue("logo", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ZAC OF THE SITE : " />
          <Form.Row width="48%" noMargin>
            <FormSelect
              values={[]}
              name="zacId"
              placeholder="ZAC"
              value={formik.values.zacId}
              error={formik.errors.zacId}
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE RESPONSIBLE* :" />
          <Form.Row width="48%" noMargin>
            <FormSelect
              name="adminId"
              placeholder="Admin"
              value={formik.values.adminId}
              error={formik.errors.adminId}
              onChange={formik.handleChange}
              style={GLOBALS.Styles.inputWidth}
              values={[]}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABLE FUNCTIONALITY : " />
          <RadioButton
            name="functionality"
            onChange={formik.handleChange}
            style={GLOBALS.Styles.inputWidth}
            value={formik.values.functionality}
            error={formik.errors.functionality}
            items={[{ value: "DELIVERY", label: "Delivery module" }]}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE ADDRESS(ES)* : " />
          <MultiAdderInputModal
            name="addresses"
            values={formik.values.addresses}
            style={GLOBALS.Styles.inputWidth}
            placeholder="Enter site addresses"
            onChange={(values) => formik.setFieldValue("addresses", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TRADES : " />
          <MultiAdderInput
            name="trades"
            placeholder="Entert trades"
            values={formik.values.trades}
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => formik.setFieldValue("trades", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="COST OF DELIVERY PENALITIES: " />
          <Form.Row width="48%" noMargin>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Delay"
                name="penaltyforLateDelivery"
                onChange={formik.handleChange}
                value={formik.values.penaltyforLateDelivery}
                error={formik.errors.penaltyforLateDelivery}
              />
              <SmallText style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Unexp delivery"
                name="penaltyforUnexpDelivery"
                onChange={formik.handleChange}
                value={formik.values.penaltyforUnexpDelivery}
                error={formik.errors.penaltyforUnexpDelivery}
              />
              <SmallText style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
          </Form.Row>
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
    </>
  );
}

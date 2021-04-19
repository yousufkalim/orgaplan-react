import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import GLOBALS from "../../../../../globals";
import Actions from "../../../../../redux/actions";

import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormLabel from "../../../../../components/FormLabel";
import FormInput from "../../../../../components/FormInput";
import FormCheckbox from "../../../../../components/FormCheckbox";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 15,
    marginTop: 10,
    width: "100%",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function DeliveryRequestStep3(props) { 
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [receiveSummary, setReceiveSummary] = useState(false);

  const [company, setCompany] = useState("");
  const [storageArea, setStorageArea] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [liftingMeans, setLiftingMeans] = useState([]);
  const [routingMeans, setRoutingMeans] = useState([]);

  useEffect(() => {
    let comp = props.companies.find(
      (item) => item.value === props.step1Data.company,
    );
    setCompany(comp.label);
    let deliv = props.deliveryAreas.find(
      (item) => item.value === props.step1Data.deliveryArea,
    );
    setDeliveryArea(deliv.label);
    let stor = props.storageAreas.find(
      (item) => item.value === props.step2Data.storageArea,
    );
    setStorageArea(stor.label);
    let liftMea = props.means.filter((item) =>
      props.step1Data.liftingMeans.includes(item._id),
    );
    setLiftingMeans(liftMea.map((item) => item.name));
    let routMeans = props.means.filter((item) =>
      props.step2Data.routingMeans.includes(item._id),
    );
    setRoutingMeans(routMeans.map((item) => item.name));
    // eslint-disable-next-line
  }, [props]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formdata = JSON.stringify({
        siteId: adminStore.site.siteId._id,
        companyId: props.step1Data.company,
        userId: store.user._id,
        deliveryArea: props.step1Data.deliveryArea,
        storageArea: props.step2Data.storageArea,
        comment: comments,
        sendDeliverySummary: receiveSummary,
        userEmail: store.user.email,
        trades: props.step1Data.trades,
        liftingMeans: props.step1Data.liftingMeans,
        routingMeans: props.step2Data.routingMeans,
        materials: props.step1Data.materials.map((item) => item.label),
        building: props.step2Data.building,
        level: props.step2Data.level,
        date: props.step1Data.date,
        startTime: moment(props.step1Data.startTime).format("HH"),
        endTime: moment(props.step1Data.endTime).format("HH"),
        type: "SCHEDULED",
        status: "VALIDATED",
      });

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.DELIVERY,
        token: store.token,
        body: formdata,
      });

      setLoading(false);  
      props.setAddDelivery(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.content}>
      <Form.Form onSubmit={onSubmit}>
        <Form.Row>
          <FormLabel
            bold
            primary="IDENTITY :"
            style={GLOBALS.Styles.inputWidth}
          />
          <FormLabel primary={company} style={GLOBALS.Styles.inputWidth} />
        </Form.Row>
        <Form.Row>
          <FormLabel
            bold
            primary="DATE AND TIME :"
            style={GLOBALS.Styles.inputWidth}
          />
          <FormLabel
            primary={`${props.step1Data.date} between ${moment(
              props.step1Data.startTime,
            ).format("HH")}h and ${moment(props.step1Data.endTime).format(
              "HH",
            )}h`}
            style={GLOBALS.Styles.inputWidth}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel
            bold
            primary="DELIVERY AREA / MEAN :"
            style={GLOBALS.Styles.inputWidth}
          />
          <FormLabel
            primary={`${deliveryArea} / ${liftingMeans.join(", ")}`}
            style={GLOBALS.Styles.inputWidth}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel
            bold
            primary="STORAGE AREA / MEAN :"
            style={GLOBALS.Styles.inputWidth}
          />
          <FormLabel
            primary={`${storageArea} / ${routingMeans.join(", ")}`}
            style={GLOBALS.Styles.inputWidth}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel
            bold
            primary="MATERIALS DELIVERED :"
            style={GLOBALS.Styles.inputWidth}
          />
          <FormLabel
            primary={props.step1Data.materials
              .map((item) => item.label)
              .join(" ")}
            style={GLOBALS.Styles.inputWidth}
          />
        </Form.Row>
        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="COMMENTS:" />
          <FormInput
            textArea
            rows={3}
            name="comments"
            value={comments}
            placeholder="Comments"
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { value } }) => setComments(value)}
          />
        </Form.Row>
        <Form.Row>
          <div />
          <Form.Row style={GLOBALS.Styles.inputWidth} noMargin>
            <FormCheckbox
              name="receiveSummary"
              checked={receiveSummary}
              label="Receive Summary by e-mail"
              onChange={({ target: { checked } }) => setReceiveSummary(checked)}
            />
          </Form.Row>
        </Form.Row>
        <Form.ButtonContainer>
          <Button
            type="submit"
            minWidth={200}
            text="VALIDATE"
            fullWidth={false}
            loading={loading}
            disabled={loading}
          />
        </Form.ButtonContainer>
      </Form.Form>
    </div>
  );
}

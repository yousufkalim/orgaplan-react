import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch, useSelector } from "react-redux";

import GLOBALS from "../../../../../globals";
import Actions from "../../../../../redux/actions";

import Loader from "../../../../../components/Loader";
import Stepper from "../../../../../components/Stepper";
import Heading from "../../../../../components/Heading";
import DeliveryRequestStep1 from "./DeliveryRequestStep1";
import DeliveryRequestStep2 from "./DeliveryRequestStep2";
import DeliveryRequestStep3 from "./DeliveryRequestStep3";
import { ReactComponent as BackArrow } from "../../../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function DeliveryRequest(props) {
 const {date,start,end}=props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");

  // Step1 Data
  const [companies, setCompanies] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [trades, setTrades] = useState([]);
  const [means, setMeans] = useState([]);
  // Step2 Data
  const [buildings, setBuildings] = useState([]);
  const [storageAreas, setStorageAreas] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_COMPANIES}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const deliveryAreas = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const means = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_MEANS}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const buildings = await GLOBALS.API({
        uri: `${GLOBALS.Constants.BUILDINGS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const storageAreas = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREAS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setMeans(means.data);
      setDeliveryAreas(
        deliveryAreas.data.map((item) => ({
          value: item._id,
          label: item.name,
        })),
      );
      setCompanies(
        response.data.companies.map((company) => ({
          label: company.companyId.name,
          value: company.companyId._id,
        })),
      );
      setTrades(
        adminStore.site.siteId.trades.map((trade) => ({
          label: trade,
          value: trade,
        })),
      );
      setStorageAreas(
        storageAreas.data.map((item) => ({
          value: item._id,
          label: item.name,
        })),
      );
      setBuildings(buildings.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="Delivery Request" />
      <Stepper
        step={step}
        setStep={setStep}
        steps={[
          "Step 1: Delivery Area",
          "Step 2: Storage Area",
          "Text 1: Confirmation",
        ]}
      />
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : step === 1 ? (
          <DeliveryRequestStep1
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            companies={companies}
            deliveryAreas={deliveryAreas}
            trades={trades}
            means={means}  
          />  
        ) : step === 2 ? (
          <DeliveryRequestStep2
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            means={means}
            storageAreas={storageAreas}
            buildings={buildings}
          />
        ) : (
          <DeliveryRequestStep3
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            companies={companies}
            deliveryAreas={deliveryAreas}
            trades={trades}
            means={means}
            storageAreas={storageAreas}
            buildings={buildings}
            history={props.history}
            setAddDelivery = {props.setAddDelivery}
          />
        )}
      </div>
    </div>
  );
}

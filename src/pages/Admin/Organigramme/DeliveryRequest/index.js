import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { useSelector } from "react-redux";

import GLOBALS from "../../../../globals";
import Stepper from "../../../../components/Stepper";
import Heading from "../../../../components/Heading";
import DeliveryRequestStep1 from "./DeliveryRequestStep1";
import DeliveryRequestStep2 from "./DeliveryRequestStep2";
import DeliveryRequestStep3 from "./DeliveryRequestStep3";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";

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
  const classes = useStyles();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");

  const [companies, setCompanies] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [trades, setTrades] = useState([]);
  const [unloadingMeans, setUnloadingMeans] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    const response = await GLOBALS.API({
      uri: `${GLOBALS.Constants.GET_SITE_COMPANIES}/${adminStore.site.siteId._id}`,
      token: store.token,
    });
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
        {step === 1 ? (
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
            means={unloadingMeans}
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
          />
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../../globals";
import AddSiteStep1 from "./AddSiteStep1";
import AddSiteStep2 from "./AddSiteStep2";
import AddSiteStep3 from "./AddSiteStep3";
import Stepper from "../../../../components/Stepper";
import Heading from "../../../../components/Heading";
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

export default function AddSite(props) {
  const classes = useStyles();

  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");
  const [siteCreated, setSiteCreated] = useState("");

  const onSubmit = () => {
    console.log("onSubmit", {
      step1Data,
      step2Data,
      siteCreated,
    });
    setSiteCreated("");
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="CREATE A SITE" />
      <Stepper
        disabled
        step={step}
        setStep={setStep}
        steps={["Step 1: General Information", "Step 2: Dates", "Text 1: PIC"]}
      />
      <div className={classes.content}>
        {step === 1 ? (
          <AddSiteStep1
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            setStep1Data={setStep1Data}
          />
        ) : step === 2 ? (
          <AddSiteStep2
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            setStep2Data={setStep2Data}
          />
        ) : (
          <AddSiteStep3
            {...props}
            step={step}
            setStep={setStep}
            onSubmit={onSubmit}
            step2Data={step2Data}
            siteCreated={siteCreated}
          />
        )}
      </div>
    </div>
  );
}

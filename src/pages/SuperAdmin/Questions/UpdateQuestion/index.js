import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { TEXTS } from "../../../../assets/languages/french";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Stepper from "../../../../components/Stepper";
import Heading from "../../../../components/Heading";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";

import UpdateQuestionStep1 from "./UpdateQuestionStep1";
import UpdateQuestionStep2 from "./UpdateQuestionStep2";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function UpdateQuestion(props) {
  const { EDIT_FAQ_QUESTION, General_Information } = TEXTS;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [questionDatas, setQuestionDatas] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FAQ}/${props.match.params.id}`,
      });

      setQuestionDatas(response.data);

      setLoading(false);

    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function refreshQuestionDatas() {
    fetchData();
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={EDIT_FAQ_QUESTION} />
      <Stepper
        step={step}
        setStep={setStep}
        steps={[
          `${General_Information}`,
          "Etape(s) de la solution"
        ]}
      />
      <div className={classes.content}>
        {!loading &&
          (step === 1 ? (
            <UpdateQuestionStep1
              {...props}
              questionDatas={questionDatas}
              refreshQuestionDatas={refreshQuestionDatas}
            />
          ) : (
            <UpdateQuestionStep2
              {...props}
              questionDatas={questionDatas}
              refreshQuestionDatas={refreshQuestionDatas}
            />
          ))}
      </div>
    </div>
  );
}

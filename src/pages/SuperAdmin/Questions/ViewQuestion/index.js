import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";

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

export default function ViewQuestion(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [solutionSteps, setSolutionSteps] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FAQ}/${props.match.params.id}`,
      });
      response = response.data;

      const solutions = response.steps.map((solutionStep, index) => ({
        ...solutionStep,
        key: index
      }));

      setQuestion(response.question);
      setAnswer(response.answer);

      setSolutionSteps(solutions);

      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <div className={classes.content}>
        {!loading &&
            (
                <div>
                    <Form.Row alignItems="flex-start">
                        <Heading primary={question} />
                    </Form.Row>
                    <br/>
                    <Form.Row style={{whiteSpace: "pre-wrap"}} alignItems="flex-start">
                        {answer}
                    </Form.Row>
                    <br/>
                    {solutionSteps.map((step, index) => {
                        return (
                            <div key={index}>
                                <Form.Row alignItems="flex-start">
                                    <Heading primary={`Etape ${index + 1} de la solution`} />
                                </Form.Row>
                                { step.picture ? (
                                    <Form.Row>
                                        <img
                                            src={GLOBALS.Constants.BASE_URL + step.picture}
                                            alt="stepImage"
                                            width="400" height="400"
                                            className={classes.image}
                                        />
                                    </Form.Row>
                                ) : null}
                                <Form.Row alignItems="flex-start" style={{whiteSpace: "pre-wrap"}}>
                                    {step.text}
                                </Form.Row>
                                <br/>
                            </div>
                        )
                    })}
                </div>
            )}
      </div>
    </div>
  );
}

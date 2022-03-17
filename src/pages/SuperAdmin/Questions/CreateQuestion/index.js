import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { TEXTS } from "../../../../assets/languages/french";

import Form from "../../../../components/Form";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import Button from "../../../../components/Button";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

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

export default function CreateQuestion(props) {
  const {
    CREATE_A_FAQ_QUESTION,
    FAQ_QUESTION_TITLE,
    FAQ_ANSWER_TITLE,
    VALIDATE
  } = TEXTS;

  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");

  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");

  const questionValidation = (value) => {
    setQuestionError((value?.trim() === "") ? "Le champs est requis" : "")
  };

  const answerValidation = (value) => {
    setAnswerError((value?.trim() === "") ? "Le champs est requis" : "")
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    var values = {
      question: question,
      answer: answer,
      createdAt: Date.now(),
      steps: []
    }

    try {
      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.FAQ,
        token: store.token,
        body: JSON.stringify(values),
      });

      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(response.message, "success"),
        ),
      );
    
      props.history.replace("/questions/edit/" + response.data._id);

    } catch(err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const isValid = () => {
    return !!(!question ||
    questionError ||
    !answer ||
    answerError)
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary={CREATE_A_FAQ_QUESTION} />
      <div className={classes.content}>
        {!loading &&
          <div>
            <Form.Row>
             <FormLabel bold primary={`${FAQ_QUESTION_TITLE}* :`} />
              <FormInput
                name="question"
                value={question}
                maxLength="180"
                placeholder={FAQ_QUESTION_TITLE}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { value } }) => setQuestion(value)}
                onBlur={({ target: { value } }) => questionValidation(value)}
                error={questionError}
              />
            </Form.Row>
            <br/>
            <Form.Row>
              <FormLabel bold primary={`${FAQ_ANSWER_TITLE}* : `} />
              <FormInput
                textArea
                rows={3}
                name="answer"
                value={answer}
                placeholder={FAQ_ANSWER_TITLE}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { value } }) => setAnswer(value)}
                onBlur={({ target: { value } }) => answerValidation(value)}
                error={answerError}
              />
            </Form.Row>
          </div>
          }
          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text={VALIDATE}
              fullWidth={false}
              disabled={isValid()}
              onClick={(e) => onSubmit(e)}
              loading={loading}
            />
          </Form.ButtonContainer>
      </div>
    </div>
  );
}

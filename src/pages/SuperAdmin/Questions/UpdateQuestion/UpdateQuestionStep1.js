import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import { TEXTS } from "../../../../assets/languages/french";

export default function UpdateQuestionStep1(props) {
  const {
    FAQ_QUESTION_TITLE,
    FAQ_ANSWER_TITLE,
    VALIDATE,
  } = TEXTS;

  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");

  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [props.questionDatas]);

  const isValid = () => {
    return !!(!question ||
    questionError ||
    !answer ||
    answerError)
  }

  async function fetchData() {
    setLoading(true);
    
    const datas = props.questionDatas;

    datas.question && setQuestion(datas.question);
    datas.answer && setAnswer(datas.answer);

    setLoading(false);
  }

  const genericValidation = (value, setErrorCallback) => {
    setErrorCallback((value?.trim() === "") ? "Le champs est requis" : "")
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const id = props.match.params.id;
    var values = {
      _id: id,
      question: question,
      answer: answer
    }

    try {
      const response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.FAQ}/${id}`,
        token: store.token,
        body: JSON.stringify(values),
      });

      props.refreshQuestionDatas();

      setLoading(false);
      
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(response.message, "success"),
        ),
      );

    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <>
      <Form.Form onSubmit={onSubmit}>
        <Form.Row>
          <FormLabel bold primary={`${FAQ_QUESTION_TITLE}* :`} />
          <FormInput
            name="question"
            value={question}
            maxLength="180"
            placeholder={FAQ_QUESTION_TITLE}
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { value } }) => setQuestion(value)}
            onBlur={({ target: { value } }) => genericValidation(value, setQuestionError)}
            error={questionError}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary={`${FAQ_ANSWER_TITLE} : `} />
          <FormInput
            textArea
            rows={3}
            name="answer"
            value={answer}
            placeholder={FAQ_ANSWER_TITLE}
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { value } }) => setAnswer(value)}
            onBlur={({ target: { value } }) => genericValidation(value, setAnswerError)}
            error={answerError}
          />
        </Form.Row>
        <Form.ButtonContainer>
          <Button
            type="submit"
            minWidth={200}
            text={VALIDATE}
            fullWidth={false}
            loading={loading}
            disabled={isValid()}
          />
        </Form.ButtonContainer>
      </Form.Form>
    </>
  );
}

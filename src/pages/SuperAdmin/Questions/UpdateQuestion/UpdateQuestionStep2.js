import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TEXTS } from "../../../../assets/languages/french";

import GLOBALS from "../../../../globals";

import Actions from "../../../../redux/actions";
import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import UpdateStep from "./UpdateStep";

export default function UpdateQuestionStep2(props) {
  const {
    Are_you_sure_to_Delete
  } = TEXTS;

  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [questionId, setQuestionId] = useState("");
  const [solutionSteps, setSolutionSteps] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [props.questionDatas]);

  async function fetchData() {
    setLoading(true);

    const datas = props.questionDatas;

    props.match.params.id && setQuestionId(props.match.params.id);
    setSolutionSteps(datas.steps?.length ? datas.steps: []);

    setLoading(false);
  }

  const addStep = () => {
    const clone = [...solutionSteps];
    clone.push({_id: null, text: null, picture: null});
    
    setSolutionSteps(clone);
  }

  const createStep = async (formdata) => {
    setLoading(true);

    try {
      const response = await GLOBALS.API({
        method: "POST",
        uri: `${GLOBALS.Constants.FAQ}/${questionId}/steps`,
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        body: formdata,
      });

      props.refreshQuestionDatas();

      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(response.message, "success"),
        ),
      );

    } catch(err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const updateStep = async (formdata, id) => {
    setLoading(true);

    try {
      const response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.FAQ}/${questionId}/steps/${id}`,
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        body: formdata,
      });

      props.refreshQuestionDatas();

      setLoading(false);

      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(response.message, "success"),
        ),
      );

    } catch(err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const deleteStep = async (index) => {
    let clone = [...solutionSteps];
    const step = clone[index];

    if(!step?._id) {
      clone.splice(index, 1);
      setSolutionSteps(clone);

    } else {

      try {
        if (window.confirm(Are_you_sure_to_Delete)) {
          setLoading(true);
          
          const response = await GLOBALS.API({
            method: "DELETE",
            token: store.token,
            uri: `${GLOBALS.Constants.FAQ}/${questionId}/steps/${step._id}`,
          });
          
          props.refreshQuestionDatas();

          setLoading(false);
  
          dispatch(
            Actions.notistack.enqueueSnackbar(
              Actions.notistack.snackbar(response.message, "success"),
            ),
          );
        }
      } catch (err) {
        setLoading(false);
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(err.message, "error"),
          ),
        );
      }
    }
  }

  return (
    <>
        <div>
            {solutionSteps.map((step, index) => {
                return (
                  <div key={index}>
                    <UpdateStep
                      number={index + 1}
                      step={step}
                      createStep={createStep}
                      updateStep={updateStep}
                      deleteStep={() => deleteStep(index)} />
                  </div>
                )
            })}
            <Form.ButtonContainer>
                <Button
                  type="button"
                  minWidth={600}
                  color="#2980b9"
                  text="Ajouter une étape"
                  fullWidth={false}
                  loading={loading}
                  disabled={
                    loading ||
                    solutionSteps?.length === 5
                  }
                  onClick={() => addStep()}
                />
            </Form.ButtonContainer>
      </div>
    </>
  );
}
